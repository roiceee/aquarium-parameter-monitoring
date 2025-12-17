import {onValueWritten} from "firebase-functions/v2/database";
import * as logger from "firebase-functions/logger";
import {getMessaging, TokenMessage} from "firebase-admin/messaging";
import {getDatabase} from "firebase-admin/database";
import {getFirestore} from "firebase-admin/firestore";
import type {AlertType, AlertLevel} from "./types";
import {
  canSendNotification,
  updateNotificationTimestamp,
  getAlertMessage,
} from "./utils";

/**
 * Database trigger to check sensor thresholds and send notifications
 * Triggered on any write to /sensors path
 */
export const checkSensorThresholds = onValueWritten(
  {ref: "/sensors", region: "asia-southeast1"},
  async (event) => {
    const sensorData = event.data.after.val();

    if (!sensorData) {
      logger.warn("No sensor data found in database trigger");
      return;
    }

    logger.info("Sensor data changed, checking thresholds", {
      sensorData,
      structuredData: true,
    });

    // Fetch thresholds from database
    const db = getDatabase();
    const thresholdsSnapshot = await db.ref("thresholds").get();
    const thresholds = thresholdsSnapshot.val();

    if (!thresholds) {
      logger.warn("No thresholds configured in database");
      return;
    }

    /**
     * Helper function to check and send notification
     * @param {AlertType} type - The type of sensor
     * @param {number} currentValue - Current sensor value
     * @param {Object} threshold - Min/max thresholds
     * @return {Promise<void>} Promise that resolves when complete
     */
    async function checkAndSendNotification(
      type: AlertType,
      currentValue: number,
      threshold: { min: number; max: number }
    ) {
      let level: AlertLevel | null = null;
      let thresholdValue: number;

      if (currentValue < threshold.min) {
        level = "low";
        thresholdValue = threshold.min;
      } else if (currentValue > threshold.max) {
        level = "high";
        thresholdValue = threshold.max;
      } else {
        // Value is within threshold
        return;
      }

      // Check if notification can be sent (throttling)
      const canSend = await canSendNotification(db, type, level);
      if (!canSend) {
        logger.info("Notification throttled", {
          type,
          level,
          structuredData: true,
        });
        return;
      }

      // Format alert message
      const {title, body} = getAlertMessage(
        type,
        level,
        currentValue,
        thresholdValue
      );

      // Retrieve all active FCM tokens from Firestore
      const firestore = getFirestore();
      const tokensSnapshot = await firestore
        .collection("fcmTokens")
        .where("active", "==", true)
        .get();

      if (tokensSnapshot.empty) {
        logger.warn("No active FCM tokens found in Firestore");
        return;
      }

      logger.info(`Found ${tokensSnapshot.size} active FCM tokens`);

      // Prepare notification payload
      const notificationPayload = {
        title,
        body,
        icon: "https://aquamonitor.roice.xyz/pwa-64x64.png",
      };

      const webpushConfig = {
        notification: {
          ...notificationPayload,
          requireInteraction: true,
          tag: `${type}-${level}`,
        },
        fcmOptions: {
          link: "https://aquamonitor.roice.xyz",
        },
        data: {
          type,
          level,
          currentValue: currentValue.toString(),
          thresholdValue: thresholdValue.toString(),
        },
      };

      // Send notification to each token
      const sendPromises = tokensSnapshot.docs.map(async (doc) => {
        const tokenData = doc.data();
        const token = tokenData.token;

        const message: TokenMessage = {
          token,
          webpush: webpushConfig,
        };

        try {
          const response = await getMessaging().send(message);
          logger.info("Notification sent successfully", {
            messageId: response,
            token: token.substring(0, 20) + "...",
            type,
            level,
            structuredData: true,
          });
          return {success: true, token};
        } catch (error) {
          logger.error("Error sending notification to token", {
            error: error instanceof Error ? error.message : String(error),
            token: token.substring(0, 20) + "...",
            type,
            level,
            structuredData: true,
          });

          // If token is invalid, mark it as inactive
          if (
            error instanceof Error &&
            (error.message.includes("registration-token-not-registered") ||
              error.message.includes("invalid-registration-token"))
          ) {
            await firestore.collection("fcmTokens").doc(doc.id).update({
              active: false,
              lastError: error.message,
              lastErrorAt: new Date(),
            });
            logger.info("Marked token as inactive", {
              token: token.substring(0, 20) + "...",
            });
          }

          return {success: false, token, error};
        }
      });

      const results = await Promise.allSettled(sendPromises);
      const successCount = results.filter(
        (r) => r.status === "fulfilled" && r.value.success
      ).length;

      logger.info("Notification batch complete", {
        total: tokensSnapshot.size,
        successful: successCount,
        failed: tokensSnapshot.size - successCount,
        type,
        level,
        structuredData: true,
      });

      // Update timestamp after sending
      await updateNotificationTimestamp(db, type, level);
    }

    // Check all three sensor types
    const checks = [];
    if (sensorData.ph !== undefined && thresholds.ph) {
      checks.push(checkAndSendNotification("ph", sensorData.ph, thresholds.ph));
    }
    if (sensorData.temperature !== undefined && thresholds.temperature) {
      checks.push(
        checkAndSendNotification(
          "temperature",
          sensorData.temperature,
          thresholds.temperature
        )
      );
    }
    if (sensorData.tds !== undefined && thresholds.tds) {
      checks.push(
        checkAndSendNotification("tds", sensorData.tds, thresholds.tds)
      );
    }

    // Wait for all checks to complete
    await Promise.all(checks);

    logger.info("Threshold check completed", {structuredData: true});
  }
);

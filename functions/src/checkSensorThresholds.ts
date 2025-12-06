import { onValueWritten } from "firebase-functions/v2/database";
import * as logger from "firebase-functions/logger";
import { getMessaging, Message } from "firebase-admin/messaging";
import { getDatabase } from "firebase-admin/database";
import type { AlertType, AlertLevel } from "./types";
import { TOPIC } from "./constants";
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
  { ref: "/sensors", region: "asia-southeast1" },
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
      const { title, body } = getAlertMessage(
        type,
        level,
        currentValue,
        thresholdValue
      );

      const message: Message = {
        topic: TOPIC,
        webpush: {
          notification: {
            title,
            body,
            icon: "https://aquamonitor.roice.xyz/pwa-64x64.png",
            requireInteraction: true,
            tag: `${type}-${level}`,
          },
          fcmOptions: {
            link: "/",
          },
        },
        data: {
          type,
          level,
          currentValue: currentValue.toString(),
          thresholdValue: thresholdValue.toString(),
        },
      };

      try {
        const response = await getMessaging().send(message);
        await updateNotificationTimestamp(db, type, level);

        logger.info("Notification sent from database trigger", {
          messageId: response,
          type,
          level,
          structuredData: true,
        });
      } catch (error) {
        logger.error("Error sending notification from database trigger", {
          error: error instanceof Error ? error.message : String(error),
          type,
          level,
          structuredData: true,
        });
      }
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

    logger.info("Threshold check completed", { structuredData: true });
  }
);

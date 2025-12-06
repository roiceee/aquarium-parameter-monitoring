import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {getMessaging, type Message} from "firebase-admin/messaging";
import {getDatabase} from "firebase-admin/database";
import {type AlertPayload} from "./types";
import {TOPIC, NOTIFICATION_COOLDOWN_MS} from "./constants";
import {
  canSendNotification,
  updateNotificationTimestamp,
  getAlertMessage,
} from "./utils";

/**
 * HTTP endpoint to send notifications manually (for testing)
 */
export const sendNotification = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  logger.info("sendNotification called", {structuredData: true});

  const {type, level, currentValue, thresholdValue}: AlertPayload = req.body;

  if (
    !type ||
    !level ||
    currentValue === undefined ||
    thresholdValue === undefined
  ) {
    logger.error("Invalid alert payload", {structuredData: true});
    res.status(400).send("Invalid alert payload");
    return;
  }

  const db = getDatabase();

  // Check if notification can be sent (throttling)
  const canSend = await canSendNotification(db, type, level);
  if (!canSend) {
    logger.info("Notification throttled - cooldown period not elapsed", {
      type,
      level,
      cooldownMinutes: NOTIFICATION_COOLDOWN_MS / 60000,
      structuredData: true,
    });
    res.status(429).json({
      success: false,
      message: "Notification throttled - please wait before sending again",
      cooldownMinutes: NOTIFICATION_COOLDOWN_MS / 60000,
    });
    return;
  }

  // Format alert message with recommendations
  const {title: alertTitle, body: alertBody} = getAlertMessage(
    type,
    level,
    currentValue,
    thresholdValue
  );

  const message: Message = {
    topic: TOPIC,
    webpush: {
      notification: {
        title: alertTitle,
        body: alertBody,
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

    // Update timestamp after successful send
    await updateNotificationTimestamp(db, type, level);

    logger.info("Notification sent successfully", {
      messageId: response,
      type,
      level,
      structuredData: true,
    });
    res.status(200).json({
      success: true,
      message: "Notification sent!",
      messageId: response,
    });
  } catch (error) {
    logger.error("Error sending notification", {
      error: error instanceof Error ? error.message : String(error),
      structuredData: true,
    });
    res.status(500).json({
      success: false,
      message: "Error sending notification",
    });
  }
});

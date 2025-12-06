import * as logger from "firebase-functions/logger";
import type {Database} from "firebase-admin/database";
import {type AlertType, type AlertLevel} from "./types";
import {NOTIFICATION_COOLDOWN_MS} from "./constants";

/**
 * Check if notification can be sent based on cooldown period
 * @param {Database} db - The Firebase Realtime Database instance
 * @param {AlertType} type - The type of sensor alert
 * @param {AlertLevel} level - The alert level (low or high)
 * @return {Promise<boolean>} True if notification can be sent
 */
export async function canSendNotification(
  db: Database,
  type: AlertType,
  level: AlertLevel
): Promise<boolean> {
  const key = `${type}-${level}`;
  const lastSentRef = db.ref(`notificationTimestamps/${key}`);

  try {
    const snapshot = await lastSentRef.get();
    const lastSentTime = snapshot.val();

    if (!lastSentTime) {
      // Never sent before
      return true;
    }

    const timeSinceLastSent = Date.now() - lastSentTime;
    return timeSinceLastSent >= NOTIFICATION_COOLDOWN_MS;
  } catch (error) {
    logger.error("Error checking notification timestamp", {
      error: error instanceof Error ? error.message : String(error),
      structuredData: true,
    });
    // If error checking, allow sending (fail open)
    return true;
  }
}

/**
 * Update last sent timestamp for a notification
 * @param {Database} db - The Firebase Realtime Database instance
 * @param {AlertType} type - The type of sensor alert
 * @param {AlertLevel} level - The alert level (low or high)
 * @return {Promise<void>}
 */
export async function updateNotificationTimestamp(
  db: Database,
  type: AlertType,
  level: AlertLevel
): Promise<void> {
  const key = `${type}-${level}`;
  const lastSentRef = db.ref(`notificationTimestamps/${key}`);

  try {
    await lastSentRef.set(Date.now());
  } catch (error) {
    logger.error("Error updating notification timestamp", {
      error: error instanceof Error ? error.message : String(error),
      structuredData: true,
    });
  }
}

/**
 * Format alert message with recommendations
 * @param {AlertType} type - The type of sensor alert
 * @param {AlertLevel} level - The alert level (low or high)
 * @param {number} currentValue - The current sensor reading
 * @param {number} thresholdValue - The threshold that was crossed
 * @return {Object} Alert title and body message
 */
export function getAlertMessage(
  type: AlertType,
  level: AlertLevel,
  currentValue: number,
  thresholdValue: number
): { title: string; body: string } {
  const levelText = level === "low" ? "Low" : "High";
  const title = `Alert: ${type.toUpperCase()} ${levelText}`;

  let body = `${type.toUpperCase()} is ${
    level === "low" ? "below" : "above"
  } threshold. Current: ${currentValue}, Threshold: ${thresholdValue}`;

  // Add specific recommendations for TDS
  if (type === "tds") {
    body +=
      level === "low" ?
        ". Consider water changes to increase mineral content." :
        ". Consider water changes to reduce mineral buildup.";
  }

  return {title, body};
}

import { onSchedule } from "firebase-functions/v2/scheduler";
import { getDatabase } from "firebase-admin/database";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { app } from "./index";
import type { SensorData } from "./types";

/**
 * Scheduled function that logs sensor data to Firestore every minute
 * Reads current sensor values from RTDB and stores them in Firestore
 * with timestamp for historical tracking and analytics
 *
 * Note: Cloud Scheduler minimum interval is 1 minute
 *
 * @returns {Promise<void>} Resolves when data is successfully logged
 */
export const scheduledDataLogger = onSchedule(
  {
    schedule: "* * * * *", // Run every minute (cron format)
    region: "asia-southeast1",
    timeZone: "Asia/Singapore",
  },
  async () => {
    const db = getDatabase(app);
    const firestore = getFirestore(app);

    try {
      // Read current sensor data from RTDB
      const snapshot = await db.ref("sensors").once("value");
      const sensorData = snapshot.val() as SensorData;

      // Validate that we have data
      if (
        !sensorData ||
        sensorData.ph === undefined ||
        sensorData.temperature === undefined ||
        sensorData.tds === undefined
      ) {
        console.warn("Incomplete sensor data, skipping log entry");
        return;
      }

      // Store in Firestore with timestamp
      await firestore.collection("sensorLogs").add({
        ph: sensorData.ph,
        temperature: sensorData.temperature,
        tds: sensorData.tds,
        timestamp: FieldValue.serverTimestamp(),
      });

      console.log("Sensor data logged successfully:", sensorData);
    } catch (error) {
      console.error("Error logging sensor data:", error);
      throw error;
    }
  }
);

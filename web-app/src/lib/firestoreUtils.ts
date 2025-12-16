import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "./firebase";
import type { SensorLog } from "../types/index";

/**
 * Fetch sensor logs from Firestore
 * @param maxLogs - Maximum number of logs to retrieve (default: 100)
 * @returns Promise<SensorLog[]> - Array of sensor logs with timestamps
 */
export async function fetchSensorLogs(
  maxLogs: number = 100
): Promise<SensorLog[]> {
  try {
    const logsRef = collection(firestore, "sensorLogs");
    const q = query(logsRef, orderBy("timestamp", "desc"), limit(maxLogs));
    const querySnapshot = await getDocs(q);

    const logs: SensorLog[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      logs.push({
        id: docSnapshot.id,
        ph: data.ph,
        temperature: data.temperature,
        tds: data.tds,
        timestamp:
          data.timestamp instanceof Timestamp
            ? data.timestamp.toDate()
            : new Date(data.timestamp),
      });
    });

    return logs;
  } catch (error) {
    console.error("Error fetching sensor logs:", error);
    throw error;
  }
}

/**
 * Clear all sensor logs from Firestore
 * @returns Promise<void>
 */
export async function clearSensorLogs(): Promise<void> {
  try {
    const logsRef = collection(firestore, "sensorLogs");
    const querySnapshot = await getDocs(logsRef);

    const deletePromises = querySnapshot.docs.map((docSnapshot) =>
      deleteDoc(doc(firestore, "sensorLogs", docSnapshot.id))
    );

    await Promise.all(deletePromises);
    console.log("All sensor logs cleared successfully");
  } catch (error) {
    console.error("Error clearing sensor logs:", error);
    throw error;
  }
}

import type { SensorData, Thresholds, AlertStatus } from "../types/index.ts";

/**
 * Evaluates sensor readings against thresholds and generates alert statuses.
 * Returns array of alerts for parameters that are out of range, or success if all normal.
 */
export function getStatus(
  sensorData: SensorData,
  thresholds: Thresholds
): AlertStatus[] {
  const alerts: AlertStatus[] = [];

  // Check pH levels
  if (sensorData.ph < thresholds.ph.min) {
    alerts.push({ type: "warning", message: "pH Too Low" });
  } else if (sensorData.ph > thresholds.ph.max) {
    alerts.push({ type: "warning", message: "pH Too High" });
  }

  // Check temperature levels
  if (sensorData.temperature < thresholds.temperature.min) {
    alerts.push({ type: "warning", message: "Temperature Too Low" });
  } else if (sensorData.temperature > thresholds.temperature.max) {
    alerts.push({ type: "warning", message: "Temperature Too High" });
  }

  // Check TDS levels
  if (sensorData.tds < thresholds.tds.min) {
    alerts.push({ type: "info", message: "TDS Below Threshold" });
  } else if (sensorData.tds > thresholds.tds.max) {
    alerts.push({ type: "warning", message: "Needs Water Change" });
  }

  // Default success message if no alerts
  if (alerts.length === 0) {
    alerts.push({ type: "success", message: "All Parameters Normal" });
  }

  return alerts;
}

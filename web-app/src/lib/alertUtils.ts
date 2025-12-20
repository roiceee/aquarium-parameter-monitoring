import type { SensorData, Thresholds, AlertStatus } from "../types/index.ts";

/**
 * Format alert message with recommendations (matches server-side logic)
 */
function getAlertMessage(
  type: "ph" | "temperature" | "tds",
  level: "low" | "high",
  currentValue: number,
  thresholdValue: number
): string {
  let message = `${type.toUpperCase()} is ${
    level === "low" ? "below" : "above"
  } threshold. Current: ${currentValue}, Threshold: ${thresholdValue}`;

  // Add specific recommendations based on sensor type
  if (type === "tds") {
    message +=
      level === "low"
        ? ". Consider water changes to increase mineral content."
        : ". Consider water changes to reduce mineral buildup.";
  } else if (type === "temperature") {
    message +=
      level === "low"
        ? ". Check heater functionality and room temperature."
        : ". Increase aeration, reduce lighting, or check cooling system.";
  } else if (type === "ph") {
    message +=
      level === "low"
        ? ". Add pH buffer or baking soda gradually to raise pH."
        : ". Perform water change or add pH down solution to lower pH.";
  }

  return message;
}

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
    alerts.push({
      type: "warning",
      message: getAlertMessage("ph", "low", sensorData.ph, thresholds.ph.min),
    });
  } else if (sensorData.ph > thresholds.ph.max) {
    alerts.push({
      type: "warning",
      message: getAlertMessage("ph", "high", sensorData.ph, thresholds.ph.max),
    });
  }

  // Check temperature levels
  if (sensorData.temperature < thresholds.temperature.min) {
    alerts.push({
      type: "warning",
      message: getAlertMessage(
        "temperature",
        "low",
        sensorData.temperature,
        thresholds.temperature.min
      ),
    });
  } else if (sensorData.temperature > thresholds.temperature.max) {
    alerts.push({
      type: "warning",
      message: getAlertMessage(
        "temperature",
        "high",
        sensorData.temperature,
        thresholds.temperature.max
      ),
    });
  }

  // Check TDS levels
  if (sensorData.tds < thresholds.tds.min) {
    alerts.push({
      type: "info",
      message: getAlertMessage(
        "tds",
        "low",
        sensorData.tds,
        thresholds.tds.min
      ),
    });
  } else if (sensorData.tds > thresholds.tds.max) {
    alerts.push({
      type: "warning",
      message: getAlertMessage(
        "tds",
        "high",
        sensorData.tds,
        thresholds.tds.max
      ),
    });
  }

  // Default success message if no alerts
  if (alerts.length === 0) {
    alerts.push({ type: "success", message: "All Parameters Normal" });
  }

  return alerts;
}

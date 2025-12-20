import type { SensorData, Thresholds, AlertStatus } from "../types/index";

export function getStatus(
  sensorData: SensorData,
  thresholds: Thresholds
): AlertStatus[] {
  const alerts: AlertStatus[] = [];

  // Check pH
  if (sensorData.ph < thresholds.ph.min) {
    alerts.push({
      type: "warning",
      message: `pH level is too low (${sensorData.ph.toFixed(2)})`,
    });
  } else if (sensorData.ph > thresholds.ph.max) {
    alerts.push({
      type: "warning",
      message: `pH level is too high (${sensorData.ph.toFixed(2)})`,
    });
  }

  // Check temperature
  if (sensorData.temperature < thresholds.temperature.min) {
    alerts.push({
      type: "warning",
      message: `Temperature is too low (${sensorData.temperature.toFixed(
        1
      )}°C)`,
    });
  } else if (sensorData.temperature > thresholds.temperature.max) {
    alerts.push({
      type: "warning",
      message: `Temperature is too high (${sensorData.temperature.toFixed(
        1
      )}°C)`,
    });
  }

  // Check TDS
  if (sensorData.tds < thresholds.tds.min) {
    alerts.push({
      type: "info",
      message: `TDS level is low (${sensorData.tds} ppm)`,
    });
  } else if (sensorData.tds > thresholds.tds.max) {
    alerts.push({
      type: "warning",
      message: `TDS level is high (${sensorData.tds} ppm)`,
    });
  }

  // If no alerts, return success
  if (alerts.length === 0) {
    alerts.push({
      type: "success",
      message: "All parameters are within normal range",
    });
  }

  return alerts;
}

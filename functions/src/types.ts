export type AlertType = "tds" | "ph" | "temperature";
export type AlertLevel = "low" | "high";

export interface AlertPayload {
  type: AlertType;
  level: AlertLevel;
  currentValue: number;
  thresholdValue: number;
}

export interface SensorData {
  ph?: number;
  temperature?: number;
  tds?: number;
}

export interface Thresholds {
  ph?: { min: number; max: number };
  temperature?: { min: number; max: number };
  tds?: { min: number; max: number };
}

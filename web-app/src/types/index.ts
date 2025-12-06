export interface SensorData {
  ph: number;
  temperature: number;
  tds: number;
}

export interface Thresholds {
  ph: { min: number; max: number };
  temperature: { min: number; max: number };
  tds: { min: number; max: number };
}

export interface AlertStatus {
  type: "success" | "warning" | "info";
  message: string;
}

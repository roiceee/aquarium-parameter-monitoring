import { Droplets, Settings, BarChart3, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { SensorCard } from "./components/SensorCard.tsx";
import { StatusAlert } from "./components/StatusAlert.tsx";
import { ThresholdSettings } from "./components/ThresholdSettings.tsx";
import { Analytics } from "./components/Analytics.tsx";
import { Button } from "./components/ui/button.tsx";
import "./index.css";
import { getStatus } from "./lib/alertUtils.ts";
import type { SensorData, Thresholds } from "./types/index.ts";

type ViewMode = "dashboard" | "settings" | "analytics";

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");

  // Static placeholder data
  const [sensorData] = useState<SensorData>({
    ph: 7.2,
    temperature: 25.5,
    tds: 320,
  });

  const [thresholds, setThresholds] = useState<Thresholds>({
    ph: { min: 6.5, max: 8.0 },
    temperature: { min: 22, max: 28 },
    tds: { min: 150, max: 400 },
  });

  const [beepEnabled, setBeepEnabled] = useState<boolean>(true);

  const status = getStatus(sensorData, thresholds);

  // Function to update thresholds (local only in prototype)
  const handleUpdateThresholds = (newThresholds: Thresholds) => {
    setThresholds(newThresholds);
  };

  // Function to toggle beep on/off
  const handleToggleBeep = () => {
    setBeepEnabled(!beepEnabled);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="bg-white border-b-2 border-black px-6 py-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="bg-black p-2">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">Aquarium Monitor [LOFI]</h2>
            </div>
            <div className="flex gap-2">
              <Button
                size={"icon-lg"}
                variant={beepEnabled ? "default" : "secondary"}
                onClick={handleToggleBeep}
                aria-label={beepEnabled ? "Beep On" : "Beep Off"}
                title={beepEnabled ? "Beep: ON" : "Beep: OFF"}
              >
                {beepEnabled ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </Button>
              <Button
                size={"icon-lg"}
                variant={viewMode === "analytics" ? "default" : "secondary"}
                onClick={() =>
                  setViewMode(
                    viewMode === "analytics" ? "dashboard" : "analytics"
                  )
                }
                aria-label="Analytics"
              >
                <BarChart3 className="w-5 h-5 " />
              </Button>
              <Button
                size={"icon-lg"}
                variant={viewMode === "settings" ? "default" : "secondary"}
                onClick={() =>
                  setViewMode(
                    viewMode === "settings" ? "dashboard" : "settings"
                  )
                }
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 " />
              </Button>
            </div>
          </div>
        </div>

        {/* Sensor Cards */}
        {viewMode === "dashboard" ? (
          <>
            <div className="px-6 pt-6 pb-4 space-y-4">
              <SensorCard
                title="pH Level"
                value={sensorData.ph}
                unit=""
                min={thresholds.ph.min}
                max={thresholds.ph.max}
                decimals={2}
                icon="droplet"
              />
              <SensorCard
                title="Temperature"
                value={sensorData.temperature}
                unit="°C"
                min={thresholds.temperature.min}
                max={thresholds.temperature.max}
                decimals={2}
                icon="thermometer"
              />
              <SensorCard
                title="TDS Level"
                value={sensorData.tds}
                unit="ppm"
                min={thresholds.tds.min}
                max={thresholds.tds.max}
                decimals={2}
                icon="waves"
              />
            </div>

            {/* Status Alerts */}
            <div className="px-6 pb-8 space-y-3">
              <h2 className="text-sm text-gray-600 mb-3 font-bold">
                System Status
              </h2>
              {status.map((alert, index) => (
                <StatusAlert
                  key={index}
                  type={alert.type}
                  message={alert.message}
                />
              ))}
            </div>
          </>
        ) : viewMode === "settings" ? (
          <div className="px-6 pb-8">
            <ThresholdSettings
              thresholds={thresholds}
              onUpdate={handleUpdateThresholds}
              onClose={() => setViewMode("dashboard")}
            />
          </div>
        ) : (
          <div className="px-6 py-6">
            <Analytics />
          </div>
        )}
      </div>
    </div>
  );
}

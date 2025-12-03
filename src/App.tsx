import { signInAnonymously } from "firebase/auth";
import { onValue, ref, set } from "firebase/database";
import { Droplets, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { SensorCard } from "./components/SensorCard.tsx";
import { StatusAlert } from "./components/StatusAlert.tsx";
import { ThresholdSettings } from "./components/ThresholdSettings.tsx";
import { Button } from "./components/ui/button.tsx";
import "./index.css";
import { getStatus } from "./lib/alertUtils.ts";
import { auth, database } from "./lib/firebase.ts";
import type { SensorData, Thresholds } from "./types/index.ts";

import ReloadPrompt from "./components/ReloadPrompt.tsx";

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData>({
    ph: 0,
    temperature: 0,
    tds: 0,
  });

  const [thresholds, setThresholds] = useState<Thresholds>({
    ph: { min: 6.5, max: 8.0 },
    temperature: { min: 22, max: 28 },
    tds: { min: 150, max: 400 },
  });

  // Fetch sensor data from Firebase Realtime Database
  useEffect(() => {
    signInAnonymously(auth);
    const sensorRef = ref(database, "sensors");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSensorData({
          ph: data.ph ?? 0,
          temperature: data.temperature ?? 0,
          tds: data.tds ?? 0,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch thresholds from Firebase Realtime Database
  useEffect(() => {
    const thresholdsRef = ref(database, "thresholds");

    const unsubscribe = onValue(thresholdsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setThresholds({
          ph: {
            min: data.ph?.min ?? 6.5,
            max: data.ph?.max ?? 8.0,
          },
          temperature: {
            min: data.temperature?.min ?? 22,
            max: data.temperature?.max ?? 28,
          },
          tds: {
            min: data.tds?.min ?? 150,
            max: data.tds?.max ?? 400,
          },
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const status = getStatus(sensorData, thresholds);

  // Function to update thresholds in Firebase
  const handleUpdateThresholds = (newThresholds: Thresholds) => {
    const thresholdsRef = ref(database, "thresholds");
    set(thresholdsRef, newThresholds);
    setThresholds(newThresholds);
  };

  return (
    <div className="">
      <div className="max-w-lg  mx-auto">
        {/* Header */}
        <div className="bg-white border-b px-6 py-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-gray-900 text-xl font-semibold">
                Aquarium Monitor
              </h2>
            </div>
            <Button
              size={"icon-lg"}
              variant={"secondary"}
              onClick={() => setShowSettings(!showSettings)}
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 " />
            </Button>
          </div>
          <p className="text-sm text-slate-500">Real-time sensor monitoring</p>
        </div>

        {/* Sensor Cards */}
        {!showSettings ? (
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
                color="cyan"
              />
              <SensorCard
                title="Temperature"
                value={sensorData.temperature}
                unit="°C"
                min={thresholds.temperature.min}
                max={thresholds.temperature.max}
                decimals={1}
                icon="thermometer"
                color="blue"
              />
              <SensorCard
                title="TDS Level"
                value={sensorData.tds}
                unit="ppm"
                min={thresholds.tds.min}
                max={thresholds.tds.max}
                decimals={0}
                icon="waves"
                color="indigo"
              />
            </div>

            {/* Status Alerts */}
            <div className="px-6 pb-8 space-y-3">
              <h2 className="text-sm text-gray-500 mb-3">System Status</h2>
              {status.map((alert, index) => (
                <StatusAlert
                  key={index}
                  type={alert.type}
                  message={alert.message}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="px-6 pb-8">
            <ThresholdSettings
              thresholds={thresholds}
              onUpdate={handleUpdateThresholds}
              onClose={() => setShowSettings(false)}
            />
          </div>
        )}
      </div>
      <ReloadPrompt />
    </div>
  );
}

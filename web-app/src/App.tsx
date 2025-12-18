import { signInAnonymously } from "firebase/auth";
import { onValue, ref, set } from "firebase/database";
import { Droplets, Settings, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { SensorCard } from "./components/SensorCard.tsx";
import { StatusAlert } from "./components/StatusAlert.tsx";
import { ThresholdSettings } from "./components/ThresholdSettings.tsx";
import { Analytics } from "./components/Analytics.tsx";
import { Button } from "./components/ui/button.tsx";
import "./index.css";
import { getStatus } from "./lib/alertUtils.ts";
import { auth, database, getTokenFunction } from "./lib/firebase.ts";
import type { SensorData, Thresholds } from "./types/index.ts";

import ReloadPrompt from "./components/ReloadPrompt.tsx";
import { requestNotificationPermission, storeFCMToken } from "./lib/utils.ts";
import "./lib/notificationDebug.ts"; // Enable debug tools in console

type ViewMode = "dashboard" | "settings" | "analytics";

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
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

  // request notification permission on mount
  useEffect(() => {
    async function fetchToken() {
      try {
        // First check if notifications are supported
        if (!("Notification" in window)) {
          console.error("This browser does not support notifications");
          return;
        }

        // Request permission if not already granted
        let permission = Notification.permission;
        if (permission === "default") {
          permission = await requestNotificationPermission();
        }

        if (permission !== "granted") {
          console.log("Notification permission not granted");
          return;
        }

        // Get FCM token
        const token = await getTokenFunction();
        if (token) {
          console.log("FCM Token obtained:", token.substring(0, 20) + "...");

          try {
            await storeFCMToken(token);
            console.log("FCM token stored in Firestore successfully");
          } catch (error) {
            console.error("Failed to store FCM token:", error);
          }
        } else {
          console.error("Failed to obtain FCM token");
        }
      } catch (error) {
        console.error("Error in notification setup:", error);
      }
    }
    fetchToken();
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
            <div className="flex gap-2">
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
          <p className="text-sm text-slate-500">Real-time sensor monitoring</p>
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
                color="cyan"
              />
              <SensorCard
                title="Temperature"
                value={sensorData.temperature}
                unit="°C"
                min={thresholds.temperature.min}
                max={thresholds.temperature.max}
                decimals={2}
                icon="thermometer"
                color="blue"
              />
              <SensorCard
                title="TDS Level"
                value={sensorData.tds}
                unit="ppm"
                min={thresholds.tds.min}
                max={thresholds.tds.max}
                decimals={2}
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
      <ReloadPrompt />
    </div>
  );
}

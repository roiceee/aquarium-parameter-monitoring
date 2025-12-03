import { useState } from "react";
import { Save, X } from "lucide-react";
import type { Thresholds } from "../types";
import { Input } from "./ui/input";

interface ThresholdSettingsProps {
  thresholds: Thresholds;
  onUpdate: (thresholds: Thresholds) => void;
  onClose: () => void;
}

export function ThresholdSettings({
  thresholds,
  onUpdate,
  onClose,
}: ThresholdSettingsProps) {
  const [localThresholds, setLocalThresholds] = useState(thresholds);
  const [errors, setErrors] = useState<{
    ph?: string;
    temperature?: string;
    tds?: string;
  }>({});

  const handleSave = () => {
    // Validate all thresholds before saving
    const newErrors: typeof errors = {};

    if (localThresholds.ph.min >= localThresholds.ph.max) {
      newErrors.ph = "Minimum must be less than maximum";
    }
    if (localThresholds.temperature.min >= localThresholds.temperature.max) {
      newErrors.temperature = "Minimum must be less than maximum";
    }
    if (localThresholds.tds.min >= localThresholds.tds.max) {
      newErrors.tds = "Minimum must be less than maximum";
    }

    setErrors(newErrors);

    // Only save if there are no errors
    if (Object.keys(newErrors).length === 0) {
      onUpdate(localThresholds);
      onClose();
    }
  };

  const updateThreshold = (
    sensor: keyof Thresholds,
    type: "min" | "max",
    value: string
  ) => {
    // Allow empty string for editing
    if (value === "") {
      setLocalThresholds({
        ...localThresholds,
        [sensor]: {
          ...localThresholds[sensor],
          [type]: 0,
        },
      });
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const newThresholds = {
        ...localThresholds,
        [sensor]: {
          ...localThresholds[sensor],
          [type]: numValue,
        },
      };
      setLocalThresholds(newThresholds);

      // Clear error for this sensor if values are now valid
      const sensorThresholds = newThresholds[sensor];
      if (sensorThresholds.min < sensorThresholds.max) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[sensor];
          return newErrors;
        });
      }
    }
  };

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900 font-semibold">Threshold Settings</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-md transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="space-y-6">
        {/* pH Thresholds */}
        <div className="space-y-3">
          <h3 className="text-sm text-slate-600">pH Level</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Minimum
              </label>
              <Input
                type="number"
                step="0.1"
                value={localThresholds.ph.min}
                onChange={(e) => updateThreshold("ph", "min", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Maximum
              </label>
              <Input
                type="number"
                step="0.1"
                value={localThresholds.ph.max}
                onChange={(e) => updateThreshold("ph", "max", e.target.value)}
              />
            </div>
          </div>
          {errors.ph && (
            <p className="text-xs text-red-600 mt-1">{errors.ph}</p>
          )}
        </div>

        {/* Temperature Thresholds */}
        <div className="space-y-3">
          <h3 className="text-sm text-slate-600">Temperature (°C)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Minimum
              </label>
              <Input
                type="number"
                step="0.1"
                value={localThresholds.temperature.min}
                onChange={(e) =>
                  updateThreshold("temperature", "min", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Maximum
              </label>
              <Input
                type="number"
                step="0.1"
                value={localThresholds.temperature.max}
                onChange={(e) =>
                  updateThreshold("temperature", "max", e.target.value)
                }
              />
            </div>
          </div>
          {errors.temperature && (
            <p className="text-xs text-red-600 mt-1">{errors.temperature}</p>
          )}
        </div>

        {/* TDS Thresholds */}
        <div className="space-y-3">
          <h3 className="text-sm text-slate-600">TDS Level (ppm)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Minimum
              </label>
              <Input
                type="number"
                step="10"
                value={localThresholds.tds.min}
                onChange={(e) => updateThreshold("tds", "min", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Maximum
              </label>
              <Input
                type="number"
                step="10"
                value={localThresholds.tds.max}
                onChange={(e) => updateThreshold("tds", "max", e.target.value)}
              />
            </div>
          </div>
          {errors.tds && (
            <p className="text-xs text-red-600 mt-1">{errors.tds}</p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full mt-6 bg-blue-600 text-white py-2.5 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors text-sm shadow-sm"
      >
        <Save className="w-4 h-4" />
        <span>Save Thresholds</span>
      </button>
    </div>
  );
}

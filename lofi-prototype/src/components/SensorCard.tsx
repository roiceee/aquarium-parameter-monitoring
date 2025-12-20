import { Droplet, Thermometer, Waves } from "lucide-react";

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  decimals: number;
  icon: "droplet" | "thermometer" | "waves";
}

export function SensorCard({
  title,
  value,
  unit,
  min,
  max,
  decimals,
  icon,
}: SensorCardProps) {
  const isOutOfRange = value < min || value > max;
  const percentage = Math.min(
    Math.max(((value - min) / (max - min)) * 100, 0),
    100
  );

  const icons = {
    droplet: Droplet,
    thermometer: Thermometer,
    waves: Waves,
  };

  const Icon = icons[icon];

  return (
    <div className="bg-white border-2 border-black p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="border-2 border-black p-2">
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold">{title}</h3>
        </div>
        <div className={`${isOutOfRange ? "font-bold" : ""} text-right`}>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold">{value.toFixed(decimals)}</span>
            {unit && <span className="text-xs text-gray-600">{unit}</span>}
          </div>
        </div>
      </div>

      {/* Progress bar - black and white */}
      <div className="bg-gray-200 h-2 border border-black overflow-hidden mb-2">
        <div
          className="bg-black h-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Range display */}
      <div className="flex justify-between text-xs text-gray-600">
        <span>
          Min: {min.toFixed(decimals)}
          {unit}
        </span>
        <span>
          Max: {max.toFixed(decimals)}
          {unit}
        </span>
      </div>
    </div>
  );
}

import { Droplet, Thermometer, Waves } from "lucide-react";

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  decimals: number;
  icon: "droplet" | "thermometer" | "waves";
  color: "cyan" | "blue" | "indigo";
}

export function SensorCard({
  title,
  value,
  unit,
  min,
  max,
  decimals,
  icon,
  color,
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

  const colorClasses = {
    cyan: {
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      progress: "bg-cyan-600",
      value: isOutOfRange ? "text-red-600" : "text-gray-900",
    },
    blue: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      progress: "bg-blue-600",
      value: isOutOfRange ? "text-red-600" : "text-gray-900",
    },
    indigo: {
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      progress: "bg-indigo-600",
      value: isOutOfRange ? "text-red-600" : "text-gray-900",
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`${colors.iconBg} ${colors.iconColor} p-2 rounded-md`}
          >
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        </div>
        <div className={`${colors.value} text-right`}>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-semibold">
              {value.toFixed(decimals)}
            </span>
            {unit && <span className="text-xs text-slate-500">{unit}</span>}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
        <div
          className={`${colors.progress} h-full transition-all duration-300 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Range display */}
      <div className="flex justify-between text-xs text-slate-500">
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

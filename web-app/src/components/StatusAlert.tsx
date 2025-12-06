import { AlertCircle, CheckCircle, Info } from "lucide-react";

interface StatusAlertProps {
  type: "success" | "warning" | "info";
  message: string;
}

export function StatusAlert({ type, message }: StatusAlertProps) {
  const styles = {
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-900",
      icon: CheckCircle,
      iconColor: "text-emerald-600",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-900",
      icon: AlertCircle,
      iconColor: "text-amber-600",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-900",
      icon: Info,
      iconColor: "text-blue-600",
    },
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div
      className={`${style.bg} ${style.border} ${style.text} border rounded-lg px-4 py-3 flex items-center gap-3`}
    >
      <Icon className={`w-4 h-4 ${style.iconColor} shrink-0`} />
      <span className="text-sm">{message}</span>
    </div>
  );
}

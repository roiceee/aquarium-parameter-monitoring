import { AlertCircle, CheckCircle, Info } from "lucide-react";

interface StatusAlertProps {
  type: "success" | "warning" | "info";
  message: string;
}

export function StatusAlert({ type, message }: StatusAlertProps) {
  const styles = {
    success: {
      bg: "bg-white",
      border: "border-black",
      icon: CheckCircle,
    },
    warning: {
      bg: "bg-gray-200",
      border: "border-black",
      icon: AlertCircle,
    },
    info: {
      bg: "bg-white",
      border: "border-gray-400",
      icon: Info,
    },
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div
      className={`${style.bg} ${style.border} border-2 px-4 py-3 flex items-center gap-3`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  );
}

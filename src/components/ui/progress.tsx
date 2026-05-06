import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  variant?: "focus" | "break" | "default";
  className?: string;
}

export function Progress({ value, max = 100, variant = "default", className }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const trackColors = {
    default: "bg-[var(--surface-2)]",
    focus: "bg-amber-500/15",
    break: "bg-emerald-500/15",
  };

  const fillColors = {
    default: "bg-white/40",
    focus: "bg-amber-500",
    break: "bg-emerald-500",
  };

  return (
    <div className={cn("h-1.5 rounded-full overflow-hidden", trackColors[variant], className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-300", fillColors[variant])}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

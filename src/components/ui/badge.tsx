import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "focus" | "break" | "success" | "warning" | "destructive" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-white/10 text-[var(--text)] border border-white/10",
    focus: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
    break: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
    destructive: "bg-red-500/15 text-red-400 border border-red-500/20",
    outline: "border border-[var(--border)] text-[var(--text-muted)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "focus" | "break";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-medium transition-all duration-150 select-none disabled:opacity-40 disabled:pointer-events-none rounded-xl";

    const variants = {
      default: "bg-white/10 text-white hover:bg-white/15 active:bg-white/20 border border-white/10",
      outline: "border border-[var(--border)] text-[var(--text)] hover:bg-white/5 active:bg-white/10",
      ghost: "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 active:bg-white/10",
      destructive: "bg-red-500/15 text-red-400 hover:bg-red-500/20 border border-red-500/20",
      focus: "bg-amber-500 text-black font-semibold hover:bg-amber-400 active:bg-amber-600 shadow-lg shadow-amber-500/20",
      break: "bg-emerald-500 text-black font-semibold hover:bg-emerald-400 active:bg-emerald-600 shadow-lg shadow-emerald-500/20",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm rounded-lg",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10 rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full h-11 px-3 rounded-xl text-sm",
          "bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)]",
          "placeholder:text-[var(--text-muted)]",
          "focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30",
          "transition-colors duration-150",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

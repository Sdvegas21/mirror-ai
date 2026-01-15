import { forwardRef } from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number; // 0 to 1
  className?: string;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  function ProgressBar({ value, className = "" }, ref) {
    const clampedValue = Math.max(0, Math.min(1, value));
    const percentage = clampedValue * 100;

    return (
      <div ref={ref} className={`h-2 w-full rounded-full bg-muted overflow-hidden ${className}`}>
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    );
  }
);

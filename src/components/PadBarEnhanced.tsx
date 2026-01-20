import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface PadBarEnhancedProps {
  value: number; // -1 to 1
  label: string;
  className?: string;
  showDelta?: boolean;
  highValueThreshold?: number; // Default 0.8
}

export function PadBarEnhanced({ 
  value, 
  label, 
  className = "",
  showDelta = true,
  highValueThreshold = 0.8
}: PadBarEnhancedProps) {
  const clampedValue = Math.max(-1, Math.min(1, value));
  const prevValueRef = useRef<number>(clampedValue);
  const [delta, setDelta] = useState<number | null>(null);
  const [showDeltaIndicator, setShowDeltaIndicator] = useState(false);
  
  // Track value changes for delta display
  useEffect(() => {
    const prev = prevValueRef.current;
    const diff = clampedValue - prev;
    
    // Only show delta if change is significant (> 0.05)
    if (showDelta && Math.abs(diff) > 0.05) {
      setDelta(diff);
      setShowDeltaIndicator(true);
      
      // Hide delta after animation
      const timer = setTimeout(() => {
        setShowDeltaIndicator(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
    
    prevValueRef.current = clampedValue;
  }, [clampedValue, showDelta]);
  
  // Calculate fill width (50% = full bar on one side)
  const fillWidth = Math.abs(clampedValue) * 50;
  const isPositive = clampedValue >= 0;
  const isHighValue = Math.abs(clampedValue) >= highValueThreshold;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-center gap-1">
          {/* Delta indicator */}
          <AnimatePresence>
            {showDeltaIndicator && delta !== null && (
              <motion.span 
                className={`text-xs font-mono ${delta > 0 ? "text-success" : "text-destructive"}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.3 }}
              >
                {delta > 0 ? "+" : ""}{delta.toFixed(2)}
              </motion.span>
            )}
          </AnimatePresence>
          
          <motion.span 
            className={`text-sm font-mono ${isHighValue ? "text-success font-bold" : "text-foreground"}`}
            key={clampedValue.toFixed(2)}
            initial={{ opacity: 0.5, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {clampedValue >= 0 ? "+" : ""}
            {clampedValue.toFixed(2)}
          </motion.span>
        </div>
      </div>
      
      {/* Bar container with high-value pulse */}
      <div 
        className={`relative h-3 w-full rounded-full bg-muted overflow-hidden transition-all ${
          isHighValue ? "ring-1 ring-success/50 animate-high-value-pulse" : ""
        }`}
      >
        {/* Fill bar */}
        <motion.div
          className={`absolute top-0 bottom-0 ${
            isPositive
              ? `left-1/2 rounded-r-full ${isHighValue ? "bg-gradient-to-r from-success to-warning" : "bg-gradient-to-r from-success/70 to-success"}`
              : `right-1/2 rounded-l-full ${isHighValue ? "bg-gradient-to-l from-destructive to-warning" : "bg-gradient-to-l from-destructive/70 to-destructive"}`
          }`}
          initial={false}
          animate={{ width: `${fillWidth}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        
        {/* High value glow effect */}
        {isHighValue && (
          <motion.div
            className={`absolute top-0 bottom-0 ${
              isPositive ? "left-1/2 rounded-r-full" : "right-1/2 rounded-l-full"
            } bg-gradient-to-r from-success/30 to-warning/30`}
            initial={false}
            animate={{ 
              width: `${fillWidth}%`,
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              width: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 1.5, repeat: Infinity }
            }}
          />
        )}
        
        {/* Center line - more visible */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-foreground/60 z-10 -translate-x-1/2" />
      </div>
      
      {/* High value indicator badge */}
      {isHighValue && (
        <motion.div 
          className="flex justify-end mt-1"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-[10px] font-semibold text-success uppercase tracking-wide">
            🔥 High Intensity
          </span>
        </motion.div>
      )}
    </div>
  );
}

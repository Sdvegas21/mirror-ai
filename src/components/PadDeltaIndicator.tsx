import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PadDeltaIndicatorProps {
  label: string;
  currentValue: number;
  previousValue: number;
  showDelta?: boolean;
}

export function PadDeltaIndicator({ 
  label, 
  currentValue, 
  previousValue, 
  showDelta = true 
}: PadDeltaIndicatorProps) {
  const delta = currentValue - previousValue;
  const hasDelta = Math.abs(delta) > 0.01;
  const isPositive = delta > 0;
  
  const getDeltaColor = () => {
    if (!hasDelta) return "text-muted-foreground";
    return isPositive ? "text-success" : "text-destructive";
  };

  const getDeltaIcon = () => {
    if (!hasDelta) return <Minus className="h-3 w-3" />;
    return isPositive ? (
      <TrendingUp className="h-3 w-3" />
    ) : (
      <TrendingDown className="h-3 w-3" />
    );
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-mono text-foreground">
        {currentValue >= 0 ? "+" : ""}{currentValue.toFixed(2)}
      </span>
      
      <AnimatePresence mode="wait">
        {showDelta && hasDelta && (
          <motion.div
            key={`delta-${delta.toFixed(2)}`}
            initial={{ opacity: 0, scale: 0.8, x: -5 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${getDeltaColor()} bg-current/10`}
          >
            {getDeltaIcon()}
            <span>
              {isPositive ? "+" : ""}{delta.toFixed(2)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

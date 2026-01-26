import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { PadState } from "@/types";

interface LivePadCausalityBannerProps {
  pad: PadState;
  isVisible?: boolean;
}

interface PadDelta {
  pleasure: number;
  arousal: number;
  dominance: number;
  timestamp: number;
}

export function LivePadCausalityBanner({ pad, isVisible = true }: LivePadCausalityBannerProps) {
  const [delta, setDelta] = useState<PadDelta | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const previousPadRef = useRef<PadState>(pad);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const prev = previousPadRef.current;
    
    // Calculate deltas
    const pleasureDelta = pad.pleasure - prev.pleasure;
    const arousalDelta = pad.arousal - prev.arousal;
    const dominanceDelta = pad.dominance - prev.dominance;
    
    // Check if any significant change (> 0.05)
    const hasSignificantChange = 
      Math.abs(pleasureDelta) > 0.05 ||
      Math.abs(arousalDelta) > 0.05 ||
      Math.abs(dominanceDelta) > 0.05;

    if (hasSignificantChange) {
      setDelta({
        pleasure: pleasureDelta,
        arousal: arousalDelta,
        dominance: dominanceDelta,
        timestamp: Date.now(),
      });
      setShowBanner(true);

      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Hide banner after 4 seconds
      timeoutRef.current = setTimeout(() => {
        setShowBanner(false);
      }, 4000);
    }

    previousPadRef.current = pad;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pad]);

  if (!isVisible) return null;

  const formatDelta = (value: number, label: string) => {
    if (Math.abs(value) < 0.03) return null;
    const isPositive = value > 0;
    return (
      <div className="flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className="h-3 w-3 text-success" />
        ) : (
          <TrendingDown className="h-3 w-3 text-destructive" />
        )}
        <span className="text-xs font-medium">
          {label}: {isPositive ? "+" : ""}{value.toFixed(2)}
        </span>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {showBanner && delta && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary/90 text-primary-foreground shadow-lg backdrop-blur-sm border border-primary/50">
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wide">Live Causality</span>
            </div>
            <div className="h-4 w-px bg-primary-foreground/30" />
            <div className="flex items-center gap-3 text-primary-foreground">
              {formatDelta(delta.pleasure, "P")}
              {formatDelta(delta.arousal, "A")}
              {formatDelta(delta.dominance, "D")}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, TrendingDown, Activity, Zap, Crown } from "lucide-react";

interface LivePsiDisplayProps {
  value: number;
  targetValue?: number;
  isStreaming?: boolean;
  trajectory?: number[];
  velocity?: number;
  acceleration?: number;
  sovereigntyEvent?: boolean;
}

export function LivePsiDisplay({
  value,
  targetValue,
  isStreaming = false,
  trajectory = [],
  velocity = 0,
  acceleration = 0,
  sovereigntyEvent = false,
}: LivePsiDisplayProps) {
  const [previousValue, setPreviousValue] = useState(value);
  const [delta, setDelta] = useState(0);
  const [showDelta, setShowDelta] = useState(false);
  const deltaTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isClimbing = targetValue !== undefined && targetValue > value;
  const proximityToBreakthrough = Math.min(1, value / 0.85);
  const isNearBreakthrough = proximityToBreakthrough > 0.9;
  const isBreakthrough = value >= 0.85;

  // Track delta changes
  useEffect(() => {
    const newDelta = value - previousValue;
    if (Math.abs(newDelta) > 0.005) {
      setDelta(newDelta);
      setShowDelta(true);
      
      if (deltaTimeoutRef.current) {
        clearTimeout(deltaTimeoutRef.current);
      }
      deltaTimeoutRef.current = setTimeout(() => {
        setShowDelta(false);
      }, 2000);
    }
    setPreviousValue(value);
    
    return () => {
      if (deltaTimeoutRef.current) {
        clearTimeout(deltaTimeoutRef.current);
      }
    };
  }, [value, previousValue]);

  return (
    <div className={`space-y-3 relative ${sovereigntyEvent ? "animate-sovereignty-glow rounded-lg p-2 -m-2" : ""}`}>
      {/* Sovereignty Crown Badge */}
      <AnimatePresence>
        {sovereigntyEvent && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="absolute -top-2 -right-2 z-10"
          >
            <div className="p-1.5 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 shadow-lg shadow-amber-500/30">
              <Crown className="h-4 w-4 text-amber-900" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Ψ Value Display with Delta */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Ψ (Psi)</span>
          {sovereigntyEvent && (
            <span className="text-xs font-bold text-amber-400 animate-pulse">
              👑 SOVEREIGNTY
            </span>
          )}
          {isStreaming && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Activity className="h-3 w-3 text-primary" />
            </motion.div>
          )}
          {isBreakthrough && (
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-success"
            >
              <Zap className="h-4 w-4 fill-success" />
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-2 relative">
          {/* Delta indicator */}
          <AnimatePresence>
            {showDelta && Math.abs(delta) > 0.005 && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className={`absolute -top-5 right-0 text-xs font-mono px-1.5 py-0.5 rounded ${
                  delta > 0 
                    ? "bg-success/20 text-success" 
                    : "bg-destructive/20 text-destructive"
                }`}
              >
                {delta > 0 ? "+" : ""}{delta.toFixed(3)}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Trend arrow */}
          {velocity !== 0 && (
            <motion.div
              animate={{ y: velocity > 0 ? [0, -2, 0] : [0, 2, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {velocity > 0 ? (
                <TrendingUp className="h-3 w-3 text-success" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
            </motion.div>
          )}

          {/* Animated Ψ value */}
          <motion.span
            key={value.toFixed(3)}
            initial={{ scale: 1.3, color: delta > 0 ? "hsl(var(--success))" : delta < 0 ? "hsl(var(--destructive))" : "hsl(var(--primary))" }}
            animate={{ scale: 1, color: "hsl(var(--foreground))" }}
            transition={{ duration: 0.4 }}
            className={`text-lg font-mono font-bold ${isBreakthrough ? "text-success" : ""}`}
          >
            {value.toFixed(3)}
          </motion.span>
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        {/* Breakthrough threshold marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-success/50 z-10"
          style={{ left: "85%" }}
          title="Breakthrough threshold (0.85)"
        />
        
        {/* Target indicator (ghost bar) */}
        {targetValue !== undefined && targetValue !== value && (
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary/30 rounded-full"
            initial={{ width: `${value * 100}%` }}
            animate={{ width: `${targetValue * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {/* Current value bar with breakthrough glow */}
        <motion.div
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${
            isBreakthrough
              ? "bg-gradient-to-r from-success via-success to-warning animate-high-value-pulse"
              : isNearBreakthrough
              ? "bg-gradient-to-r from-primary to-success"
              : "bg-primary"
          }`}
          initial={{ width: `${value * 100}%` }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.1 }}
        />

        {/* Pulse effect when streaming */}
        {isStreaming && (
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary/50 rounded-full"
            animate={{ 
              width: [`${value * 100}%`, `${(value + 0.05) * 100}%`, `${value * 100}%`],
              opacity: [0.5, 0.2, 0.5]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* Mini Trajectory Sparkline - Enhanced */}
      {trajectory.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-primary" />
            <div className="flex items-end gap-0.5 h-6 flex-1">
              {trajectory.slice(-10).map((v, i, arr) => {
                const isLast = i === arr.length - 1;
                const isPeak = v === Math.max(...arr);
                return (
                  <motion.div
                    key={i}
                    className={`flex-1 rounded-sm ${
                      isLast 
                        ? "bg-primary" 
                        : isPeak 
                        ? "bg-success/80" 
                        : "bg-primary/40"
                    }`}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(15, v * 100)}%` }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                  />
                );
              })}
            </div>
          </div>
          
          {/* Velocity & Acceleration indicators */}
          <div className="flex items-center justify-between text-[10px]">
            {velocity !== 0 && (
              <span className={`font-mono ${velocity > 0 ? "text-success" : "text-destructive"}`}>
                dΨ/dt: {velocity > 0 ? "+" : ""}{(velocity * 100).toFixed(1)}%/s
              </span>
            )}
            {acceleration !== 0 && (
              <span className={`font-mono ${acceleration > 0 ? "text-success" : "text-warning"}`}>
                d²Ψ/dt²: {acceleration > 0 ? "+" : ""}{(acceleration * 100).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Breakthrough Alert - Enhanced */}
      <AnimatePresence>
        {isBreakthrough && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className="flex items-center gap-2 p-2 rounded-md bg-success/20 border border-success/50 animate-emergence-glow"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="h-4 w-4 text-success fill-success" />
            </motion.div>
            <span className="text-xs font-bold text-success uppercase tracking-wide">
              🔥 Breakthrough achieved! Ψ ≥ 0.85
            </span>
          </motion.div>
        )}
        {!isBreakthrough && isNearBreakthrough && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2 p-2 rounded-md bg-warning/10 border border-warning/30"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Sparkles className="h-4 w-4 text-warning" />
            </motion.div>
            <span className="text-xs font-medium text-warning">
              Approaching breakthrough threshold ({(proximityToBreakthrough * 100).toFixed(0)}%)
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

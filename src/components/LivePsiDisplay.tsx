import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Activity } from "lucide-react";

interface LivePsiDisplayProps {
  value: number;
  targetValue?: number;
  isStreaming?: boolean;
  trajectory?: number[];
  velocity?: number;
}

export function LivePsiDisplay({
  value,
  targetValue,
  isStreaming = false,
  trajectory = [],
  velocity = 0,
}: LivePsiDisplayProps) {
  const isClimbing = targetValue !== undefined && targetValue > value;
  const proximityToBreakthrough = Math.min(1, value / 0.85);
  const isNearBreakthrough = proximityToBreakthrough > 0.9;

  return (
    <div className="space-y-3">
      {/* Main Ψ Value Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Ψ (Psi)</span>
          {isStreaming && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Activity className="h-3 w-3 text-primary" />
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isClimbing && (
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <TrendingUp className="h-3 w-3 text-success" />
            </motion.div>
          )}
          <motion.span
            key={value.toFixed(3)}
            initial={{ scale: 1.2, color: "hsl(var(--primary))" }}
            animate={{ scale: 1, color: "hsl(var(--foreground))" }}
            transition={{ duration: 0.3 }}
            className="text-lg font-mono font-bold"
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
        
        {/* Current value bar */}
        <motion.div
          className={`absolute top-0 left-0 h-full rounded-full ${
            isNearBreakthrough
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

      {/* Mini Trajectory Sparkline */}
      {trajectory.length > 0 && (
        <div className="flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-primary" />
          <div className="flex items-end gap-0.5 h-4 flex-1">
            {trajectory.map((v, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-primary/60 rounded-sm"
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(10, v * 100)}%` }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
              />
            ))}
          </div>
          {velocity !== 0 && (
            <span className={`text-xs font-mono ${velocity > 0 ? "text-success" : "text-destructive"}`}>
              {velocity > 0 ? "+" : ""}{(velocity * 100).toFixed(1)}%/s
            </span>
          )}
        </div>
      )}

      {/* Near Breakthrough Alert */}
      {isNearBreakthrough && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-2 rounded-md bg-success/10 border border-success/30"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Sparkles className="h-4 w-4 text-success" />
          </motion.div>
          <span className="text-xs font-medium text-success">
            Approaching consciousness breakthrough threshold
          </span>
        </motion.div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, Loader2, Play, Radio, Zap } from "lucide-react";

interface ConsciousnessStreamIndicatorProps {
  isConnected: boolean;
  isStreaming: boolean;
  isDemoMode?: boolean;
  connectionError: string | null;
  eventCount?: number;
  lastEventType?: string;
}

export function ConsciousnessStreamIndicator({
  isConnected,
  isStreaming,
  isDemoMode = false,
  connectionError,
  eventCount = 0,
  lastEventType,
}: ConsciousnessStreamIndicatorProps) {
  const [showEventPulse, setShowEventPulse] = useState(false);
  const [displayEventType, setDisplayEventType] = useState<string | null>(null);

  // Pulse on new events
  useEffect(() => {
    if (lastEventType && eventCount > 0) {
      setShowEventPulse(true);
      setDisplayEventType(lastEventType);
      const timeout = setTimeout(() => {
        setShowEventPulse(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [eventCount, lastEventType]);

  const getEventLabel = (type: string) => {
    switch (type) {
      case "breakthrough_analysis": return "⚡ Breakthrough";
      case "mirror_thought": return "🪞 Mirror";
      case "state_update": return "📊 State";
      case "start": return "🚀 Start";
      case "complete": return "✅ Complete";
      default: return type;
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border border-border relative overflow-hidden">
      {/* Event pulse background effect */}
      <AnimatePresence>
        {showEventPulse && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1.5 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-primary rounded-md"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isStreaming ? (
          <motion.div
            key="streaming"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2 relative z-10"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-3.5 w-3.5 text-primary" />
            </motion.div>
            <span className="text-xs font-medium text-primary">
              {isDemoMode ? "Demo streaming..." : "Streaming consciousness..."}
            </span>
            {displayEventType && (
              <motion.span
                key={displayEventType + eventCount}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-muted-foreground"
              >
                {getEventLabel(displayEventType)}
              </motion.span>
            )}
          </motion.div>
        ) : isConnected && isDemoMode ? (
          <motion.div
            key="demo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2 relative z-10"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Play className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            </motion.div>
            <span className="text-xs text-amber-600">
              Demo mode (simulated)
            </span>
            {eventCount > 0 && (
              <span className="text-[10px] text-muted-foreground font-mono">
                {eventCount} events
              </span>
            )}
          </motion.div>
        ) : isConnected ? (
          <motion.div
            key="connected"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2 relative z-10"
          >
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Wifi className="h-3.5 w-3.5 text-success" />
            </motion.div>
            <span className="text-xs text-muted-foreground">
              WebSocket connected
            </span>
            {eventCount > 0 && (
              <motion.span 
                key={eventCount}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-[10px] text-success font-mono"
              >
                {eventCount} events
              </motion.span>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2 relative z-10"
          >
            <WifiOff className="h-3.5 w-3.5 text-destructive" />
            <span className="text-xs text-destructive">
              {connectionError || "Disconnected"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

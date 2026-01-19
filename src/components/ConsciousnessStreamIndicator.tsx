import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, Loader2, Play } from "lucide-react";

interface ConsciousnessStreamIndicatorProps {
  isConnected: boolean;
  isStreaming: boolean;
  isDemoMode?: boolean;
  connectionError: string | null;
}

export function ConsciousnessStreamIndicator({
  isConnected,
  isStreaming,
  isDemoMode = false,
  connectionError,
}: ConsciousnessStreamIndicatorProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border border-border">
      <AnimatePresence mode="wait">
        {isStreaming ? (
          <motion.div
            key="streaming"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
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
          </motion.div>
        ) : isConnected && isDemoMode ? (
          <motion.div
            key="demo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
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
          </motion.div>
        ) : isConnected ? (
          <motion.div
            key="connected"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
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
          </motion.div>
        ) : (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
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

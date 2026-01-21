import { forwardRef } from "react";
import { Zap, Link2, Flame, Crown } from "lucide-react";
import { BreakthroughExtended } from "@/types";
import { TelemetryCard } from "./TelemetryCard";
import { motion, AnimatePresence } from "framer-motion";

interface BreakthroughTimelineCardProps {
  extended: BreakthroughExtended;
  history?: BreakthroughExtended[];
}

const typeColors: Record<string, string> = {
  cognitive: "bg-blue-500",
  epistemic: "bg-purple-500",
  affective: "bg-pink-500",
  somatic: "bg-orange-500",
  relational: "bg-cyan-500",
  existential: "bg-amber-500",
  integrated: "bg-emerald-500",
  sovereignty: "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400",
};

const typeIcons: Record<string, React.ReactNode> = {
  cognitive: <Zap className="h-3 w-3" />,
  epistemic: <Zap className="h-3 w-3" />,
  affective: <Zap className="h-3 w-3" />,
  somatic: <Zap className="h-3 w-3" />,
  relational: <Link2 className="h-3 w-3" />,
  existential: <Flame className="h-3 w-3" />,
  integrated: <Zap className="h-3 w-3" />,
  sovereignty: <Crown className="h-3 w-3" />,
};

export const BreakthroughTimelineCard = forwardRef<HTMLDivElement, BreakthroughTimelineCardProps>(
  ({ extended, history = [] }, ref) => {
    const {
      breakthrough_type,
      significance_score,
      chain_context,
      sovereignty_event,
      emotional_echo,
    } = extended;

    const isCascade = chain_context && chain_context.related_events > 1;
    const allEvents = [extended, ...history].slice(0, 5);

    return (
      <TelemetryCard
        ref={ref}
        icon={<Zap className="h-4 w-4" />}
        title="⚡ Breakthrough Timeline (Entry 100+)"
      >
        <div className="space-y-4">
          {/* Current Breakthrough - Hero Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={breakthrough_type + significance_score}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative p-3 rounded-lg border ${
                sovereignty_event 
                  ? "border-amber-400/50 bg-gradient-to-br from-amber-500/10 via-yellow-400/5 to-amber-500/10 animate-sovereignty-glow" 
                  : "border-primary/30 bg-primary/5"
              }`}
            >
              {/* Sovereignty Crown */}
              {sovereignty_event && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="absolute -top-3 -right-3"
                >
                  <div className="p-1.5 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 shadow-lg shadow-amber-500/30">
                    <Crown className="h-4 w-4 text-amber-900" />
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs text-white font-semibold ${typeColors[breakthrough_type]}`}>
                    {typeIcons[breakthrough_type]}
                    {breakthrough_type.toUpperCase()}
                  </span>
                  {sovereignty_event && (
                    <span className="text-xs font-bold text-amber-400 animate-pulse">
                      👑 SOVEREIGNTY
                    </span>
                  )}
                </div>
                <span className="text-2xl font-bold font-mono text-foreground">
                  {significance_score}
                </span>
              </div>

              {/* Significance Bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                <motion.div
                  className={`h-full rounded-full ${
                    significance_score >= 80 
                      ? "bg-gradient-to-r from-success via-success to-warning" 
                      : significance_score >= 50 
                      ? "bg-primary" 
                      : "bg-muted-foreground"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${significance_score}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Cascade Indicator */}
              {isCascade && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-2 rounded bg-accent/20 border border-accent/30"
                >
                  <Link2 className="h-4 w-4 text-accent-foreground" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-accent-foreground">
                      CASCADE DETECTED
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {chain_context.related_events} related • Depth {chain_context.cascade_depth}
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: chain_context.cascade_depth }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-4 rounded-full bg-accent"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Emotional Echo */}
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-muted-foreground">Emotional Echo:</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-pink-500 rounded-full"
                      style={{ width: `${emotional_echo * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-foreground">
                    {(emotional_echo * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Timeline - Historical Events */}
          {allEvents.length > 1 && (
            <div className="relative">
              <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                Recent Breakthroughs
              </div>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border" />
                
                <div className="space-y-2 pl-6">
                  {allEvents.slice(1).map((event, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative flex items-center gap-2 text-xs"
                    >
                      {/* Timeline Dot */}
                      <div className={`absolute -left-6 w-4 h-4 rounded-full border-2 border-background ${typeColors[event.breakthrough_type]} flex items-center justify-center`}>
                        {event.sovereignty_event && (
                          <Crown className="h-2 w-2 text-white" />
                        )}
                      </div>
                      
                      <span className={`px-1.5 py-0.5 rounded text-white text-[10px] ${typeColors[event.breakthrough_type]}`}>
                        {event.breakthrough_type.slice(0, 4).toUpperCase()}
                      </span>
                      <span className="text-muted-foreground">
                        Score: {event.significance_score}
                      </span>
                      {event.chain_context && (
                        <Link2 className="h-3 w-3 text-accent" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="pt-2 border-t border-border">
            <div className="flex flex-wrap gap-1">
              {["existential", "sovereignty", "relational"].map((type) => (
                <div key={type} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <div className={`w-2 h-2 rounded-full ${typeColors[type]}`} />
                  <span className="capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TelemetryCard>
    );
  }
);

BreakthroughTimelineCard.displayName = "BreakthroughTimelineCard";

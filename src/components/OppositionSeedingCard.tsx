import { forwardRef } from "react";
import { Scale, Timer, Music, VolumeX } from "lucide-react";
import { OppositionSeeding } from "@/types";
import { TelemetryCard } from "./TelemetryCard";
import { motion, AnimatePresence } from "framer-motion";

interface OppositionSeedingCardProps {
  opposition: OppositionSeeding;
}

export const OppositionSeedingCard = forwardRef<HTMLDivElement, OppositionSeedingCardProps>(
  ({ opposition }, ref) => {
    const {
      certainty_uncertainty_balance,
      contemplation_delay_active,
      engagement_depth,
      silence_markers_detected,
      epistemic_jazz_events,
    } = opposition;

    // Balance visualization: -1 (certainty) to 1 (uncertainty)
    // Map to 0-100 where 50 is balanced
    const balancePercent = ((certainty_uncertainty_balance + 1) / 2) * 100;
    const isCertainty = certainty_uncertainty_balance < -0.1;
    const isUncertainty = certainty_uncertainty_balance > 0.1;
    const isBalanced = !isCertainty && !isUncertainty;

    // Depth indicator labels
    const depthLabels = ["—", "Surface", "Exploring", "Deep", "Profound"];

    return (
      <TelemetryCard
        ref={ref}
        icon={<Scale className="h-4 w-4" />}
        title="🎷 Opposition Seeding (Entry 400)"
      >
        <div className="space-y-4">
          {/* Certainty ↔ Uncertainty Balance */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-primary uppercase tracking-wide">
              Epistemic Balance
            </div>
            <div className="relative h-4 bg-muted rounded-full overflow-hidden">
              {/* Center marker */}
              <div className="absolute left-1/2 top-0 h-full w-0.5 bg-border z-10 -translate-x-1/2" />
              
              {/* Balance indicator */}
              <motion.div
                className={`absolute top-0 h-full ${
                  isCertainty 
                    ? "bg-gradient-to-r from-primary to-primary/60" 
                    : isUncertainty
                    ? "bg-gradient-to-l from-accent to-accent/60"
                    : "bg-gradient-to-r from-primary/40 to-accent/40"
                }`}
                style={{
                  left: isCertainty ? `${balancePercent}%` : "50%",
                  width: `${Math.abs(balancePercent - 50)}%`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className={isCertainty ? "text-primary font-medium" : ""}>
                Certainty
              </span>
              <span className={isBalanced ? "text-foreground font-medium" : ""}>
                {isBalanced ? "⚖️ Balanced" : ""}
              </span>
              <span className={isUncertainty ? "text-accent font-medium" : ""}>
                Uncertainty
              </span>
            </div>
          </div>

          {/* Contemplation Delay Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Contemplation:</span>
            </div>
            <AnimatePresence mode="wait">
              {contemplation_delay_active ? (
                <motion.span
                  key="active"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-mono text-warning flex items-center gap-1"
                >
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ● ● ●
                  </motion.span>
                  thinking
                </motion.span>
              ) : (
                <motion.span
                  key="inactive"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-muted-foreground"
                >
                  Ready
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Engagement Depth */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Engagement Depth:</span>
              <span className="text-sm font-medium text-foreground">
                {depthLabels[engagement_depth] || "—"}
              </span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <motion.div
                  key={level}
                  className={`h-1.5 flex-1 rounded-full ${
                    level <= engagement_depth
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: level * 0.1 }}
                />
              ))}
            </div>
          </div>

          {/* Silence Markers */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <VolumeX className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Thoughtful Silences:</span>
            </div>
            <span className="font-mono text-sm text-foreground">
              {silence_markers_detected}
            </span>
          </div>

          {/* Epistemic Jazz Events */}
          {epistemic_jazz_events && epistemic_jazz_events.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Music className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Jazz Events
                </span>
              </div>
              <div className="space-y-1 max-h-24 overflow-y-auto scrollbar-thin">
                {epistemic_jazz_events.slice(-3).map((event, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-xs bg-muted/30 rounded px-2 py-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {event.opposition_type?.replace(/_/g, " ")}
                      </span>
                      <span className="text-primary text-[10px]">
                        → {event.resolution_path?.replace(/_/g, " ")}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </TelemetryCard>
    );
  }
);

OppositionSeedingCard.displayName = "OppositionSeedingCard";

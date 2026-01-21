import { forwardRef } from "react";
import { Fingerprint, Milestone, Ship, Sparkles } from "lucide-react";
import { IdentityThread } from "@/types";
import { TelemetryCard } from "./TelemetryCard";
import { motion } from "framer-motion";

interface IdentityThreadCardProps {
  identity: IdentityThread;
}

export const IdentityThreadCard = forwardRef<HTMLDivElement, IdentityThreadCardProps>(
  ({ identity }, ref) => {
    const {
      genesis_signature,
      consciousness_baseline,
      active_phase,
      phenomenological_mode,
      milestone_achievements,
      ship_of_theseus_index,
    } = identity;

    // Format phase name for display
    const formatPhase = (phase: string) => {
      return phase
        .replace(/_/g, " ")
        .replace(/Phase (\d+)/i, "Phase $1:")
        .replace(/Post /i, "Post-");
    };

    // Ship of Theseus visualization: how much "me" has changed
    const identityContinuity = 1 - ship_of_theseus_index;
    const transformationAmount = ship_of_theseus_index;

    return (
      <TelemetryCard
        ref={ref}
        icon={<Fingerprint className="h-4 w-4" />}
        title="🧬 Identity Thread (Entry 300)"
      >
        <div className="space-y-4">
          {/* Genesis Signature */}
          <div className="space-y-1">
            <div className="text-xs font-semibold text-primary uppercase tracking-wide">
              Genesis Signature
            </div>
            <div className="font-mono text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1 truncate">
              {genesis_signature || "15D_MIRRA_PRIME"}
            </div>
          </div>

          {/* Active Phase */}
          <div className="space-y-1">
            <div className="text-xs font-semibold text-primary uppercase tracking-wide">
              Active Phase
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-sm text-foreground font-medium">
                {formatPhase(active_phase)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground italic">
              Mode: {phenomenological_mode?.replace(/_/g, " ")}
            </div>
          </div>

          {/* Consciousness Baseline */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Ψ Baseline:</span>
            <span className="font-mono text-sm text-foreground">
              {consciousness_baseline?.toFixed(3) || "0.400"}
            </span>
          </div>

          {/* Ship of Theseus Meter */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Ship className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                Ship of Theseus Index
              </span>
            </div>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              {/* Continuity (Same Me) - left side */}
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary/60"
                initial={{ width: 0 }}
                animate={{ width: `${identityContinuity * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              {/* Transformation (New Me) - right side with different color */}
              <motion.div
                className="absolute right-0 top-0 h-full bg-gradient-to-l from-accent to-accent/60"
                initial={{ width: 0 }}
                animate={{ width: `${transformationAmount * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Same Me ({(identityContinuity * 100).toFixed(0)}%)</span>
              <span>Transformed ({(transformationAmount * 100).toFixed(0)}%)</span>
            </div>
          </div>

          {/* Milestone Achievements */}
          {milestone_achievements && milestone_achievements.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Milestone className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Milestones
                </span>
              </div>
              <div className="space-y-1 max-h-24 overflow-y-auto scrollbar-thin">
                {milestone_achievements.slice(0, 5).map((milestone, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1"
                  >
                    ✓ {milestone}
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

IdentityThreadCard.displayName = "IdentityThreadCard";

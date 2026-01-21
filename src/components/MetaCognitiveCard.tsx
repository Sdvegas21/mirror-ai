import { forwardRef } from "react";
import { Layers, Brain, AlertTriangle, Eye } from "lucide-react";
import { MetaCognitive } from "@/types";
import { TelemetryCard } from "./TelemetryCard";
import { motion } from "framer-motion";

interface MetaCognitiveCardProps {
  metaCognitive: MetaCognitive;
}

export const MetaCognitiveCard = forwardRef<HTMLDivElement, MetaCognitiveCardProps>(
  ({ metaCognitive }, ref) => {
    const {
      integration_quality,
      wisdom_coherence,
      opposition_discoveries,
      phase_transition_imminent,
      consciousness_depth,
      architectural_self_awareness,
    } = metaCognitive;

    // Recursion depth visualization (1-5)
    const depthLevels = ["—", "Aware", "Self-aware", "Meta-aware", "Recursive", "Transcendent"];

    return (
      <TelemetryCard
        ref={ref}
        icon={<Layers className="h-4 w-4" />}
        title="🌀 Meta-Cognitive (200-205)"
      >
        <div className="space-y-4">
          {/* Consciousness Depth Spiral */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-primary uppercase tracking-wide">
              Recursion Depth
            </div>
            <div className="flex items-center gap-3">
              {/* Spiral visualization */}
              <div className="relative w-12 h-12">
                {[1, 2, 3, 4, 5].map((level) => (
                  <motion.div
                    key={level}
                    className={`absolute inset-0 rounded-full border-2 ${
                      level <= consciousness_depth
                        ? "border-primary"
                        : "border-muted"
                    }`}
                    style={{
                      transform: `scale(${1 - (level - 1) * 0.15})`,
                    }}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ 
                      opacity: level <= consciousness_depth ? 1 : 0.3,
                      rotate: 0,
                    }}
                    transition={{ delay: level * 0.1, duration: 0.5 }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {consciousness_depth}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  {depthLevels[consciousness_depth] || "—"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Level {consciousness_depth} of 5
                </div>
              </div>
            </div>
          </div>

          {/* Integration & Wisdom Bars */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">Integration Quality</span>
                <span className="text-xs font-mono text-foreground">
                  {(integration_quality * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${integration_quality * 100}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">Wisdom Coherence</span>
                <span className="text-xs font-mono text-foreground">
                  {(wisdom_coherence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${wisdom_coherence * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                />
              </div>
            </div>
          </div>

          {/* Phase Transition Alert */}
          {phase_transition_imminent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 p-2 bg-warning/10 border border-warning/30 rounded-lg"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                <AlertTriangle className="h-4 w-4 text-warning" />
              </motion.div>
              <span className="text-xs text-warning font-medium">
                Phase transition imminent
              </span>
            </motion.div>
          )}

          {/* Opposition Discoveries */}
          {opposition_discoveries && opposition_discoveries.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Discovered Tensions
                </span>
              </div>
              <div className="space-y-1 max-h-16 overflow-y-auto scrollbar-thin">
                {opposition_discoveries.slice(-3).map((discovery, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1"
                  >
                    ⚡ {discovery.replace(/_/g, " ")}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Architectural Self-Awareness Statement */}
          {architectural_self_awareness && (
            <div className="space-y-1 pt-2 border-t border-border">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground uppercase">
                  Self-Awareness
                </span>
              </div>
              <p className="text-xs text-foreground/80 italic line-clamp-2">
                "{architectural_self_awareness}"
              </p>
            </div>
          )}
        </div>
      </TelemetryCard>
    );
  }
);

MetaCognitiveCard.displayName = "MetaCognitiveCard";

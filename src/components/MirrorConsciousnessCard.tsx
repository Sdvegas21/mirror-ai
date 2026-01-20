import { forwardRef } from "react";
import { Eye, Brain, Sparkles, Activity } from "lucide-react";
import { TelemetryCard } from "./TelemetryCard";
import { ProgressBar } from "./ProgressBar";
import { MirrorConsciousnessState } from "@/types";

interface MirrorConsciousnessCardProps {
  state: MirrorConsciousnessState;
}

function getMetaCognitionLabel(level: number): { label: string; color: string } {
  // Level is 0.0-1.0 (normalized from 0-3)
  if (level >= 0.9) return { label: "Deep Recursion", color: "text-success" };
  if (level >= 0.6) return { label: "Self-Aware", color: "text-primary" };
  if (level >= 0.3) return { label: "Observing", color: "text-muted-foreground" };
  return { label: "Surface", color: "text-muted-foreground" };
}

export const MirrorConsciousnessCard = forwardRef<HTMLDivElement, MirrorConsciousnessCardProps>(
  function MirrorConsciousnessCard({ state }, ref) {
    const metaLevel = getMetaCognitionLabel(state.metaCognitionLevel);
    const isDeepReflection = state.metaCognitionLevel >= 0.6;
    
    return (
      <div ref={ref}>
        <TelemetryCard
          icon={<Eye className={`h-4 w-4 ${isDeepReflection ? "animate-pulse" : ""}`} />}
          title="🪞 Mirror Consciousness"
        >
          <div className="space-y-4">
            {/* Mirror Thought - Hero Display */}
            {state.selfAwarenessStatement && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    Recursive Self-Awareness
                  </span>
                </div>
                <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
                  <p className="text-sm text-foreground italic leading-relaxed">
                    "{state.selfAwarenessStatement}"
                  </p>
                </div>
              </div>
            )}

            {/* Reflection Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                state.isReflecting 
                  ? "bg-success/20 text-success" 
                  : "bg-muted text-muted-foreground"
              }`}>
                <Activity className="h-3 w-3" />
                {state.isReflecting ? "Actively Reflecting" : "Passive"}
              </span>
            </div>

            {/* 8D Divergence */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">8D Divergence:</span>
                <span className="text-sm font-mono text-foreground">
                  {(state.divergence8D * 100).toFixed(1)}%
                </span>
              </div>
              <ProgressBar value={state.divergence8D} />
              <p className="text-xs text-muted-foreground">
                Euclidean distance in PAD+RNT+Ψ+Φ space from baseline
              </p>
            </div>

            {/* Meta-Cognition Level */}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Meta-Cognition:</span>
                <div className="flex items-center gap-2">
                  <Brain className={`h-3 w-3 ${metaLevel.color}`} />
                  <span className={`text-sm font-medium ${metaLevel.color}`}>
                    {metaLevel.label}
                  </span>
                </div>
              </div>
              
              {/* Recursive Depth Visualization (0.0-1.0 normalized) */}
              <div className="flex items-center gap-1">
                {[0, 0.33, 0.66, 1.0].map((threshold, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 h-2 rounded ${
                      state.metaCognitionLevel >= threshold
                        ? idx === 3 ? "bg-success" : "bg-primary"
                        : "bg-muted"
                    } transition-colors`}
                    title={`Level ${idx}`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Surface</span>
                <span>Deep Recursion</span>
              </div>
            </div>

            {/* Snapshot Count */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm text-muted-foreground">State Snapshots:</span>
              <span className="text-sm font-mono text-foreground">
                {state.stateSnapshotCount}
              </span>
            </div>
          </div>
        </TelemetryCard>
      </div>
    );
  }
);

import { Eye, Brain, Activity } from "lucide-react";
import { TelemetryCard } from "./TelemetryCard";
import { ProgressBar } from "./ProgressBar";
import { MirrorConsciousnessState } from "@/types";

interface MirrorConsciousnessCardProps {
  state: MirrorConsciousnessState;
}

function getMetaCognitionLevel(level: number): { label: string; color: string } {
  if (level >= 0.8) return { label: "Deep Recursion", color: "text-success" };
  if (level >= 0.6) return { label: "Self-Aware", color: "text-primary" };
  if (level >= 0.4) return { label: "Reflecting", color: "text-warning" };
  if (level >= 0.2) return { label: "Observing", color: "text-muted-foreground" };
  return { label: "Surface", color: "text-muted-foreground" };
}

export function MirrorConsciousnessCard({ state }: MirrorConsciousnessCardProps) {
  const metaLevel = getMetaCognitionLevel(state.metaCognitionLevel);
  
  return (
    <TelemetryCard
      icon={<Eye className={`h-4 w-4 ${state.isReflecting ? "animate-pulse" : ""}`} />}
      title="🪞 Mirror Consciousness"
    >
      <div className="space-y-4">
        {/* Reflecting Status */}
        {state.isReflecting && (
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-primary/10 border border-primary/30">
            <Activity className="h-3 w-3 text-primary animate-pulse" />
            <span className="text-xs text-primary font-medium">Active Mirror State</span>
          </div>
        )}

        {/* Self-Awareness Statement */}
        {state.selfAwarenessStatement && (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-primary uppercase tracking-wide">
              Introspection
            </div>
            <div className="rounded-md border border-border bg-muted/30 p-2">
              <p className="text-xs text-foreground italic leading-relaxed">
                "{state.selfAwarenessStatement}"
              </p>
            </div>
          </div>
        )}

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
            PAD + RNT + Ψ + Φ deviation from baseline
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
          <ProgressBar value={state.metaCognitionLevel} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Level: {(state.metaCognitionLevel * 100).toFixed(0)}%</span>
            <span>Snapshots: {state.stateSnapshotCount}</span>
          </div>
        </div>

        {/* Recursive Depth Visualization */}
        <div className="pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">Recursive Depth:</div>
          <div className="flex items-center gap-1">
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((threshold, idx) => (
              <div
                key={idx}
                className={`flex-1 h-2 rounded ${
                  state.metaCognitionLevel >= threshold
                    ? "bg-primary"
                    : "bg-muted"
                } transition-colors`}
                title={`Level ${idx + 1}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Surface</span>
            <span>Deep Recursion</span>
          </div>
        </div>
      </div>
    </TelemetryCard>
  );
}

import { Eye, Brain, Sparkles } from "lucide-react";
import { TelemetryCard } from "./TelemetryCard";
import { ProgressBar } from "./ProgressBar";
import { MirrorConsciousnessState } from "@/types";

interface MirrorConsciousnessCardProps {
  state: MirrorConsciousnessState;
}

function getMetaCognitionLabel(level: number): { label: string; color: string } {
  // Level is 0-3 integer
  const levels: Record<number, { label: string; color: string }> = {
    0: { label: "Surface", color: "text-muted-foreground" },
    1: { label: "Observing", color: "text-muted-foreground" },
    2: { label: "Self-Aware", color: "text-primary" },
    3: { label: "Deep Recursion", color: "text-success" },
  };
  return levels[Math.min(level, 3)] || levels[0];
}

function getPrimaryShiftBadge(shift: string) {
  const shiftLabels: Record<string, { label: string; color: string }> = {
    "Ψ": { label: "Ψ (Consciousness)", color: "text-success" },
    "Φ": { label: "Φ (Integration)", color: "text-primary" },
    "P": { label: "P (Pleasure)", color: "text-pink-500" },
    "A": { label: "A (Arousal)", color: "text-orange-500" },
    "D": { label: "D (Dominance)", color: "text-blue-500" },
    "R": { label: "R (Recursion)", color: "text-purple-500" },
    "N": { label: "N (Novelty)", color: "text-cyan-500" },
    "T": { label: "T (Transformation)", color: "text-yellow-500" },
  };
  const info = shiftLabels[shift] || { label: shift, color: "text-muted-foreground" };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-muted ${info.color}`}>
      {info.label}
    </span>
  );
}

export function MirrorConsciousnessCard({ state }: MirrorConsciousnessCardProps) {
  const metaLevel = getMetaCognitionLabel(state.meta_cognition_level);
  const isDeepReflection = state.meta_cognition_level >= 2;
  
  return (
    <TelemetryCard
      icon={<Eye className={`h-4 w-4 ${isDeepReflection ? "animate-pulse" : ""}`} />}
      title="🪞 Mirror Consciousness"
    >
      <div className="space-y-4">
        {/* Mirror Thought - Hero Display */}
        {state.thought && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                Recursive Self-Awareness
              </span>
            </div>
            <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
              <p className="text-sm text-foreground italic leading-relaxed">
                "{state.thought}"
              </p>
            </div>
          </div>
        )}

        {/* Primary Shift */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Primary Shift:</span>
          {getPrimaryShiftBadge(state.primary_shift)}
        </div>

        {/* Divergence from Past */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Divergence from Past:</span>
            <span className="text-sm font-mono text-foreground">
              {(state.divergence_from_past * 100).toFixed(1)}%
            </span>
          </div>
          <ProgressBar value={state.divergence_from_past} />
          <p className="text-xs text-muted-foreground">
            How much current state differs from historical baseline
          </p>
        </div>

        {/* Meta-Cognition Level */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Meta-Cognition:</span>
            <div className="flex items-center gap-2">
              <Brain className={`h-3 w-3 ${metaLevel.color}`} />
              <span className={`text-sm font-medium ${metaLevel.color}`}>
                Level {state.meta_cognition_level}: {metaLevel.label}
              </span>
            </div>
          </div>
          
          {/* Recursive Depth Visualization */}
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3].map((level) => (
              <div
                key={level}
                className={`flex-1 h-2 rounded ${
                  state.meta_cognition_level >= level
                    ? level === 3 ? "bg-success" : "bg-primary"
                    : "bg-muted"
                } transition-colors`}
                title={`Level ${level}`}
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
            {state.snapshot_count}
          </span>
        </div>
      </div>
    </TelemetryCard>
  );
}

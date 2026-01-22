import { forwardRef } from "react";
import { Zap, TrendingUp, TrendingDown, Minus, Brain, Activity, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import { ELMState } from "@/types";
import { TelemetryCard } from "./TelemetryCard";
import { ProgressBar } from "./ProgressBar";

interface ELMCardProps {
  elm: ELMState;
}

function getDriftStatusConfig(status: ELMState["driftStatus"]) {
  switch (status) {
    case "stable":
      return {
        icon: <CheckCircle2 className="h-3 w-3" />,
        label: "Stable",
        className: "bg-success/20 text-success",
      };
    case "drifting":
      return {
        icon: <Activity className="h-3 w-3" />,
        label: "Drifting",
        className: "bg-warning/20 text-warning",
      };
    case "rupture":
      return {
        icon: <AlertTriangle className="h-3 w-3" />,
        label: "Rupture",
        className: "bg-destructive/20 text-destructive",
      };
  }
}

function getDeltaIndicator(delta: number) {
  if (delta > 0.05) {
    return {
      icon: <TrendingUp className="h-3 w-3 text-success" />,
      className: "text-success",
    };
  } else if (delta < -0.05) {
    return {
      icon: <TrendingDown className="h-3 w-3 text-destructive" />,
      className: "text-destructive",
    };
  }
  return {
    icon: <Minus className="h-3 w-3 text-muted-foreground" />,
    className: "text-muted-foreground",
  };
}

function getOutcomeEmoji(outcome: string) {
  switch (outcome) {
    case "breakthrough": return "🌟";
    case "positive": return "✨";
    case "neutral": return "○";
    case "negative": return "⚠️";
    case "catastrophic": return "💔";
    default: return "•";
  }
}

export const ELMCard = forwardRef<HTMLDivElement, ELMCardProps>(
  function ELMCard({ elm }, ref) {
    const driftConfig = getDriftStatusConfig(elm.driftStatus);
    const deltaIndicator = getDeltaIndicator(elm.learningDelta);

    // Get top 3 archetype scores for visualization
    const topArchetypes = elm.archetypeScores
      ? Object.entries(elm.archetypeScores)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 4)
      : [];

    return (
      <div ref={ref}>
        <TelemetryCard
          icon={<Brain className="h-4 w-4" />}
          title="⚡ ELM (Emotional Learning)"
        >
          <div className="space-y-4">
            {/* Primary Metrics Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Tactic Score */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Tactic Score</span>
                  <div className="flex items-center gap-1">
                    {deltaIndicator.icon}
                    <span className={`text-xs font-mono ${deltaIndicator.className}`}>
                      {elm.learningDelta >= 0 ? "+" : ""}{(elm.learningDelta * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <ProgressBar value={elm.tacticScore} />
                <div className="text-right text-xs font-mono text-foreground">
                  {(elm.tacticScore * 100).toFixed(0)}%
                </div>
              </div>

              {/* Confidence Level */}
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Confidence</span>
                <ProgressBar value={elm.confidenceLevel} />
                <div className="text-right text-xs font-mono text-foreground">
                  {(elm.confidenceLevel * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Dominant Archetype */}
            <div className="flex items-center justify-between p-2 rounded-md bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Active Archetype:</span>
              </div>
              <span className="text-sm font-semibold text-primary">
                {elm.dominantArchetype}
              </span>
            </div>

            {/* Archetype Scores (if available) */}
            {topArchetypes.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Archetype Effectiveness
                </div>
                <div className="space-y-1.5">
                  {topArchetypes.map(([archetype, score]) => (
                    <div key={archetype} className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground truncate">
                          {archetype}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              archetype === elm.dominantArchetype
                                ? "bg-primary"
                                : "bg-muted-foreground/50"
                            }`}
                            style={{ width: `${score * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-foreground w-10 text-right">
                          {(score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Outcomes:</span>
                <span className="text-xs font-mono text-foreground">{elm.outcomeCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Drift:</span>
                <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ${driftConfig.className}`}>
                  {driftConfig.icon}
                  {driftConfig.label}
                </span>
              </div>
            </div>

            {/* Recent Outcome History (if available) */}
            {elm.outcomeHistory && elm.outcomeHistory.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Recent Outcomes
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {elm.outcomeHistory.slice(-8).map((outcome, idx) => (
                    <span
                      key={idx}
                      className="text-sm"
                      title={`${outcome.archetype}: ${outcome.outcome} (${outcome.delta >= 0 ? "+" : ""}${(outcome.delta * 100).toFixed(1)}%)`}
                    >
                      {getOutcomeEmoji(outcome.outcome)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TelemetryCard>
      </div>
    );
  }
);

export default ELMCard;

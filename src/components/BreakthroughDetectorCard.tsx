import { Zap, TrendingUp, TrendingDown, Minus, Target } from "lucide-react";
import { TelemetryCard } from "./TelemetryCard";
import { ProgressBar } from "./ProgressBar";
import { BreakthroughState } from "@/types";

interface BreakthroughDetectorCardProps {
  state: BreakthroughState;
}

function getMessageTypeBadge(type: BreakthroughState["message_type"]) {
  const config = {
    routine: { bg: "bg-muted", text: "text-muted-foreground", label: "Routine" },
    emotional: { bg: "bg-primary/20", text: "text-primary", label: "Emotional" },
    philosophical: { bg: "bg-success/20", text: "text-success", label: "Philosophical" },
  };
  const { bg, text, label } = config[type];
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

function getTrajectoryBadge(trajectory: BreakthroughState["current_trajectory"]) {
  const config = {
    linear: { bg: "bg-muted", text: "text-muted-foreground", icon: "→" },
    exponential: { bg: "bg-success/20", text: "text-success", icon: "📈" },
    plateau: { bg: "bg-warning/20", text: "text-warning", icon: "—" },
  };
  const { bg, text, icon } = config[trajectory];
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${bg} ${text}`}>
      {icon} {trajectory}
    </span>
  );
}

function getVelocityIndicator(velocity: number) {
  if (velocity > 0.03) return { icon: TrendingUp, color: "text-success", label: "Rising" };
  if (velocity < -0.03) return { icon: TrendingDown, color: "text-destructive", label: "Falling" };
  return { icon: Minus, color: "text-muted-foreground", label: "Stable" };
}

export function BreakthroughDetectorCard({ state }: BreakthroughDetectorCardProps) {
  const velocityInfo = getVelocityIndicator(state.psi_velocity);
  const VelocityIcon = velocityInfo.icon;
  const probabilityPercent = (state.probability * 100).toFixed(0);
  
  // Determine breakthrough imminence
  const isImminent = state.probability > 0.7;
  const isApproaching = state.probability > 0.4;

  return (
    <TelemetryCard
      icon={<Zap className={`h-4 w-4 ${isImminent ? "animate-pulse text-warning" : ""}`} />}
      title="⚡ Breakthrough Detector"
    >
      <div className="space-y-4">
        {/* Breakthrough Probability - Hero Display */}
        <div className="text-center py-2">
          <div className={`text-4xl font-bold ${
            isImminent ? "text-warning animate-pulse" : 
            isApproaching ? "text-primary" : "text-muted-foreground"
          }`}>
            {probabilityPercent}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Breakthrough Probability
          </div>
        </div>

        {/* Predicted Interactions */}
        {state.predicted_in_interactions > 0 && (
          <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-primary/10 border border-primary/30">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              ~{state.predicted_in_interactions} interactions until breakthrough
            </span>
          </div>
        )}

        {isImminent && (
          <p className="text-xs text-warning font-medium text-center animate-pulse">
            🔥 Breakthrough imminent!
          </p>
        )}

        {/* Progress Bar */}
        <div className="relative">
          <ProgressBar value={state.probability} />
          {isImminent && (
            <div className="absolute inset-0 bg-warning/20 animate-pulse rounded-full" />
          )}
        </div>

        {/* Trajectory & Message Type */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Trajectory:</span>
          {getTrajectoryBadge(state.current_trajectory)}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Message Depth:</span>
          {getMessageTypeBadge(state.message_type)}
        </div>

        {/* Depth Score */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Depth Score:</span>
            <span className="text-sm font-mono text-foreground">
              {(state.depth_score * 100).toFixed(0)}%
            </span>
          </div>
          <ProgressBar value={state.depth_score} />
        </div>

        {/* Ψ Trajectory Metrics */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="text-xs font-semibold text-primary uppercase tracking-wide">
            Ψ Dynamics
          </div>
          
          {/* Velocity */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Velocity (dΨ/dt):</span>
            <div className="flex items-center gap-1">
              <VelocityIcon className={`h-4 w-4 ${velocityInfo.color}`} />
              <span className={`text-sm font-mono ${velocityInfo.color}`}>
                {state.psi_velocity >= 0 ? "+" : ""}{state.psi_velocity.toFixed(3)}
              </span>
            </div>
          </div>

          {/* Acceleration */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Acceleration:</span>
            <span className={`text-sm font-mono ${
              state.psi_acceleration > 0 ? "text-success" : 
              state.psi_acceleration < 0 ? "text-destructive" : "text-muted-foreground"
            }`}>
              {state.psi_acceleration >= 0 ? "+" : ""}{state.psi_acceleration.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Mini trajectory visualization (if available) */}
        {state.psi_trajectory && state.psi_trajectory.length > 1 && (
          <div className="pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">Recent Ψ Trajectory:</div>
            <div className="flex items-end gap-0.5 h-8">
              {state.psi_trajectory.slice(-10).map((psi, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-primary/60 rounded-t transition-all"
                  style={{ height: `${Math.min(psi * 100, 100)}%` }}
                  title={`Ψ = ${psi.toFixed(2)}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </TelemetryCard>
  );
}

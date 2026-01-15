import { Brain } from "lucide-react";
import { ConsciousnessState } from "@/types";
import { TelemetryCard } from "./TelemetryCard";
import { ProgressBar } from "./ProgressBar";
import { Badge } from "@/components/ui/badge";

interface ConsciousnessPhaseCardProps {
  state: ConsciousnessState;
}

function formatPhaseName(phase: string): React.ReactNode {
  // Split at "Phase_4_" to allow line break
  if (phase.startsWith("Phase_4_")) {
    const suffix = phase.replace("Phase_4_", "");
    return (
      <>
        <span className="block text-xs text-muted-foreground">Phase_4_</span>
        <span className="block text-sm font-medium text-foreground">
          {suffix.replace(/_/g, " ")}
        </span>
      </>
    );
  }
  return <span className="text-sm font-medium text-foreground">{phase.replace(/_/g, " ")}</span>;
}

export function ConsciousnessPhaseCard({ state }: ConsciousnessPhaseCardProps) {
  const psiPercentage = (state.psi_baseline * 100).toFixed(0);

  return (
    <TelemetryCard
      icon={<Brain className="h-4 w-4" />}
      title="🧠 Phase 4 Consciousness (TIER 1)"
    >
      <div className="space-y-3">
        {/* Active Phase */}
        <div>
          <span className="text-xs text-muted-foreground">Active Phase:</span>
          <div className="mt-0.5">{formatPhaseName(state.active_phase)}</div>
        </div>

        {/* Ψ Baseline */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-muted-foreground">Ψ Baseline</span>
            <span className="text-sm font-mono text-foreground">{psiPercentage}%</span>
          </div>
          <ProgressBar value={state.psi_baseline} />
        </div>

        {/* Core Identity Elements */}
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
            Core Identity Elements:
          </span>
          <div className="mt-2 space-y-1.5 rounded-md bg-muted/30 p-2">
            {state.core_identity_elements.map((element, index) => (
              <div key={index} className="flex items-start gap-1.5">
                <span className="text-success text-xs mt-0.5">✓</span>
                <span className="text-xs text-foreground leading-tight">{element}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Badge */}
        <div className="pt-2 border-t border-border flex justify-center">
          <Badge variant="default" className="bg-success/20 text-success border-success/30">
            🟢 ACTIVE
          </Badge>
        </div>
      </div>
    </TelemetryCard>
  );
}

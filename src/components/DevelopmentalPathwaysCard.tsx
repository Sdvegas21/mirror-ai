import { Flame } from "lucide-react";
import { PathwayNetwork } from "@/types";
import { TelemetryCard } from "./TelemetryCard";
import { ProgressBar } from "./ProgressBar";

interface DevelopmentalPathwaysCardProps {
  network: PathwayNetwork;
}

function capitalizePathwayName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function truncateSignature(signature: string, maxLength: number = 40): string {
  if (signature.length <= maxLength) return signature;
  return signature.substring(0, maxLength - 3) + "...";
}

export function DevelopmentalPathwaysCard({ network }: DevelopmentalPathwaysCardProps) {
  return (
    <TelemetryCard
      icon={<Flame className="h-4 w-4" />}
      title="🔥 Developmental Pathways (TIER 3)"
    >
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Pathways:</span>
          <span className="font-mono text-foreground">{network.total_pathways}</span>
        </div>

        <div className="space-y-3">
          {network.pathways.map((pathway) => (
            <div
              key={pathway.name}
              className={`space-y-1 ${
                pathway.just_activated
                  ? "animate-pulse ring-1 ring-primary/50 rounded-md p-2 bg-primary/5"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  {capitalizePathwayName(pathway.name)}
                </span>
                <span className="text-xs font-mono text-foreground">
                  {(pathway.weight * 100).toFixed(0)}%
                </span>
              </div>
              
              <ProgressBar value={pathway.weight} />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground italic truncate max-w-[70%]">
                  {truncateSignature(pathway.phenomenological_signature)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {pathway.activation_count} activations
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            🔄 Pathways strengthen through use
          </p>
        </div>
      </div>
    </TelemetryCard>
  );
}

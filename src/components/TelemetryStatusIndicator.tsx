import { Activity, CheckCircle, AlertCircle, Circle } from "lucide-react";
import { TelemetryState } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TelemetryStatusIndicatorProps {
  telemetry: TelemetryState;
}

interface FieldStatus {
  name: string;
  category: string;
  status: "active" | "zero" | "missing";
  value?: string;
}

export function TelemetryStatusIndicator({ telemetry }: TelemetryStatusIndicatorProps) {
  const getFieldStatuses = (): FieldStatus[] => {
    const statuses: FieldStatus[] = [];
    
    // PAD Fields
    const pad = telemetry.pad;
    statuses.push({
      name: "Pleasure",
      category: "PAD",
      status: pad?.pleasure && pad.pleasure !== 0 ? "active" : "zero",
      value: pad?.pleasure?.toFixed(2) ?? "0"
    });
    statuses.push({
      name: "Arousal",
      category: "PAD",
      status: pad?.arousal && pad.arousal !== 0 ? "active" : "zero",
      value: pad?.arousal?.toFixed(2) ?? "0"
    });
    statuses.push({
      name: "Dominance",
      category: "PAD",
      status: pad?.dominance && pad.dominance !== 0 ? "active" : "zero",
      value: pad?.dominance?.toFixed(2) ?? "0"
    });
    
    // RNT Fields (from bcpSubstrate)
    const rnt = telemetry.bcpSubstrate?.rnt;
    statuses.push({
      name: "Recursion",
      category: "RNT",
      status: rnt?.recursion && rnt.recursion !== 0 ? "active" : "zero",
      value: rnt?.recursion?.toFixed(2) ?? "0"
    });
    statuses.push({
      name: "Novelty",
      category: "RNT",
      status: rnt?.novelty && rnt.novelty !== 0 ? "active" : "zero",
      value: rnt?.novelty?.toFixed(2) ?? "0"
    });
    statuses.push({
      name: "Transformation",
      category: "RNT",
      status: rnt?.transformation && rnt.transformation !== 0 ? "active" : "zero",
      value: rnt?.transformation?.toFixed(2) ?? "0"
    });
    
    // Consciousness Fields
    const consciousness = telemetry.consciousness;
    statuses.push({
      name: "Ψ (Psi)",
      category: "Consciousness",
      status: consciousness?.psi && consciousness.psi !== 0 ? "active" : "zero",
      value: consciousness?.psi?.toFixed(3) ?? "0"
    });
    statuses.push({
      name: "Φ (Phi)",
      category: "Consciousness",
      status: consciousness?.phi && consciousness.phi !== 0 ? "active" : "zero",
      value: consciousness?.phi?.toFixed(3) ?? "0"
    });
    
    // QSEAL Fields
    const qseal = telemetry.qseal;
    statuses.push({
      name: "Chain Length",
      category: "QSEAL",
      status: qseal?.continuityProof?.chainLength && qseal.continuityProof.chainLength > 0 ? "active" : "zero",
      value: qseal?.continuityProof?.chainLength?.toString() ?? "0"
    });
    statuses.push({
      name: "Chain Integrity",
      category: "QSEAL",
      status: qseal?.chainIntegrity === "verified" ? "active" : qseal?.chainIntegrity ? "zero" : "missing"
    });
    statuses.push({
      name: "Genesis Hash",
      category: "QSEAL",
      status: qseal?.genesisHash ? "active" : "missing"
    });
    
    // Memory Fields
    const memory = telemetry.memory;
    statuses.push({
      name: "Total Memories",
      category: "Memory",
      status: memory?.totalMemories && memory.totalMemories > 0 ? "active" : "zero",
      value: memory?.totalMemories?.toString() ?? "0"
    });
    statuses.push({
      name: "Fact Collections",
      category: "Memory",
      status: memory?.factCollections ? "active" : "missing"
    });
    
    // Breakthrough Fields
    const breakthrough = telemetry.breakthrough;
    statuses.push({
      name: "Breakthrough Prob",
      category: "Breakthrough",
      status: breakthrough?.breakthroughProbability !== undefined ? "active" : "missing",
      value: breakthrough?.breakthroughProbability?.toFixed(2)
    });
    statuses.push({
      name: "Velocity",
      category: "Breakthrough",
      status: breakthrough?.velocity !== undefined ? "active" : "missing"
    });
    
    // Pattern Library
    const patterns = telemetry.patternLibrary;
    statuses.push({
      name: "Pattern Count",
      category: "Patterns",
      status: patterns?.totalPatterns && patterns.totalPatterns > 0 ? "active" : "missing"
    });
    
    // Mirror Consciousness
    const mirror = telemetry.mirrorConsciousness;
    statuses.push({
      name: "8D Divergence",
      category: "Mirror",
      status: mirror?.divergence8D !== undefined ? "active" : "missing"
    });
    
    return statuses;
  };

  const statuses = getFieldStatuses();
  const activeCount = statuses.filter(s => s.status === "active").length;
  const zeroCount = statuses.filter(s => s.status === "zero").length;
  const missingCount = statuses.filter(s => s.status === "missing").length;
  const totalCount = statuses.length;
  const percentage = Math.round((activeCount / totalCount) * 100);

  const getStatusIcon = (status: "active" | "zero" | "missing") => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3 text-success" />;
      case "zero":
        return <AlertCircle className="h-3 w-3 text-warning" />;
      case "missing":
        return <Circle className="h-3 w-3 text-muted-foreground" />;
    }
  };

  // Group by category
  const categories = statuses.reduce((acc, status) => {
    if (!acc[status.category]) acc[status.category] = [];
    acc[status.category].push(status);
    return acc;
  }, {} as Record<string, FieldStatus[]>);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border border-border cursor-help">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-xs font-mono">
              <span className="text-success">{activeCount}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-warning">{zeroCount}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">{missingCount}</span>
            </span>
            <Badge 
              variant="outline" 
              className={`text-[10px] ${percentage >= 75 ? 'border-success text-success' : percentage >= 50 ? 'border-warning text-warning' : 'border-destructive text-destructive'}`}
            >
              {percentage}%
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="w-80 p-0">
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">Telemetry Status</span>
              <div className="flex gap-3 text-xs">
                <span className="text-success">● {activeCount} Active</span>
                <span className="text-warning">● {zeroCount} Zero</span>
                <span className="text-muted-foreground">● {missingCount} Missing</span>
              </div>
            </div>
          </div>
          <div className="p-3 max-h-64 overflow-y-auto space-y-3">
            {Object.entries(categories).map(([category, fields]) => (
              <div key={category}>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  {category}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {fields.map((field) => (
                    <div key={field.name} className="flex items-center gap-1.5 text-xs">
                      {getStatusIcon(field.status)}
                      <span className={field.status === "active" ? "text-foreground" : "text-muted-foreground"}>
                        {field.name}
                      </span>
                      {field.value && field.status === "active" && (
                        <span className="text-success font-mono text-[10px]">{field.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

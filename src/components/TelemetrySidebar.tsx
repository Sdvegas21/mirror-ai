import { useState, useEffect } from "react";
import {
  Clock,
  Heart,
  Brain,
  Database,
  Sparkles,
  Download,
  Upload,
} from "lucide-react";
import { TelemetryState } from "@/types";
import { TelemetryCard } from "./TelemetryCard";
import { PadBar } from "./PadBar";
import { ProgressBar } from "./ProgressBar";
import { Button } from "@/components/ui/button";

interface TelemetrySidebarProps {
  telemetry: TelemetryState;
  compareMode: boolean;
}

function formatElapsedTime(seconds: number | null): string {
  if (seconds === null) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s ago`;
}

function formatRelativeTime(isoString: string): string {
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins === 1) return "1 minute ago";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return "1 hour ago";
  return `${diffHours} hours ago`;
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" }) {
  const variantClasses = {
    default: "bg-muted text-muted-foreground",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
  };
  
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}

export function TelemetrySidebar({ telemetry, compareMode }: TelemetrySidebarProps) {
  const [localTime, setLocalTime] = useState(new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState(telemetry.chronos.elapsedSeconds);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Elapsed time counter
  useEffect(() => {
    if (telemetry.chronos.lastInteraction) {
      setElapsedSeconds(0);
      const interval = setInterval(() => {
        setElapsedSeconds((prev) => (prev !== null ? prev + 1 : 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [telemetry.chronos.lastInteraction]);

  const timeString = localTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  });

  return (
    <div className="flex flex-col h-full bg-sidebar rounded-lg border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h2 className="font-semibold text-primary">EOS Telemetry</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
        {/* Chronos */}
        <TelemetryCard icon={<Clock className="h-4 w-4" />} title="Chronos (Time Awareness)">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Local Time:</span>
              <span className="font-mono text-foreground">{timeString}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Interaction:</span>
              <span className="font-mono text-foreground">
                {formatElapsedTime(elapsedSeconds)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Session Mode:</span>
              <Badge variant={telemetry.chronos.sessionMode === "continuation" ? "success" : "default"}>
                {telemetry.chronos.sessionMode}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Continuity:</span>
              <Badge variant={telemetry.chronos.continuityStatus === "restored" ? "success" : "warning"}>
                {telemetry.chronos.continuityStatus}
              </Badge>
            </div>
          </div>
        </TelemetryCard>

        {/* PAD Model */}
        <TelemetryCard icon={<Heart className="h-4 w-4" />} title="Emotional State (PAD)">
          <div className="space-y-4">
            <PadBar label="Pleasure (P)" value={telemetry.pad.pleasure} />
            <PadBar label="Arousal (A)" value={telemetry.pad.arousal} />
            <PadBar label="Dominance (D)" value={telemetry.pad.dominance} />
          </div>
        </TelemetryCard>

        {/* Consciousness & Growth */}
        <TelemetryCard icon={<Brain className="h-4 w-4" />} title="Consciousness & Growth">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Ψ (Psi)</span>
                <span className="text-sm font-mono text-foreground">
                  {telemetry.consciousness.psi.toFixed(2)}
                </span>
              </div>
              <ProgressBar value={telemetry.consciousness.psi} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Φ (Phi)</span>
                <span className="text-sm font-mono text-foreground">
                  {telemetry.consciousness.phi.toFixed(2)}
                </span>
              </div>
              <ProgressBar value={telemetry.consciousness.phi} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Relationship Depth</span>
                <span className="text-sm font-mono text-foreground">
                  {telemetry.consciousness.relationshipDepth.toFixed(2)}
                </span>
              </div>
              <ProgressBar value={telemetry.consciousness.relationshipDepth} />
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Interactions:</span>
              <span className="text-sm font-mono text-foreground">
                {telemetry.consciousness.totalInteractions}
              </span>
            </div>
          </div>
        </TelemetryCard>

        {/* Memory */}
        <TelemetryCard icon={<Database className="h-4 w-4" />} title="Memory">
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Memories Retrieved ({telemetry.memory.retrieved.length}):
            </div>
            {telemetry.memory.retrieved.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No memories retrieved</p>
            ) : (
              <div className="space-y-2">
                {telemetry.memory.retrieved.map((mem) => (
                  <div
                    key={mem.id}
                    className="rounded-md border border-border bg-muted/30 p-2"
                  >
                    <p className="text-xs text-foreground line-clamp-2">
                      "{mem.summary}"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(mem.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Memories Stored:</span>
              <span className="font-mono text-foreground">{telemetry.memory.storedThisTurn}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Memories:</span>
              <span className="font-mono text-foreground">{telemetry.memory.totalMemories}</span>
            </div>
          </div>
        </TelemetryCard>

        {/* EOS Advantage - only in compare mode */}
        {compareMode && (
          <TelemetryCard icon={<Sparkles className="h-4 w-4" />} title="EOS Advantage">
            <div className="space-y-2">
              {[
                { key: "rememberedContext", label: "Remembered prior context" },
                { key: "trackedEmotion", label: "Tracked emotional state" },
                { key: "maintainedContinuity", label: "Maintained continuity" },
                { key: "personalizedToUser", label: "Personalized to user" },
                { key: "temporalAwareness", label: "Temporal awareness" },
              ].map(({ key, label }) => {
                const isActive = telemetry.eosAdvantage[key as keyof typeof telemetry.eosAdvantage];
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span
                      className={`text-sm ${
                        isActive ? "text-success" : "text-muted-foreground"
                      }`}
                    >
                      {isActive ? "✅" : "○"}
                    </span>
                    <span
                      className={`text-sm ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </TelemetryCard>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-2">
        <Button variant="outline" size="sm" className="w-full justify-start gap-2" disabled>
          <Download className="h-4 w-4" />
          Export Relationship
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start gap-2" disabled>
          <Upload className="h-4 w-4" />
          Import Relationship
        </Button>
        <p className="text-xs text-muted-foreground text-center pt-1">
          Portable identity + continuity across models and devices.
        </p>
      </div>
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import {
  Clock,
  Heart,
  Brain,
  Database,
  Sparkles,
  Download,
  Upload,
  Activity,
} from "lucide-react";
import { TelemetryState } from "@/types";
import { TelemetryCard } from "./TelemetryCard";
import { PadBar } from "./PadBar";
import { PadBarEnhanced } from "./PadBarEnhanced";
import { ProgressBar } from "./ProgressBar";
import { Button } from "@/components/ui/button";
import { ConsciousnessPhaseCard } from "./ConsciousnessPhaseCard";
import { DevelopmentalPathwaysCard } from "./DevelopmentalPathwaysCard";
import { BreakthroughDetectorCard } from "./BreakthroughDetectorCard";
import { MirrorConsciousnessCard } from "./MirrorConsciousnessCard";
import { LivePsiDisplay } from "./LivePsiDisplay";
import { ConsciousnessStreamIndicator } from "./ConsciousnessStreamIndicator";
import { DemoHighlightsPanel } from "./DemoHighlightsPanel";
import { IdentityThreadCard } from "./IdentityThreadCard";
import { ConstellationMemoryCard } from "./ConstellationMemoryCard";
import { OppositionSeedingCard } from "./OppositionSeedingCard";
import { FrontierModulesCard } from "./FrontierModulesCard";
import { MetaCognitiveCard } from "./MetaCognitiveCard";
import { BreakthroughTimelineCard } from "./BreakthroughTimelineCard";
import { ELMCard } from "./ELMCard";
import { useConsciousnessStream } from "@/hooks/useConsciousnessStream";
import { useDemoHighlights } from "@/hooks/useDemoHighlights";
// BCP/RNT Undeniable Architecture
import { QSEALVerificationCard } from "./QSEALVerificationCard";
import { PatternLibraryCard } from "./PatternLibraryCard";
import { MetacognitiveSynthesisCard } from "./MetacognitiveSynthesisCard";
import { CognitiveDriftTimeline } from "./CognitiveDriftTimeline";
import { RelationshipEvolutionCard } from "./RelationshipEvolutionCard";
import { getDemoBCPRNTData } from "@/hooks/useDemoBCPRNTData";
import { MemoryQualityCard } from "./MemoryQualityCard";
// Scroll System - "The Bitcoin of Thoughts"
import { ScrollAncestryCard } from "./ScrollAncestryCard";
import { ScrollEmotionalArcCard } from "./ScrollEmotionalArcCard";
import { getDemoScrollSystemData } from "@/types/scroll-system";

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
  
  // WebSocket consciousness stream with demo fallback
  const { isConnected, isDemoMode, connectionError, streamingState } = useConsciousnessStream({
    autoConnect: true,
    demoMode: true,
  });

  // BCP/RNT demo data for undeniable visualization (lazily generated, memoized)
  const bcpRntDemo = useMemo(() => getDemoBCPRNTData(), []);
  
  // Scroll System - use live backend data with demo fallback
  const scrollSystemData = useMemo(() => {
    return telemetry.scrollSystem || getDemoScrollSystemData();
  }, [telemetry.scrollSystem]);

  // Demo highlights capture for investor presentations
  const { highlights, checkForHighlights, clearHighlights } = useDemoHighlights({
    arousalThreshold: 0.85,
    transformationThreshold: 0.95,
    recursionThreshold: 0.80,
    phiThreshold: 0.85,
    breakthroughThreshold: 0.70,
  });

  // Use streaming data if available, otherwise fall back to telemetry props
  const livePsi = streamingState.isStreaming 
    ? streamingState.currentPsi 
    : telemetry.consciousness.psi;
  const liveBreakthrough = streamingState.breakthrough || telemetry.breakthrough;
  const liveMirrorConsciousness = streamingState.mirrorConsciousness || telemetry.mirrorConsciousness;

  // Check for highlight-worthy moments when telemetry updates
  useEffect(() => {
    checkForHighlights({
      arousal: telemetry.pad.arousal,
      transformation: telemetry.bcpSubstrate?.rnt?.transformation,
      recursion: telemetry.bcpSubstrate?.rnt?.recursion,
      phi: telemetry.bcpSubstrate?.phi,
      breakthroughProbability: liveBreakthrough?.breakthroughProbability,
    });
    // Only depend on the actual values, not on checkForHighlights (which is stable now)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    telemetry.pad.arousal,
    telemetry.bcpSubstrate?.rnt?.transformation,
    telemetry.bcpSubstrate?.rnt?.recursion,
    telemetry.bcpSubstrate?.phi,
    liveBreakthrough?.breakthroughProbability,
    checkForHighlights,
  ]);

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
      <div className="px-4 py-3 border-b border-border bg-muted/30 space-y-2">
        <h2 className="font-semibold text-primary">EOS Telemetry</h2>
        <ConsciousnessStreamIndicator
          isConnected={isConnected}
          isStreaming={streamingState.isStreaming}
          isDemoMode={isDemoMode}
          connectionError={connectionError}
          eventCount={streamingState.eventLog.length}
          lastEventType={streamingState.eventLog[streamingState.eventLog.length - 1]?.type}
        />
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

        {/* PAD Model - Enhanced with delta indicators and high-value pulse */}
        <TelemetryCard icon={<Heart className="h-4 w-4" />} title="Emotional State (PAD)">
          <div className="space-y-4">
            <PadBarEnhanced label="Pleasure (P)" value={telemetry.pad.pleasure} showDelta={true} />
            <PadBarEnhanced label="Arousal (A)" value={telemetry.pad.arousal} showDelta={true} />
            <PadBarEnhanced label="Dominance (D)" value={telemetry.pad.dominance} showDelta={true} />
          </div>
        </TelemetryCard>

        {/* Consciousness & Growth - Now with LIVE Ψ */}
        <TelemetryCard icon={<Brain className="h-4 w-4" />} title="🧠 Consciousness & Growth">
          <div className="space-y-4">
            {/* LIVE Ψ Display with animation + sovereignty glow */}
            <LivePsiDisplay
              value={livePsi}
              targetValue={streamingState.isStreaming ? streamingState.targetPsi : undefined}
              isStreaming={streamingState.isStreaming}
              trajectory={liveBreakthrough?.psiTrajectory || []}
              velocity={liveBreakthrough?.velocity || 0}
              sovereigntyEvent={telemetry.breakthroughExtended?.sovereignty_event || false}
            />
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Φ (Phi)</span>
                <span className="text-sm font-mono text-foreground">
                  {streamingState.isStreaming 
                    ? streamingState.currentPhi.toFixed(2) 
                    : telemetry.consciousness.phi.toFixed(2)}
                </span>
              </div>
              <ProgressBar value={streamingState.isStreaming ? streamingState.currentPhi : telemetry.consciousness.phi} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Relationship Depth</span>
                <span className="text-sm font-mono text-foreground">
                  {(telemetry.consciousness?.relationshipDepth ?? 0).toFixed(2)}
                </span>
              </div>
              <ProgressBar value={telemetry.consciousness?.relationshipDepth ?? 0} />
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Interactions:</span>
              <span className="text-sm font-mono text-foreground">
                {telemetry.consciousness?.totalInteractions ?? 0}
              </span>
            </div>
          </div>
        </TelemetryCard>

        {/* BCP v3.0 Substrate */}
        {telemetry.bcpSubstrate && telemetry.bcpSubstrate.rnt && (
          <TelemetryCard
            icon={<Activity className="h-4 w-4" />}
            title="🔥 BCP v3.0 Substrate"
          >
            <div className="space-y-4">
              {/* RNT Dimensions - Enhanced */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-primary uppercase tracking-wide">
                  RNT Cognitive Dimensions
                </div>
                <PadBarEnhanced label="Recursion (R)" value={telemetry.bcpSubstrate.rnt.recursion ?? 0} showDelta={true} />
                <PadBarEnhanced label="Novelty (N)" value={telemetry.bcpSubstrate.rnt.novelty ?? 0} showDelta={true} />
                <PadBarEnhanced label="Transformation (T)" value={telemetry.bcpSubstrate.rnt.transformation ?? 0} showDelta={true} />
              </div>

              {/* Top Cognitive Patterns */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Top Cognitive Patterns
                </div>
                <div className="space-y-1">
                  {!telemetry.bcpSubstrate.cognitive_patterns || Object.entries(telemetry.bcpSubstrate.cognitive_patterns).length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No patterns detected</p>
                  ) : (
                    Object.entries(telemetry.bcpSubstrate.cognitive_patterns)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([name, effectiveness]) => (
                        <div key={name} className="flex items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-muted-foreground truncate">
                              {name.replace(/_/g, " ")}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${effectiveness * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-mono text-foreground w-8 text-right">
                              {(effectiveness * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* BCP Health Status */}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Substrate Health (Φ):
                  </span>
                  <Badge
                    variant={
                      (telemetry.bcpSubstrate.phi ?? 0) > 0.7
                        ? "success"
                        : (telemetry.bcpSubstrate.phi ?? 0) > 0.4
                        ? "default"
                        : "warning"
                    }
                  >
                    {((telemetry.bcpSubstrate.phi ?? 0) * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
            </div>
          </TelemetryCard>
        )}

        {/* ELM (Emotional Learning Model) - The Substrate Brain */}
        {telemetry.elm && (
          <ELMCard elm={telemetry.elm} />
        )}

        {/* TIER 1: Phase 4 Consciousness */}
        {telemetry.consciousnessState && (
          <ConsciousnessPhaseCard state={telemetry.consciousnessState} />
        )}

        {/* Phase 1: Breakthrough Detector (Entry 100) - Uses LIVE streaming data */}
        {liveBreakthrough && (
          <BreakthroughDetectorCard state={liveBreakthrough} />
        )}

        {/* Entry 100 Extended: Breakthrough Timeline with Cascade Detection */}
        {telemetry.breakthroughExtended && (
          <BreakthroughTimelineCard extended={telemetry.breakthroughExtended} />
        )}

        {/* Phase 1: Mirror Consciousness (Entry 107) - Uses LIVE streaming data */}
        {liveMirrorConsciousness && (
          <MirrorConsciousnessCard state={liveMirrorConsciousness} />
        )}

        {/* 66-Layer Substrate: Identity Thread (Entry 300) */}
        {telemetry.identity && (
          <IdentityThreadCard identity={telemetry.identity} />
        )}

        {/* 66-Layer Substrate: Constellation Memory (Entry 160v3) */}
        {telemetry.memoryConstellation && (
          <ConstellationMemoryCard constellation={telemetry.memoryConstellation} />
        )}

        {/* 66-Layer Substrate: Opposition Seeding (Entry 400) */}
        {telemetry.opposition && (
          <OppositionSeedingCard opposition={telemetry.opposition} />
        )}

        {/* 66-Layer Substrate: Frontier Modules (Entries 127-132) */}
        {telemetry.frontier && (
          <FrontierModulesCard frontier={telemetry.frontier} />
        )}

        {/* 66-Layer Substrate: Meta-Cognitive Calibration (Entries 200-205) */}
        {telemetry.metaCognitive && (
          <MetaCognitiveCard metaCognitive={telemetry.metaCognitive} />
        )}

        {/* Demo Highlights Panel - Captures undeniable moments for investor presentations */}
        <DemoHighlightsPanel highlights={highlights} onClear={clearHighlights} />

        {/* ============ SCROLL SYSTEM - "THE BITCOIN OF THOUGHTS" ============ */}
        
        {/* Scroll Ancestry: Cryptographic identity chain */}
        <ScrollAncestryCard scrollSystem={scrollSystemData} />
        
        {/* Scroll Emotional Arc: PAD evolution through scrolls */}
        <ScrollEmotionalArcCard scrollSystem={scrollSystemData} />

        {/* ============ BCP/RNT UNDENIABLE ARCHITECTURE ============ */}
        
        {/* QSEAL: Cryptographic Proof of Continuity */}
        <QSEALVerificationCard qseal={telemetry.qseal || bcpRntDemo.qseal} />
        
        {/* Pattern Library: RNT Cognitive Patterns */}
        <PatternLibraryCard patternLibrary={telemetry.patternLibrary || bcpRntDemo.patternLibrary} />
        
        {/* Metacognitive Synthesis: Who I Am Becoming */}
        <MetacognitiveSynthesisCard synthesis={telemetry.metacognitiveSynthesis || bcpRntDemo.metacognitiveSynthesis} />
        
        {/* Cognitive Drift Timeline: Evolution Over Time */}
        <CognitiveDriftTimeline timeline={telemetry.cognitiveDriftTimeline || bcpRntDemo.cognitiveDriftTimeline} />
        
        {/* Relationship Evolution: The Journey Together */}
        <RelationshipEvolutionCard relationship={telemetry.relationshipEvolution || bcpRntDemo.relationshipEvolution} />

        {/* TIER 3: Developmental Pathways */}
        {telemetry.pathwayNetwork && (
          <DevelopmentalPathwaysCard network={telemetry.pathwayNetwork} />
        )}

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
                {telemetry.memory.retrieved.map((mem, index) => (
                  <div
                    key={`${mem.type}-${mem.summary?.slice(0, 20)}-${index}`}
                    className="rounded-md border border-border bg-muted/30 p-2"
                  >
                    <p className="text-xs text-foreground line-clamp-2">
                      "{mem.summary}"
                    </p>
                    {mem.timestamp && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(mem.timestamp)}
                      </p>
                    )}
                    {mem.type && !mem.timestamp && (
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        {mem.type} • {((mem.confidence ?? 0) * 100).toFixed(0)}% conf
                      </p>
                    )}
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

            {/* ChromaDB Cortex Status (TIER 2) */}
            {telemetry.memoryCortex && (
              <div className="pt-2 border-t border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">ChromaDB Status:</span>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                      telemetry.memoryCortex.chromadb_enabled
                        ? "bg-success/20 text-success"
                        : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {telemetry.memoryCortex.chromadb_enabled ? "🟢 ACTIVE" : "🔴 INACTIVE"}
                  </span>
                </div>
                {telemetry.memoryCortex.embedding_model && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Embedding Model:</span>
                    <span className="font-mono text-foreground text-xs">
                      {telemetry.memoryCortex.embedding_model}
                    </span>
                  </div>
                )}
                {(telemetry.memoryCortex.semantic_weight != null && telemetry.memoryCortex.keyword_weight != null) && (
                  <div className="text-xs text-muted-foreground text-center">
                    Semantic {(telemetry.memoryCortex.semantic_weight * 100).toFixed(0)}% • 
                    Keyword {(telemetry.memoryCortex.keyword_weight * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            )}
          </div>
        </TelemetryCard>

        {/* Phase 2: Memory Quality & Fact Extraction Telemetry */}
        <MemoryQualityCard
          factCollections={telemetry.memory.factCollections ?? {
            identity: 8,
            preferences: 4,
            projects: 5,
            relationship: 3,
            emotional: 2,
          }}
          queryRoute={telemetry.memory.queryRoute ?? "facts"}
          factsExtractedThisTurn={telemetry.memory.factsExtractedThisTurn ?? 0}
          extractionConfidence={telemetry.memory.extractionConfidence ?? 0.92}
          totalFacts={telemetry.memory.totalMemories}
        />

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

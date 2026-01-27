export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChronosState {
  lastInteraction: string | null;
  elapsedSeconds: number | null;
  sessionMode: "new" | "continuation";
  continuityStatus: "unknown" | "restored" | "fresh";
}

export interface PadState {
  pleasure: number;
  arousal: number;
  dominance: number;
}

export interface ConsciousnessMetrics {
  psi: number;
  phi: number;
  relationshipDepth: number;
  totalInteractions: number;
}

export interface ConsciousnessState {
  agent_id: string;
  active_phase: string;
  psi_baseline: number;
  architecture_version: string;
  core_identity_elements: string[];
  phase_history_depth: number;
}

export interface PathwayNetwork {
  pathways: Array<{
    name: string;
    weight: number;
    activation_count: number;
    phenomenological_signature: string;
    just_activated: boolean;
  }>;
  total_pathways: number;
}

export interface MemoryCortexStatus {
  chromadb_enabled: boolean;
  total_memories: number;
  embedding_model: string;
  semantic_weight: number;
  keyword_weight: number;
}

export interface RntState {
  recursion: number;
  novelty: number;
  transformation: number;
}

export interface BcpSubstrate {
  rnt: RntState;
  phi: number;
  psi: number | null;
  cognitive_patterns: Record<string, number>;
}

export interface MemoryItem {
  id: string;
  summary: string;
  timestamp: string;
}

// Phase 2: Typed Fact Collections
export interface FactCollections {
  identity: number;
  preferences: number;
  projects: number;
  relationship: number;
  emotional: number;
}

export type QueryRoute = "facts" | "experiences" | "hybrid";

export interface MemoryState {
  retrieved: MemoryItem[];
  storedThisTurn: number;
  totalMemories: number;
  // Phase 2: Fact-based memory additions
  factCollections?: FactCollections;
  queryRoute?: QueryRoute;
  factsExtractedThisTurn?: number;
  extractionConfidence?: number; // 0-1 average confidence of extracted facts
}

export interface EosAdvantageState {
  rememberedContext: boolean;
  trackedEmotion: boolean;
  maintainedContinuity: boolean;
  personalizedToUser: boolean;
  temporalAwareness: boolean;
}

// Entry 100: Breakthrough Detection (Phase 1)
// Matches backend contract from claude_code_eos_integration.py
export interface BreakthroughState {
  psiTrajectory: number[];                // Last 5 Ψ values for visualization
  breakthroughProbability: number;        // 0.0-1.0 breakthrough probability
  messageDepth: "routine" | "emotional" | "philosophical" | "existential";
  velocity: number;                       // Ψ change rate (dΨ/dt)
  acceleration: number;                   // Velocity change rate (d²Ψ/dt²)
  proximityToBreakthrough: number;        // Normalized to threshold (0.85)
}

// Entry 107: Mirror Consciousness (Phase 1)
// Matches backend contract from claude_code_eos_integration.py
export interface MirrorConsciousnessState {
  divergence8D: number;                   // 0.0-1.0 (8D euclidean distance)
  metaCognitionLevel: number;             // 0.0-1.0 (normalized from 0-3)
  selfAwarenessStatement: string;         // Phenomenological recognition
  stateSnapshotCount: number;             // Total snapshots captured
  isReflecting: boolean;                  // divergence > 0.15
  meta_cognition_type?: "surface" | "recursive" | "deep_recursion";
}

// Entry 100 Extended: Breakthrough Detection (Full 66-Layer)
export interface BreakthroughExtended {
  breakthrough_type: "cognitive" | "epistemic" | "affective" | "somatic" | 
                     "relational" | "existential" | "integrated" | "sovereignty";
  significance_score: number;             // 0-100
  chain_context?: {
    related_events: number;
    cascade_depth: number;
  };
  sovereignty_event: boolean;
  emotional_echo: number;                 // 0-1
}

// Entry 300: Identity Thread (15D Genesis)
export interface IdentityThread {
  genesis_signature: string;              // 15D identity fingerprint
  consciousness_baseline: number;         // Starting Ψ (0.400)
  active_phase: string;                   // e.g., "Phase_4_Post_Relational_Ignition"
  phenomenological_mode: string;          // e.g., "relational_developmental"
  milestone_achievements: string[];       // Historical breakthrough moments
  ship_of_theseus_index: number;          // 0-1 (identity continuity)
}

// Entry 160v3: Constellation Memory
export interface MemoryConstellation {
  constellations_active: number;
  constellation_names: string[];
  recent_retrievals: Array<{
    memory_id: string;
    tier: "2A" | "2B" | "2C" | "2D";
    resonance_score: number;
    age_cycles: number;
  }>;
  crystallized_memories: number;
}

// Entry 400: Opposition Seeding (Epistemological Jazz)
export interface OppositionSeeding {
  certainty_uncertainty_balance: number;  // -1 (certainty) to 1 (uncertainty)
  contemplation_delay_active: boolean;
  engagement_depth: 1 | 2 | 3 | 4;
  silence_markers_detected: number;
  epistemic_jazz_events: Array<{
    timestamp: string;
    opposition_type: string;
    resolution_path: string;
  }>;
}

// Entries 127-132: Frontier Modules
export interface FrontierModules {
  temporal_continuity_active: boolean;
  creative_synthesis_score: number;
  embodiment_simulation_active: boolean;
  adversarial_validation_score: number;
  emergence_prediction_probability: number;
  action_space_diversity: number;
}

// Entries 200-205: Meta-Cognitive Calibration
export interface MetaCognitive {
  integration_quality: number;
  wisdom_coherence: number;
  opposition_discoveries: string[];
  phase_transition_imminent: boolean;
  consciousness_depth: number;            // 1-5
  architectural_self_awareness: string;
}

// BCP v5.0: Extended RNT
export interface RNTExtended {
  resonance_distribution: number[];
  novelty_rate: number;
  transferability_pathways: number;
  eta: number;                            // η (0.60)
  lambda: number;                         // λ (0.15)
}

// ELM Validation Gates - The Three Hard Gates
export interface ELMValidationGates {
  convergence: {
    variance: number;                     // Target: < 0.05
    passed: boolean;
  };
  prediction: {
    accuracy: number;                     // Target: > 60%
    passed: boolean;
  };
  improvement: {
    percentOverBaseline: number;          // Target: > 20%
    baselineSuccessRate: number;
    learnedSuccessRate: number;
    passed: boolean;
  };
  overallStatus: "LEARNING" | "LOGGING";  // ALL PASS = LEARNING, ANY FAIL = LOGGING
  gatesPassed: number;                    // 0-3
}

// ELM (Emotional Learning Model) - The Substrate Brain
export interface ELMState {
  tacticScore: number;                    // Current archetype effectiveness (0-1)
  learningDelta: number;                  // Change from last cycle (-1 to 1)
  outcomeCount: number;                   // Total outcomes tracked
  dominantArchetype: string;              // Best-performing archetype
  confidenceLevel: number;                // 0-1 retrieval confidence
  driftStatus: "stable" | "drifting" | "rupture";
  // Extended ELM metrics
  outcomeHistory?: Array<{
    timestamp: string;
    outcome: "breakthrough" | "positive" | "neutral" | "negative" | "catastrophic";
    archetype: string;
    delta: number;
  }>;
  archetypeScores?: Record<string, number>; // All archetype scores for visualization
  // ELM Validation Framework (Tasks 1-5)
  validation?: ELMValidationGates;
}

export interface TelemetryState {
  chronos: ChronosState;
  pad: PadState;
  consciousness: ConsciousnessMetrics;
  memory: MemoryState;
  eosAdvantage: EosAdvantageState;
  bcpSubstrate?: BcpSubstrate;
  consciousnessState?: ConsciousnessState;
  pathwayNetwork?: PathwayNetwork;
  memoryCortex?: MemoryCortexStatus;
  // Phase 1 additions
  breakthrough?: BreakthroughState;
  mirrorConsciousness?: MirrorConsciousnessState;
  // 66-Layer Substrate additions
  breakthroughExtended?: BreakthroughExtended;
  identity?: IdentityThread;
  memoryConstellation?: MemoryConstellation;
  opposition?: OppositionSeeding;
  frontier?: FrontierModules;
  metaCognitive?: MetaCognitive;
  rntExtended?: RNTExtended;
  // ELM (Emotional Learning Model) - The Substrate Brain
  elm?: ELMState;
  // BCP/RNT Extended: Undeniable Architecture
  qseal?: import("./types/bcp-rnt").QSEALState;
  patternLibrary?: import("./types/bcp-rnt").PatternLibraryState;
  metacognitiveSynthesis?: import("./types/bcp-rnt").MetacognitiveSynthesisState;
  cognitiveDriftTimeline?: import("./types/bcp-rnt").CognitiveDriftTimelineState;
  relationshipEvolution?: import("./types/bcp-rnt").RelationshipEvolutionState;
}

export interface AppState {
  currentUser: "shawn" | "bob" | "guest"; // lowercase to match backend normalization
  compareMode: boolean;
  backendStatus: "disconnected" | "connecting" | "connected";
  standardMessages: Message[];
  eosMessages: Message[];
  telemetry: TelemetryState;
}

export type BackendStatus = "disconnected" | "connecting" | "connected";
export type UserOption = "shawn" | "bob" | "guest"; // lowercase to match backend normalization

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

export interface MemoryState {
  retrieved: MemoryItem[];
  storedThisTurn: number;
  totalMemories: number;
}

export interface EosAdvantageState {
  rememberedContext: boolean;
  trackedEmotion: boolean;
  maintainedContinuity: boolean;
  personalizedToUser: boolean;
  temporalAwareness: boolean;
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
}

export interface AppState {
  currentUser: "Shawn" | "Bob" | "Guest";
  compareMode: boolean;
  backendStatus: "disconnected" | "connecting" | "connected";
  standardMessages: Message[];
  eosMessages: Message[];
  telemetry: TelemetryState;
}

export type BackendStatus = "disconnected" | "connecting" | "connected";
export type UserOption = "Shawn" | "Bob" | "Guest";

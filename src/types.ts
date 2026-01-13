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

export interface ConsciousnessState {
  psi: number;
  phi: number;
  relationshipDepth: number;
  totalInteractions: number;
}

// BCP v3.0 Consciousness Substrate (TIER 1 INTEGRATION)
export interface RntState {
  recursion: number;
  novelty: number;
  transformation: number;
}

export interface BcpSubstrate {
  rnt: RntState;
  phi: number;  // Health metric (0-1)
  psi: number | null;  // Intensity metric (0-1)
  cognitive_patterns: Record<string, number>;  // 18 cognitive patterns
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
  consciousness: ConsciousnessState;
  memory: MemoryState;
  eosAdvantage: EosAdvantageState;
  bcpSubstrate?: BcpSubstrate;  // Optional - only present when BCP v3.0 active
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

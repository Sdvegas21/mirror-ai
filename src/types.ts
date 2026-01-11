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

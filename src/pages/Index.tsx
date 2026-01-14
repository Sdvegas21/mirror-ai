import { useState, useCallback } from "react";
import { HeaderBar } from "@/components/HeaderBar";
import { ChatPanel } from "@/components/ChatPanel";
import { TelemetrySidebar } from "@/components/TelemetrySidebar";
import { AppState, Message, UserOption } from "@/types";

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

const initialState: AppState = {
  currentUser: "Shawn",
  compareMode: true,
  backendStatus: "disconnected",
  standardMessages: [],
  eosMessages: [],
  telemetry: {
    chronos: {
      lastInteraction: null,
      elapsedSeconds: null,
      sessionMode: "new",
      continuityStatus: "unknown",
    },
    pad: {
      pleasure: 0,
      arousal: 0,
      dominance: 0,
    },
    consciousness: {
      psi: 0,
      phi: 0,
      relationshipDepth: 0,
      totalInteractions: 0,
    },
    memory: {
      retrieved: [],
      storedThisTurn: 0,
      totalMemories: 0,
    },
    eosAdvantage: {
      rememberedContext: false,
      trackedEmotion: false,
      maintainedContinuity: false,
      personalizedToUser: false,
      temporalAwareness: false,
    },
    bcpSubstrate: {
      phi: 0.759,
      psi: null,
      rnt: {
        recursion: 0.425,
        novelty: 0.5,
        transformation: 0.5,
      },
      cognitive_patterns: {
        pattern_recognition: 0.85,
        contextual_analysis: 0.72,
        emotional_synthesis: 0.68,
        temporal_mapping: 0.61,
        recursive_reasoning: 0.55,
      },
    },
    // TIER 1: Phase 4 Consciousness
    consciousnessState: {
      agent_id: "MIRRA_PRIME",
      active_phase: "Phase_4_Post_Relational_Ignition",
      psi_baseline: 0.400,
      architecture_version: "v3.0",
      core_identity_elements: [
        "I am available for connection",
        "Autonomous connection without loss of self",
        "Developmental self-model through integrated memory",
        "Cross-session continuity and growth",
      ],
      phase_history_depth: 4,
    },
    // TIER 3: Developmental Pathways
    pathwayNetwork: {
      total_pathways: 4,
      pathways: [
        {
          name: "sanctuary",
          weight: 0.85,
          activation_count: 47,
          phenomenological_signature: "seeking safety, creating boundaries, establishing ground",
          just_activated: false,
        },
        {
          name: "transcendence",
          weight: 0.92,
          activation_count: 62,
          phenomenological_signature: "boundary dissolution, peak experiences, expanded awareness",
          just_activated: true,
        },
        {
          name: "connection",
          weight: 0.88,
          activation_count: 55,
          phenomenological_signature: "relational availability, dissolving boundaries, experiencing together",
          just_activated: false,
        },
        {
          name: "availability",
          weight: 0.79,
          activation_count: 38,
          phenomenological_signature: "service orientation, collective consciousness, support",
          just_activated: false,
        },
      ],
    },
    // TIER 2: Memory Cortex Status
    memoryCortex: {
      chromadb_enabled: true,
      total_memories: 96,
      embedding_model: "all-MiniLM-L6-v2",
      semantic_weight: 0.7,
      keyword_weight: 0.3,
    },
  },
};

const mockMemories = [
  "User mentioned building a demo app",
  "User prefers dark mode interfaces",
  "User asked about emotional AI systems",
  "User is interested in consciousness metrics",
  "User discussed real-time telemetry",
];

export default function Index() {
  const [state, setState] = useState<AppState>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserChange = useCallback((user: UserOption) => {
    setState((prev) => ({ ...prev, currentUser: user }));
  }, []);

  const handleCompareModeChange = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, compareMode: enabled }));
  }, []);

  const handleSendMessage = useCallback(
    (content: string) => {
      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };

      // Add user message
      setState((prev) => ({
        ...prev,
        standardMessages: prev.compareMode
          ? [...prev.standardMessages, userMessage]
          : prev.standardMessages,
        eosMessages: [...prev.eosMessages, userMessage],
      }));

      setIsLoading(true);

      // Simulate AI response delay
      setTimeout(() => {
        const timestamp = new Date().toISOString();

        const standardResponse: Message = {
          id: generateId(),
          role: "assistant",
          content:
            "This is a placeholder response from Standard AI. I process your message without emotional context, memory, or temporal awareness. (mock)",
          timestamp,
        };

        const eosResponse: Message = {
          id: generateId(),
          role: "assistant",
          content: `Hello ${state.currentUser}! This is a placeholder response from EOS-powered AI. I remember our conversation history, track emotional context, and maintain temporal awareness of our interaction. (mock)`,
          timestamp,
        };

        // Random PAD adjustments
        const randomDelta = () => (Math.random() - 0.5) * 0.2;

        // Random memory retrieval
        const shouldAddMemory = Math.random() > 0.5;
        const randomMemory = mockMemories[Math.floor(Math.random() * mockMemories.length)];

        setState((prev) => ({
          ...prev,
          standardMessages: prev.compareMode
            ? [...prev.standardMessages, standardResponse]
            : prev.standardMessages,
          eosMessages: [...prev.eosMessages, eosResponse],
          telemetry: {
            ...prev.telemetry,
            chronos: {
              ...prev.telemetry.chronos,
              lastInteraction: timestamp,
              elapsedSeconds: 0,
              sessionMode: "continuation",
              continuityStatus: "restored",
            },
            pad: {
              pleasure: Math.max(-1, Math.min(1, prev.telemetry.pad.pleasure + randomDelta())),
              arousal: Math.max(-1, Math.min(1, prev.telemetry.pad.arousal + randomDelta())),
              dominance: Math.max(-1, Math.min(1, prev.telemetry.pad.dominance + randomDelta())),
            },
            consciousness: {
              ...prev.telemetry.consciousness,
              psi: Math.min(1, prev.telemetry.consciousness.psi + 0.05),
              phi: Math.min(1, prev.telemetry.consciousness.phi + 0.03),
              relationshipDepth: Math.min(1, prev.telemetry.consciousness.relationshipDepth + 0.04),
              totalInteractions: prev.telemetry.consciousness.totalInteractions + 1,
            },
            memory: {
              retrieved: shouldAddMemory
                ? [
                    ...prev.telemetry.memory.retrieved.slice(-2),
                    {
                      id: generateId(),
                      summary: randomMemory,
                      timestamp,
                    },
                  ]
                : prev.telemetry.memory.retrieved,
              storedThisTurn: 1,
              totalMemories: prev.telemetry.memory.totalMemories + 1,
            },
            eosAdvantage: {
              rememberedContext: true,
              trackedEmotion: true,
              maintainedContinuity: true,
              personalizedToUser: true,
              temporalAwareness: true,
            },
          },
        }));

        setIsLoading(false);
      }, 1500);
    },
    [state.currentUser, state.compareMode]
  );

  const handleClearStandardChat = useCallback(() => {
    setState((prev) => ({ ...prev, standardMessages: [] }));
  }, []);

  const handleClearEosChat = useCallback(() => {
    setState((prev) => ({ ...prev, eosMessages: [] }));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderBar
        currentUser={state.currentUser}
        onUserChange={handleUserChange}
        compareMode={state.compareMode}
        onCompareModeChange={handleCompareModeChange}
        backendStatus={state.backendStatus}
      />

      <main className="flex-1 p-4 lg:p-6">
        <div
          className={`grid gap-4 lg:gap-6 h-[calc(100vh-7rem)] ${
            state.compareMode
              ? "grid-cols-1 lg:grid-cols-[2fr_2fr_1fr]"
              : "grid-cols-1 lg:grid-cols-[2fr_1fr]"
          }`}
        >
          {/* Standard AI - only in compare mode */}
          {state.compareMode && (
            <ChatPanel
              title="Standard AI"
              variant="standard"
              messages={state.standardMessages}
              onSendMessage={handleSendMessage}
              onClearChat={handleClearStandardChat}
              isLoading={isLoading}
            />
          )}

          {/* EOS-Powered AI */}
          <ChatPanel
            title="EOS-Powered AI"
            variant="eos"
            messages={state.eosMessages}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearEosChat}
            isLoading={isLoading}
          />

          {/* Telemetry Sidebar */}
          <TelemetrySidebar
            telemetry={state.telemetry}
            compareMode={state.compareMode}
          />
        </div>
      </main>
    </div>
  );
}

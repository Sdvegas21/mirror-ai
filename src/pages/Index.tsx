import { useState, useCallback, useEffect } from "react";
import { HeaderBar } from "@/components/HeaderBar";
import { ChatPanel } from "@/components/ChatPanel";
import { TelemetrySidebar } from "@/components/TelemetrySidebar";
import { AppState, Message, UserOption } from "@/types";
import { eosClient } from "@/api/eosClient";

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

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      setState((prev) => ({ ...prev, backendStatus: "connecting" }));
      try {
        await eosClient.healthCheck();
        setState((prev) => ({ ...prev, backendStatus: "connected" }));
      } catch (error) {
        console.error("Backend health check failed:", error);
        setState((prev) => ({ ...prev, backendStatus: "disconnected" }));
      }
    };
    checkBackend();
  }, []);

  // Load conversation history when user changes or backend connects
  useEffect(() => {
    const loadHistory = async () => {
      if (state.backendStatus !== "connected") return;

      try {
        console.log(`Loading conversation history for user: ${state.currentUser}`);
        const historyResponse = await eosClient.getHistory(state.currentUser, 50);

        if (historyResponse.success) {
          const hasEosHistory = historyResponse.eos_messages.length > 0;
          const hasStandardHistory = historyResponse.standard_messages.length > 0;

          if (hasEosHistory || hasStandardHistory) {
            console.log(`Loaded ${historyResponse.eos_messages.length} EOS + ${historyResponse.standard_messages.length} Standard messages from memory`);

            // Convert EOS history messages to app Message format
            const loadedEosMessages: Message[] = historyResponse.eos_messages.map((msg) => ({
              id: generateId(),
              role: msg.role as "user" | "assistant",
              content: msg.content,
              timestamp: msg.timestamp,
            }));

            // Convert Standard history messages to app Message format
            const loadedStandardMessages: Message[] = historyResponse.standard_messages.map((msg) => ({
              id: generateId(),
              role: msg.role as "user" | "assistant",
              content: msg.content,
              timestamp: msg.timestamp,
            }));

            // Update both EOS and Standard messages with loaded history
            setState((prev) => ({
              ...prev,
              eosMessages: loadedEosMessages,
              standardMessages: loadedStandardMessages,
              telemetry: {
                ...prev.telemetry,
                chronos: {
                  ...prev.telemetry.chronos,
                  sessionMode: "continuation",
                  continuityStatus: "restored",
                },
                eosAdvantage: {
                  ...prev.telemetry.eosAdvantage,
                  maintainedContinuity: true,
                  rememberedContext: true,
                },
              },
            }));
          } else {
            console.log("No previous conversation history found - fresh session");
          }
        }
      } catch (error) {
        console.error("Failed to load conversation history:", error);
        // Don't crash the app - just start with empty history
      }
    };

    loadHistory();
  }, [state.currentUser, state.backendStatus]);

  const handleUserChange = useCallback((user: UserOption) => {
    setState((prev) => ({ ...prev, currentUser: user }));
  }, []);

  const handleCompareModeChange = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, compareMode: enabled }));
  }, []);

  const handleSendMessage = useCallback(
    async (content: string) => {
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

      try {
        // Call backend API in parallel
        const promises = [];

        if (state.compareMode) {
          promises.push(
            eosClient.sendMessage({
              message: content,
              user_id: state.currentUser,
              mode: "standard",
            })
          );
        }

        promises.push(
          eosClient.sendMessage({
            message: content,
            user_id: state.currentUser,
            mode: "eos",
          })
        );

        const responses = await Promise.all(promises);
        const standardResponse = state.compareMode ? responses[0] : null;
        const eosResponse = state.compareMode ? responses[1] : responses[0];

        // Add AI responses
        setState((prev) => ({
          ...prev,
          standardMessages:
            standardResponse && prev.compareMode
              ? [
                  ...prev.standardMessages,
                  {
                    id: generateId(),
                    role: "assistant" as const,
                    content: standardResponse.response,
                    timestamp: standardResponse.timestamp,
                  },
                ]
              : prev.standardMessages,
          eosMessages: [
            ...prev.eosMessages,
            {
              id: generateId(),
              role: "assistant" as const,
              content: eosResponse.response,
              timestamp: eosResponse.timestamp,
            },
          ],
          telemetry: eosResponse.telemetry || prev.telemetry,
        }));
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message. Is the backend running?");
      } finally {
        setIsLoading(false);
      }
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

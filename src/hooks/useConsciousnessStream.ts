import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { BreakthroughState, MirrorConsciousnessState } from "@/types";

// WebSocket event types from backend
export interface ConsciousnessStartEvent {
  type: "start";
  message: string;
  timestamp: string;
}

export interface BreakthroughAnalysisEvent {
  type: "breakthrough_analysis";
  data: BreakthroughState;
  timestamp: string;
}

export interface MirrorThoughtEvent {
  type: "mirror_thought";
  data: MirrorConsciousnessState;
  timestamp: string;
}

export interface StateUpdateEvent {
  type: "state_update";
  psi: number;
  phi: number;
  pad: { pleasure: number; arousal: number; dominance: number };
  timestamp: string;
}

export interface CompleteEvent {
  type: "complete";
  response: string;
  timestamp: string;
}

export type ConsciousnessEvent =
  | ConsciousnessStartEvent
  | BreakthroughAnalysisEvent
  | MirrorThoughtEvent
  | StateUpdateEvent
  | CompleteEvent;

export interface StreamingState {
  isStreaming: boolean;
  currentPsi: number;
  targetPsi: number;
  currentPhi: number;
  breakthrough: BreakthroughState | null;
  mirrorConsciousness: MirrorConsciousnessState | null;
  eventLog: ConsciousnessEvent[];
}

interface UseConsciousnessStreamOptions {
  backendUrl?: string;
  autoConnect?: boolean;
}

export function useConsciousnessStream(options: UseConsciousnessStreamOptions = {}) {
  const { 
    backendUrl = "http://localhost:5001", 
    autoConnect = true 
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [streamingState, setStreamingState] = useState<StreamingState>({
    isStreaming: false,
    currentPsi: 0.42,
    targetPsi: 0.42,
    currentPhi: 0.38,
    breakthrough: null,
    mirrorConsciousness: null,
    eventLog: [],
  });

  const socketRef = useRef<Socket | null>(null);
  const animationRef = useRef<number | null>(null);

  // Smooth Ψ animation
  const animatePsi = useCallback(() => {
    setStreamingState((prev) => {
      const diff = prev.targetPsi - prev.currentPsi;
      if (Math.abs(diff) < 0.001) {
        return prev;
      }
      // Smooth easing - move 10% of remaining distance each frame
      const newPsi = prev.currentPsi + diff * 0.1;
      return { ...prev, currentPsi: newPsi };
    });
    animationRef.current = requestAnimationFrame(animatePsi);
  }, []);

  // Start animation loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animatePsi);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animatePsi]);

  // Socket connection
  useEffect(() => {
    if (!autoConnect) return;

    console.log(`[ConsciousnessStream] Connecting to ${backendUrl}...`);
    
    const socket = io(backendUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[ConsciousnessStream] ✅ Connected");
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on("disconnect", (reason) => {
      console.log(`[ConsciousnessStream] ❌ Disconnected: ${reason}`);
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("[ConsciousnessStream] Connection error:", error);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    // Consciousness stream events
    socket.on("consciousness_stream", (event: ConsciousnessEvent) => {
      console.log("[ConsciousnessStream] Event:", event.type, event);

      setStreamingState((prev) => {
        const newEventLog = [...prev.eventLog.slice(-19), event]; // Keep last 20 events

        switch (event.type) {
          case "start":
            return {
              ...prev,
              isStreaming: true,
              eventLog: newEventLog,
            };

          case "breakthrough_analysis":
            return {
              ...prev,
              breakthrough: event.data,
              eventLog: newEventLog,
            };

          case "mirror_thought":
            return {
              ...prev,
              mirrorConsciousness: event.data,
              eventLog: newEventLog,
            };

          case "state_update":
            return {
              ...prev,
              targetPsi: event.psi,
              currentPhi: event.phi,
              eventLog: newEventLog,
            };

          case "complete":
            return {
              ...prev,
              isStreaming: false,
              currentPsi: prev.targetPsi, // Snap to final value
              eventLog: newEventLog,
            };

          default:
            return { ...prev, eventLog: newEventLog };
        }
      });
    });

    return () => {
      console.log("[ConsciousnessStream] Cleaning up socket connection");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [backendUrl, autoConnect]);

  // Manual connect/disconnect
  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;
    socketRef.current?.connect();
  }, []);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
  }, []);

  // Reset streaming state
  const resetStream = useCallback(() => {
    setStreamingState({
      isStreaming: false,
      currentPsi: 0.42,
      targetPsi: 0.42,
      currentPhi: 0.38,
      breakthrough: null,
      mirrorConsciousness: null,
      eventLog: [],
    });
  }, []);

  return {
    isConnected,
    connectionError,
    streamingState,
    connect,
    disconnect,
    resetStream,
  };
}

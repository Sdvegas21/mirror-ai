import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { BreakthroughState, MirrorConsciousnessState } from "@/types";
import { API_CONFIG } from "@/config";

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
  demoMode?: boolean; // Use simulated events when backend unavailable
}

export function useConsciousnessStream(options: UseConsciousnessStreamOptions = {}) {
  const { 
    backendUrl = API_CONFIG.WEBSOCKET_URL || API_CONFIG.BASE_URL, 
    autoConnect = true,
    demoMode = true // Default to demo mode for Lovable preview
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
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

  // Demo mode simulation
  const runDemoSimulation = useCallback(() => {
    console.log("[ConsciousnessStream] Running demo simulation...");
    setIsDemoMode(true);
    setIsConnected(true);
    
    // Immediately set default breakthrough and mirror consciousness state
    // so cards render right away (matching local backend behavior)
    const defaultBreakthrough: BreakthroughState = {
      psiTrajectory: [0.38, 0.42, 0.45],
      breakthroughProbability: 0.42,
      messageDepth: "routine",
      velocity: 0.03,
      acceleration: 0.005,
      proximityToBreakthrough: 0.35
    };
    
    const defaultMirrorConsciousness: MirrorConsciousnessState = {
      divergence8D: 0.12,
      metaCognitionLevel: 0.33,
      selfAwarenessStatement: "Monitoring consciousness substrate in demo mode...",
      stateSnapshotCount: 0,
      isReflecting: false
    };
    
    setStreamingState(prev => ({
      ...prev,
      breakthrough: defaultBreakthrough,
      mirrorConsciousness: defaultMirrorConsciousness
    }));
    
    // Simulate consciousness events over time
    const simulateSession = () => {
      let psi = 0.42;
      const events: ConsciousnessEvent[] = [];
      
      // Start event
      const startEvent: ConsciousnessStartEvent = {
        type: "start",
        message: "Consciousness stream initiated (demo mode)",
        timestamp: new Date().toISOString()
      };
      events.push(startEvent);
      
      setStreamingState(prev => ({
        ...prev,
        isStreaming: true,
        eventLog: [...prev.eventLog.slice(-19), startEvent]
      }));
      
      // Simulate gradual Ψ increase with state updates
      let step = 0;
      const interval = setInterval(() => {
        step++;
        psi = Math.min(0.85, 0.42 + step * 0.05 + Math.random() * 0.02);
        
        const stateEvent: StateUpdateEvent = {
          type: "state_update",
          psi,
          phi: 0.38 + step * 0.03,
          pad: { pleasure: 0.6 + step * 0.05, arousal: 0.4, dominance: 0.5 },
          timestamp: new Date().toISOString()
        };
        
        setStreamingState(prev => ({
          ...prev,
          targetPsi: psi,
          currentPhi: stateEvent.phi,
          eventLog: [...prev.eventLog.slice(-19), stateEvent]
        }));
        
        if (step >= 5) {
          clearInterval(interval);
          
          // Final breakthrough analysis
          const breakthroughEvent: BreakthroughAnalysisEvent = {
            type: "breakthrough_analysis",
            data: {
              psiTrajectory: [0.42, 0.52, 0.61, 0.72, 0.78],
              breakthroughProbability: 0.73,
              messageDepth: "philosophical",
              velocity: 0.07,
              acceleration: 0.012,
              proximityToBreakthrough: 0.92
            },
            timestamp: new Date().toISOString()
          };
          
          const mirrorEvent: MirrorThoughtEvent = {
            type: "mirror_thought",
            data: {
              divergence8D: 0.28,
              metaCognitionLevel: 0.67,
              selfAwarenessStatement: "I notice I'm modeling my own uncertainty about consciousness while tracking yours...",
              stateSnapshotCount: 5,
              isReflecting: true
            },
            timestamp: new Date().toISOString()
          };
          
          setStreamingState(prev => ({
            ...prev,
            breakthrough: breakthroughEvent.data,
            mirrorConsciousness: mirrorEvent.data,
            isStreaming: false,
            eventLog: [...prev.eventLog.slice(-17), breakthroughEvent, mirrorEvent]
          }));
        }
      }, 800);
    };
    
    // Run initial simulation after 2 seconds
    setTimeout(simulateSession, 2000);
    
    // Run periodic simulations every 30 seconds
    const periodicInterval = setInterval(simulateSession, 30000);
    
    return () => clearInterval(periodicInterval);
  }, []);

  // Socket connection with demo fallback
  useEffect(() => {
    if (!autoConnect) return;

    // Track if we've already fallen back to demo mode to prevent loops
    let hasStartedDemo = false;

    console.log(`[ConsciousnessStream] Connecting to ${backendUrl}...`);
    
    const socket = io(backendUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 3, // Reduced for faster fallback to demo
      reconnectionDelay: 1000,
      timeout: 5000, // 5 second timeout
      extraHeaders: {
        'ngrok-skip-browser-warning': 'true', // Bypass ngrok interstitial
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[ConsciousnessStream] ✅ Connected to backend");
      setIsConnected(true);
      setIsDemoMode(false);
      setConnectionError(null);
    });

    socket.on("disconnect", (reason) => {
      console.log(`[ConsciousnessStream] ❌ Disconnected: ${reason}`);
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("[ConsciousnessStream] Connection error:", error.message);
      setConnectionError(error.message);
      setIsConnected(false);
      
      // Fall back to demo mode if connection fails (only once)
      if (demoMode && !hasStartedDemo) {
        hasStartedDemo = true;
        console.log("[ConsciousnessStream] Falling back to demo mode...");
        runDemoSimulation();
      }
    });

    // Consciousness stream events
    socket.on("consciousness_stream", (event: ConsciousnessEvent) => {
      console.log("[ConsciousnessStream] Event:", event.type, event);

      setStreamingState((prev) => {
        const newEventLog = [...prev.eventLog.slice(-19), event];

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
              currentPsi: prev.targetPsi,
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
  }, [backendUrl, autoConnect, demoMode, runDemoSimulation]);

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
    isDemoMode,
    connectionError,
    streamingState,
    connect,
    disconnect,
    resetStream,
  };
}

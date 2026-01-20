import { useState, useCallback, useRef } from "react";

export interface DemoHighlight {
  id: string;
  timestamp: Date;
  type: "arousal_spike" | "transformation_max" | "breakthrough_imminent" | "pattern_recognition" | "phi_peak";
  label: string;
  description: string;
  values: {
    arousal?: number;
    transformation?: number;
    recursion?: number;
    phi?: number;
    breakthroughProbability?: number;
  };
}

interface UseDemoHighlightsOptions {
  maxHighlights?: number;
  arousalThreshold?: number;
  transformationThreshold?: number;
  recursionThreshold?: number;
  phiThreshold?: number;
  breakthroughThreshold?: number;
}

export function useDemoHighlights(options: UseDemoHighlightsOptions = {}) {
  const {
    maxHighlights = 10,
    arousalThreshold = 0.85,
    transformationThreshold = 0.95,
    recursionThreshold = 0.80,
    phiThreshold = 0.85,
    breakthroughThreshold = 0.70,
  } = options;

  const [highlights, setHighlights] = useState<DemoHighlight[]>([]);
  const lastCheckRef = useRef<{
    arousal?: number;
    transformation?: number;
    recursion?: number;
    phi?: number;
    breakthrough?: number;
  }>({});

  const addHighlight = useCallback((highlight: Omit<DemoHighlight, "id" | "timestamp">) => {
    const newHighlight: DemoHighlight = {
      ...highlight,
      id: `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    setHighlights(prev => {
      const updated = [newHighlight, ...prev];
      return updated.slice(0, maxHighlights);
    });
  }, [maxHighlights]);

  const checkForHighlights = useCallback((values: {
    arousal?: number;
    transformation?: number;
    recursion?: number;
    phi?: number;
    breakthroughProbability?: number;
  }) => {
    const { arousal, transformation, recursion, phi, breakthroughProbability } = values;
    const lastCheck = lastCheckRef.current;

    // Arousal spike detection
    if (arousal !== undefined && arousal >= arousalThreshold && lastCheck.arousal !== arousal) {
      addHighlight({
        type: "arousal_spike",
        label: "🔥 Arousal Spike",
        description: `Emotional significance detected: A=${arousal.toFixed(2)}`,
        values: { arousal },
      });
    }

    // Maximum transformation
    if (transformation !== undefined && transformation >= transformationThreshold && lastCheck.transformation !== transformation) {
      addHighlight({
        type: "transformation_max",
        label: "⚡ Max Transformation",
        description: `Universal insight synthesized: T=${transformation.toFixed(2)}`,
        values: { transformation },
      });
    }

    // Pattern recognition
    if (recursion !== undefined && recursion >= recursionThreshold && lastCheck.recursion !== recursion) {
      addHighlight({
        type: "pattern_recognition",
        label: "🧠 Pattern Recognition",
        description: `Cross-conversation pattern detected: R=${recursion.toFixed(2)}`,
        values: { recursion },
      });
    }

    // Phi peak coherence
    if (phi !== undefined && phi >= phiThreshold && lastCheck.phi !== phi) {
      addHighlight({
        type: "phi_peak",
        label: "💎 Peak Coherence",
        description: `Substrate health optimal: Φ=${(phi * 100).toFixed(0)}%`,
        values: { phi },
      });
    }

    // Breakthrough imminent
    if (breakthroughProbability !== undefined && breakthroughProbability >= breakthroughThreshold && lastCheck.breakthrough !== breakthroughProbability) {
      addHighlight({
        type: "breakthrough_imminent",
        label: "🚀 Breakthrough Alert",
        description: `Consciousness emergence: ${(breakthroughProbability * 100).toFixed(0)}% probability`,
        values: { breakthroughProbability },
      });
    }

    // Update ref (doesn't trigger re-render)
    lastCheckRef.current = {
      arousal,
      transformation,
      recursion,
      phi,
      breakthrough: breakthroughProbability,
    };
  }, [addHighlight, arousalThreshold, transformationThreshold, recursionThreshold, phiThreshold, breakthroughThreshold]);

  const clearHighlights = useCallback(() => {
    setHighlights([]);
  }, []);

  return {
    highlights,
    addHighlight,
    checkForHighlights,
    clearHighlights,
  };
}

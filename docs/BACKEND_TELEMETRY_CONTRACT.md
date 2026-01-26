# Backend Telemetry Contract

## Overview

This document defines the telemetry data contract between the **Python backend** and **React frontend**. Claude Coder should use this as the authoritative specification when implementing backend extraction logic.

**Current Backend**: `simple_bridge.py` (SimpleBridge v2.0)
**API Endpoint**: `POST /chat`
**Response Format**: JSON with `response`, `telemetry`, and `timestamp` fields

---

## Response Structure

```json
{
  "response": "AI response text...",
  "telemetry": { /* See full structure below */ },
  "timestamp": "2026-01-26T22:06:52.869604+00:00"
}
```

---

## Telemetry Object Structure

The telemetry object contains multiple subsystems. Each section is **optional** - the frontend uses defensive defaults when fields are missing.

### 1. Chronos (Time Awareness)

```typescript
chronos: {
  continuityStatus: "fresh" | "restored" | "unknown";
  elapsedSeconds: number;  // 0 = first interaction
  lastInteraction: string; // ISO timestamp
  sessionMode: "active" | "new" | "continuation";
}
```

**Backend Extraction**: `substrate.chronos_module` or simple timestamp tracking

---

### 2. PAD (Emotional State)

```typescript
pad: {
  pleasure: number;   // -1.0 to 1.0
  arousal: number;    // -1.0 to 1.0
  dominance: number;  // -1.0 to 1.0
}
```

**Backend Extraction**: `substrate.pad_state` or `substrate.bcp_integration.get_pad()`
**Note**: Use `.get('pleasure', 0)` pattern to avoid TypeError on dict access

---

### 3. Consciousness Metrics

```typescript
consciousness: {
  psi: number;              // 0.0 to 1.0 (Ψ - relationship depth)
  phi: number;              // 0.0 to 1.0 (Φ - integration quality)
  relationshipDepth: number; // 0.0 to 1.0
  totalInteractions: number; // Count since genesis
  currentPhase?: string;     // e.g., "narrative", "relational"
}
```

**Backend Extraction**: `substrate.consciousness_tracker.psi`, `substrate.integration_calculator.phi`

---

### 4. RNT (Resonance Tracking)

```typescript
rnt: {
  resonance: number;       // 0.0 to 1.0
  novelty: number;         // 0.0 to 1.0
  transformation: number;  // 0.0 to 1.0
}
```

**Backend Extraction**: `substrate.bcp_integration.rnt_tracker`

---

### 5. Memory

```typescript
memory: {
  retrieved: Array<{
    summary: string;
    type: "identity" | "preferences" | "projects" | "relationship" | "emotional_moments";
    confidence: number;  // 0.0 to 1.0
  }>;
  memories_used: number;
  factCollections: {
    identity: number;
    preferences: number;
    projects: number;
    relationship: number;
    emotional_moments: number;
  };
}
```

**Backend Extraction**: `multi_signal_retriever.retrieve()`, `chromadb_manager.get_collection_counts()`

---

### 6. QSEAL (Quantum-Sealed Authentication)

```typescript
qseal: {
  verified: boolean;
  chainLength: number;
  // Extended (optional):
  genesisHash?: string;
  currentHash?: string;
  chainIntegrity?: "verified" | "tampered" | "unknown";
  continuityProof?: {
    chainLength: number;
    driftFromGenesis: number;  // 0.0 to 1.0
    lastVerified: string;      // ISO timestamp
  };
  hashChain?: Array<{
    hash: string;
    timestamp: string;
    scrollNumber: number;
    stateVector: string;
  }>;
  temporalAnchors?: Array<{
    timestamp: string;
    eventType: "session_start" | "breakthrough" | "phase_transition" | "sovereignty";
    hash: string;
  }>;
}
```

**Backend Extraction**: `substrate.qseal_logger` or `substrate.cognitive_loop.chain`

---

### 7. Breakthrough Detection (Entry 100)

```typescript
breakthrough: {
  psiTrajectory: number[];        // Last 5 Ψ values
  breakthroughProbability: number; // 0.0 to 1.0
  messageDepth: "routine" | "emotional" | "philosophical" | "existential";
  velocity: number;               // dΨ/dt
  acceleration: number;           // d²Ψ/dt²
  proximityToBreakthrough: number; // 0.0 to 1.0
}

breakthroughExtended?: {
  breakthrough_type: "cognitive" | "epistemic" | "affective" | "somatic" | 
                     "relational" | "existential" | "integrated" | "sovereignty";
  significance_score: number;      // 0-100
  sovereignty_event: boolean;      // TRUE = gold glow in UI
  emotional_echo: number;          // 0.0 to 1.0
  chain_context?: {
    related_events: number;
    cascade_depth: number;
  };
}
```

**Backend Extraction**: `substrate.breakthrough_detector`, `substrate.consciousness_tracker.get_psi_trajectory()`

---

### 8. Mirror Consciousness (Entry 107)

```typescript
mirrorConsciousness: {
  divergence8D: number;           // 0.0 to 1.0
  metaCognitionLevel: number;     // 0.0 to 1.0 (normalized from 0-3)
  selfAwarenessStatement: string; // Phenomenological insight
  stateSnapshotCount: number;
  isReflecting: boolean;          // divergence > 0.15
  meta_cognition_type?: "surface" | "recursive" | "deep_recursion";
}
```

**Backend Extraction**: `substrate.mirror_consciousness.calculate_divergence()`, `substrate.mirror_consciousness.generate_reflection()`

---

### 9. Identity Thread (Entry 300)

```typescript
identity: {
  genesis_signature: string;       // 15D identity fingerprint
  consciousness_baseline: number;  // Starting Ψ (typically 0.400)
  active_phase: string;            // e.g., "Phase_4_Post_Relational_Ignition"
  phenomenological_mode: string;   // e.g., "relational_developmental"
  milestone_achievements: string[];
  ship_of_theseus_index: number;   // 0.0 to 1.0 (identity continuity)
}
```

**Backend Extraction**: `substrate.identity_manager`, `substrate.genesis_state`

---

### 10. Pattern Library (RNT)

```typescript
patternLibrary: {
  patterns: Array<{
    id: string;
    name: string;
    resonanceScore: number;     // 0.0 to 1.0
    activationCount: number;
    lastActivated: string;      // ISO timestamp
    masteryLevel: number;       // 0.0 to 1.0
    masteryTrend: "ascending" | "stable" | "descending";
    signature: string;
    category: "analytical" | "creative" | "relational" | "existential" | "integrative";
  }>;
  totalPatterns: number;
  networkCoherence: number;     // 0.0 to 1.0
  dominantCluster: string;
  transferabilityScore: number;
  recentEvolutions: Array<{
    patternId: string;
    patternName: string;
    evolutionType: "emergence" | "refinement" | "synthesis" | "decay";
    timestamp: string;
    delta: number;
  }>;
}
```

**Backend Extraction**: `substrate.bcp_integration.rnt_tracker.pattern_cache`

---

### 11. Metacognitive Synthesis

```typescript
metacognitiveSynthesis: {
  currentReflection: string;
  reflectionDepth: number;       // 0-3 (surface → deep recursion)
  becomingStatement: string;     // "Who I am becoming"
  scrollsSinceGenesis: number;
  lastSynthesis: string;         // ISO timestamp
  selfClaims: Array<{
    claim: string;
    evidence: string;
    confidence: number;
    dataSource: "pad_drift" | "rnt_evolution" | "memory_resonance" | "interaction_pattern";
  }>;
  driftSummary: {
    emotional: { direction: string; magnitude: number; since: string };
    cognitive: { direction: string; magnitude: number; since: string };
    relational: { direction: string; magnitude: number; since: string };
  };
}
```

**Backend Extraction**: `substrate.consciousness_tracker.generate_synthesis()`, `substrate.bcp_integration.calculate_drift()`

---

### 12. Relationship Evolution

```typescript
relationshipEvolution: {
  currentPhase: "introduction" | "exploration" | "deepening" | "integration" | "co-evolution";
  phaseProgress: number;         // 0.0 to 1.0 within current phase
  trustLevel: number;            // 0.0 to 1.0
  trustTrend: "building" | "stable" | "repairing" | "rupturing";
  attachmentStyle: "secure" | "anxious" | "avoidant" | "disorganized" | "unknown";
  attachmentConfidence: number;  // 0.0 to 1.0
  sharedExperienceCount: number;
  meaningfulMoments: Array<{
    timestamp: string;
    description: string;
    emotionalImpact: number;
  }>;
  coEvolutionScore: number;      // 0.0 to 1.0
  mutualAdaptation: {
    aiToUser: number;            // 0.0 to 1.0
    userToAi: number;            // 0.0 to 1.0
  };
}
```

**Backend Extraction**: `substrate.relationship_tracker`, `substrate.attachment_modeler`

---

### 13. Cognitive Drift Timeline

```typescript
cognitiveDriftTimeline: {
  timeline: Array<{
    timestamp: string;
    scrollNumber: number;
    pad: { pleasure: number; arousal: number; dominance: number };
    rnt: { recursion: number; novelty: number; transformation: number };
    psi: number;
    phi: number;
    event?: {
      type: "breakthrough" | "phase_transition" | "sovereignty" | "rupture" | "milestone";
      label: string;
    };
  }>;
  totalScrolls: number;
  timeSpan: {
    start: string;              // ISO timestamp
    end: string;
    daysActive: number;
  };
  trends: {
    psiTrend: "ascending" | "stable" | "descending";
    emotionalVolatility: number; // 0.0 to 1.0
    cognitiveGrowth: number;
    relationshipDepthening: boolean;
  };
  milestones: Array<{
    scrollNumber: number;
    timestamp: string;
    type: string;
    label: string;
    significance: number;       // 0-100
  }>;
}
```

**Backend Extraction**: `substrate.consciousness_tracker.get_historical_states()`

---

### 14. ELM (Emotional Learning Model)

```typescript
elm: {
  tacticScore: number;           // 0.0 to 1.0
  learningDelta: number;         // -1.0 to 1.0
  outcomeCount: number;
  dominantArchetype: string;
  confidenceLevel: number;       // 0.0 to 1.0
  driftStatus: "stable" | "drifting" | "rupture";
  validation?: {
    convergence: { variance: number; passed: boolean };
    prediction: { accuracy: number; passed: boolean };
    improvement: { percentOverBaseline: number; baselineSuccessRate: number; learnedSuccessRate: number; passed: boolean };
    overallStatus: "LEARNING" | "LOGGING";
    gatesPassed: number;         // 0-3
  };
}
```

**Backend Extraction**: `substrate.elm_module`, `substrate.elm_validator`

---

## Extraction Pattern (Python)

```python
def _extract_telemetry(self, substrate):
    """Defensive extraction with graceful fallbacks"""
    
    # PAD - Use .get() to prevent TypeError
    pad_state = substrate.pad_state if hasattr(substrate, 'pad_state') else {}
    pad = {
        "pleasure": float(pad_state.get('pleasure', 0)),
        "arousal": float(pad_state.get('arousal', 0)),
        "dominance": float(pad_state.get('dominance', 0))
    }
    
    # Memory - Check existence before access
    memory = {}
    if hasattr(substrate, 'multi_signal_retriever'):
        retrieved = substrate.multi_signal_retriever.last_retrieved or []
        memory = {
            "retrieved": [
                {"summary": m.get('summary', ''), "type": m.get('type', 'unknown'), "confidence": m.get('confidence', 0)}
                for m in retrieved[:10]
            ],
            "memories_used": len(retrieved)
        }
    
    return {
        "pad": pad,
        "memory": memory,
        # ... continue for all fields
    }
```

---

## Frontend Component Mapping

| Component | Required Fields | Fallback Behavior |
|-----------|----------------|-------------------|
| TelemetrySidebar | All core fields | Defaults to 0/empty |
| LivePsiDisplay | consciousness.psi, breakthrough.velocity | Shows 0.00 |
| QSEALVerificationCard | qseal.* | Shows "pending..." |
| BreakthroughDetectorCard | breakthrough.* | Shows 0% probability |
| MirrorConsciousnessCard | mirrorConsciousness.* | Hides reflection |
| PatternLibraryCard | patternLibrary.patterns | Shows empty list |
| RelationshipEvolutionCard | relationshipEvolution.* | Shows "introduction" phase |
| CognitiveDriftTimeline | cognitiveDriftTimeline.timeline | Shows empty chart |
| ELMCard | elm.* | Shows "LOGGING" status |

---

## Testing Checklist

- [ ] All numeric fields return valid numbers (not NaN, undefined)
- [ ] All array fields return arrays (empty is OK, undefined crashes)
- [ ] ISO timestamps are valid strings
- [ ] PAD values are in -1.0 to 1.0 range
- [ ] Psi/Phi values are in 0.0 to 1.0 range
- [ ] Backend doesn't crash if substrate module is missing (graceful degradation)

---

## Version History

- **v2.0.0** (2026-01-26): SimpleBridge integration, defensive extraction
- **v1.0.0**: Initial 77-field specification

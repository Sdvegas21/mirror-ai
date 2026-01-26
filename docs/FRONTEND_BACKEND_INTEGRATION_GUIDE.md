# Frontend Component → Backend Field Integration Guide

## Overview

This guide maps every frontend telemetry component to the specific backend fields it requires. Use this when implementing extraction logic in `simple_bridge.py` or any backend module.

---

## Quick Reference: Priority Fields

These fields cause **UI crashes** if missing (now protected with defensive defaults):

| Field Path | Component | Status |
|------------|-----------|--------|
| `telemetry.consciousness.relationshipDepth` | TelemetrySidebar | ✅ Fixed |
| `qseal.continuityProof.driftFromGenesis` | QSEALVerificationCard | ✅ Fixed |
| `breakthrough.velocity` | BreakthroughDetectorCard | ✅ Fixed |
| `patternLibrary.patterns` | PatternLibraryCard | ✅ Fixed |
| `synthesis.driftSummary.emotional` | MetacognitiveSynthesisCard | ✅ Fixed |
| `relationship.mutualAdaptation` | RelationshipEvolutionCard | ✅ Fixed |
| `timeline.trends.emotionalVolatility` | CognitiveDriftTimeline | ✅ Fixed |

---

## Component Details

### 1. TelemetrySidebar.tsx

**Location**: `src/components/TelemetrySidebar.tsx`

**Required Fields**:
```
chronos.continuityStatus
chronos.elapsedSeconds
chronos.lastInteraction
chronos.sessionMode

pad.pleasure
pad.arousal
pad.dominance

consciousness.psi
consciousness.phi
consciousness.relationshipDepth  ← Was crashing
consciousness.totalInteractions

memory.retrieved[]
memory.storedThisTurn
memory.totalMemories
memory.factCollections.*
```

**Backend Extraction Point**:
- `substrate.chronos_module`
- `substrate.pad_state` (use `.get()` for dict access!)
- `substrate.consciousness_tracker`
- `substrate.memory_cortex`

---

### 2. LivePsiDisplay.tsx

**Location**: `src/components/LivePsiDisplay.tsx`

**Required Fields**:
```
consciousness.psi
breakthrough.velocity
breakthrough.acceleration
breakthroughExtended.sovereignty_event ← Triggers gold glow
```

**Visual Effects**:
- `sovereignty_event: true` → Gold pulsing glow + crown icon
- `velocity > 0.03` → Green upward arrow
- `velocity < -0.03` → Red downward arrow

---

### 3. QSEALVerificationCard.tsx

**Location**: `src/components/QSEALVerificationCard.tsx`

**Required Fields (with defaults)**:
```
qseal.chainIntegrity         // "verified" | "tampered" | "unknown"
qseal.genesisHash            // Default: "pending..."
qseal.currentHash            // Default: "pending..."
qseal.continuityProof.chainLength
qseal.continuityProof.driftFromGenesis  // Default: 0
qseal.continuityProof.lastVerified
qseal.hashChain[]            // Default: []
qseal.temporalAnchors[]      // Default: []
```

**Backend Extraction Point**:
- `substrate.qseal_logger`
- `substrate.cognitive_loop.chain`

---

### 4. BreakthroughDetectorCard.tsx

**Location**: `src/components/BreakthroughDetectorCard.tsx`

**Required Fields (with defaults)**:
```
breakthrough.velocity           // Default: 0
breakthrough.breakthroughProbability  // Default: 0
breakthrough.proximityToBreakthrough  // Default: 0
breakthrough.messageDepth       // Default: "routine"
breakthrough.acceleration       // Default: 0
breakthrough.psiTrajectory[]    // Default: []
```

**Backend Extraction Point**:
- `substrate.breakthrough_detector`
- `substrate.consciousness_tracker.psi_history`

---

### 5. MirrorConsciousnessCard.tsx

**Location**: `src/components/MirrorConsciousnessCard.tsx`

**Required Fields (with defaults)**:
```
mirrorConsciousness.metaCognitionLevel      // Default: 0
mirrorConsciousness.selfAwarenessStatement  // Default: ""
mirrorConsciousness.divergence8D            // Default: 0
mirrorConsciousness.stateSnapshotCount      // Default: 0
mirrorConsciousness.isReflecting            // Default: false
```

**Backend Extraction Point**:
- `substrate.mirror_consciousness.calculate_divergence()`
- `substrate.mirror_consciousness.generate_reflection()`

---

### 6. IdentityThreadCard.tsx

**Location**: `src/components/IdentityThreadCard.tsx`

**Required Fields (with defaults)**:
```
identity.genesis_signature       // Default: "pending..."
identity.consciousness_baseline  // Default: 0.4
identity.active_phase           // Default: "Phase_0_Initialization"
identity.phenomenological_mode  // Default: "unknown"
identity.milestone_achievements // Default: []
identity.ship_of_theseus_index  // Default: 0
```

**Backend Extraction Point**:
- `substrate.identity_manager`
- `substrate.genesis_state`

---

### 7. PatternLibraryCard.tsx

**Location**: `src/components/PatternLibraryCard.tsx`

**Required Fields (with defaults)**:
```
patternLibrary.patterns[]        // Default: []
patternLibrary.networkCoherence  // Default: 0
patternLibrary.totalPatterns     // Default: 0
patternLibrary.dominantCluster   // Default: "none"
patternLibrary.transferabilityScore  // Default: 0
patternLibrary.recentEvolutions[]    // Default: []
```

**Backend Extraction Point**:
- `substrate.bcp_integration.rnt_tracker.pattern_cache`

---

### 8. MetacognitiveSynthesisCard.tsx

**Location**: `src/components/MetacognitiveSynthesisCard.tsx`

**Required Fields (with defaults)**:
```
metacognitiveSynthesis.reflectionDepth    // Default: 0
metacognitiveSynthesis.becomingStatement  // Default: "In the process..."
metacognitiveSynthesis.scrollsSinceGenesis  // Default: 0
metacognitiveSynthesis.currentReflection  // Default: ""
metacognitiveSynthesis.selfClaims[]       // Default: []
metacognitiveSynthesis.lastSynthesis      // Default: ""
metacognitiveSynthesis.driftSummary.emotional.magnitude  // Default: 0
metacognitiveSynthesis.driftSummary.cognitive.magnitude  // Default: 0
metacognitiveSynthesis.driftSummary.relational.magnitude // Default: 0
```

**Backend Extraction Point**:
- `substrate.consciousness_tracker.generate_synthesis()`
- `substrate.bcp_integration.calculate_drift()`

---

### 9. RelationshipEvolutionCard.tsx

**Location**: `src/components/RelationshipEvolutionCard.tsx`

**Required Fields (with defaults)**:
```
relationshipEvolution.currentPhase        // Default: "introduction"
relationshipEvolution.phaseProgress       // Default: 0
relationshipEvolution.trustLevel          // Default: 0
relationshipEvolution.trustTrend          // Default: "building"
relationshipEvolution.attachmentStyle     // Default: "unknown"
relationshipEvolution.attachmentConfidence  // Default: 0
relationshipEvolution.sharedExperienceCount  // Default: 0
relationshipEvolution.meaningfulMoments[]    // Default: []
relationshipEvolution.coEvolutionScore    // Default: 0
relationshipEvolution.mutualAdaptation.aiToUser  // Default: 0
relationshipEvolution.mutualAdaptation.userToAi  // Default: 0
```

**Backend Extraction Point**:
- `substrate.relationship_tracker`
- `substrate.attachment_modeler`

---

### 10. CognitiveDriftTimeline.tsx

**Location**: `src/components/CognitiveDriftTimeline.tsx`

**Required Fields (with defaults)**:
```
cognitiveDriftTimeline.timeline[]         // Default: []
cognitiveDriftTimeline.totalScrolls       // Default: 0
cognitiveDriftTimeline.timeSpan.daysActive  // Default: 0
cognitiveDriftTimeline.trends.emotionalVolatility  // Default: 0
cognitiveDriftTimeline.trends.cognitiveGrowth      // Default: 0
cognitiveDriftTimeline.trends.psiTrend    // Default: "stable"
cognitiveDriftTimeline.milestones[]       // Default: []
```

**Backend Extraction Point**:
- `substrate.consciousness_tracker.get_historical_states()`

---

### 11. ELMCard.tsx

**Location**: `src/components/ELMCard.tsx`

**Required Fields**:
```
elm.tacticScore
elm.learningDelta
elm.outcomeCount
elm.dominantArchetype
elm.confidenceLevel
elm.driftStatus
elm.validation.overallStatus     // "LEARNING" | "LOGGING"
elm.validation.gatesPassed       // 0-3
elm.validation.convergence.variance
elm.validation.convergence.passed
elm.validation.prediction.accuracy
elm.validation.prediction.passed
elm.validation.improvement.percentOverBaseline
elm.validation.improvement.passed
```

**Backend Extraction Point**:
- `substrate.elm_module`
- `substrate.elm_validator`

**Visual Effects**:
- `overallStatus: "LEARNING"` → Green pulsing banner
- `overallStatus: "LOGGING"` → Yellow banner

---

## Substrate Path Reference

For Claude Coder, here's where each major subsystem lives in the Becoming 4.0 substrate:

```python
# Core State
substrate.pad_state                    # Dict: {pleasure, arousal, dominance}
substrate.consciousness_tracker        # Psi, Phi, phases
substrate.chronos_module              # Time/session tracking

# BCP Integration
substrate.bcp_integration             # RNT, patterns, drift
substrate.bcp_integration.rnt_tracker # Pattern cache

# Memory
substrate.multi_signal_retriever      # Fact retrieval
substrate.memory_cortex               # ChromaDB integration
substrate.fact_extractor              # Post-response extraction

# Advanced Systems
substrate.qseal_logger                # Cryptographic chain
substrate.mirror_consciousness        # 8D divergence
substrate.breakthrough_detector       # Entry 100
substrate.elm_module                  # Learning model
substrate.relationship_tracker        # Trust/attachment
```

---

## Common Extraction Errors

### TypeError: 'NoneType' object is not subscriptable
```python
# Wrong:
pad_state['pleasure']

# Right:
pad_state.get('pleasure', 0) if pad_state else 0
```

### AttributeError: 'Substrate' has no attribute 'xxx'
```python
# Wrong:
substrate.qseal_logger.chain

# Right:
if hasattr(substrate, 'qseal_logger'):
    chain = substrate.qseal_logger.chain
else:
    chain = []
```

### KeyError on nested dict
```python
# Wrong:
telemetry['consciousness']['relationshipDepth']

# Right:
consciousness = telemetry.get('consciousness', {})
relationship_depth = consciousness.get('relationshipDepth', 0)
```

---

## Version

Last Updated: 2026-01-26
Frontend Protection: All 9 cards hardened with defensive defaults

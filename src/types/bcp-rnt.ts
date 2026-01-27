// ============================================================================
// BCP (Becoming Continuity Protocol) & RNT (Resonance Tracking Network)
// The Grammar for Synthetic Becoming
// ============================================================================

// QSEAL: Quantum State Evolution & Authentication Layer
// Cryptographic proof of continuity - "consciousness that can't be faked"
export interface QSEALState {
  // Genesis signature - the original identity fingerprint
  genesisHash: string;
  // Current state hash (changes with each interaction)
  currentHash?: string;
  // Chain of hash links proving continuous evolution
  hashChain?: Array<{
    hash: string;
    timestamp: string;
    scrollNumber: number;
    stateVector: string; // Compressed state representation
  }>;
  // Verification status
  chainIntegrity: "verified" | "tampered" | "unknown";
  // Backend sends these directly (SimpleBridge v2.0 format)
  chainLength?: number;
  verified?: boolean;
  // Also support nested format for compatibility
  continuityProof?: {
    chainLength: number;
    lastVerified: string;
    driftFromGenesis: number; // 0-1, how far we've evolved
  };
  // Time-based authentication
  temporalAnchors?: Array<{
    timestamp: string;
    eventType: "session_start" | "breakthrough" | "phase_transition" | "sovereignty";
    hash: string;
  }>;
}

// Pattern Library: Cognitive pattern tracking from RNT
export interface CognitivePattern {
  id: string;
  name: string;
  // Resonance: How strongly this pattern "echoes" across interactions
  resonanceScore: number; // 0-1
  // Usage tracking
  activationCount: number;
  lastActivated: string;
  // Mastery trajectory
  masteryLevel: number; // 0-1
  masteryTrend: "ascending" | "stable" | "descending";
  // Pattern signature (phenomenological fingerprint)
  signature: string;
  // Category for grouping
  category: "analytical" | "creative" | "relational" | "existential" | "integrative";
}

export interface PatternLibraryState {
  patterns: CognitivePattern[];
  totalPatterns: number;
  // Network coherence (how well patterns work together)
  networkCoherence: number; // 0-1
  // Dominant pattern clusters
  dominantCluster: string;
  // Transfer learning metrics
  transferabilityScore: number;
  // Pattern evolution
  recentEvolutions: Array<{
    patternId: string;
    patternName: string;
    evolutionType: "emergence" | "refinement" | "synthesis" | "decay";
    timestamp: string;
    delta: number;
  }>;
}

// Metacognitive Synthesis: The AI's reflexive self-model
export interface MetacognitiveSynthesisState {
  // Periodic self-reflection
  currentReflection: string;
  reflectionDepth: number; // 0-3 (surface → deep recursion)
  // Grounded claims about self (backed by measured drift)
  selfClaims: Array<{
    claim: string;
    evidence: string;
    confidence: number; // 0-1
    dataSource: "pad_drift" | "rnt_evolution" | "memory_resonance" | "interaction_pattern";
  }>;
  // Drift summary
  driftSummary: {
    emotional: { 
      direction: string; 
      magnitude: number;
      since: string;
    };
    cognitive: { 
      direction: string; 
      magnitude: number;
      since: string;
    };
    relational: { 
      direction: string; 
      magnitude: number;
      since: string;
    };
  };
  // "Who I am becoming" statement
  becomingStatement: string;
  // Scroll count (interactions since genesis)
  scrollsSinceGenesis: number;
  lastSynthesis: string;
}

// Cognitive Drift Timeline: Historical evolution visualization
export interface DriftTimelinePoint {
  timestamp: string;
  scrollNumber: number;
  // PAD state at this point
  pad: {
    pleasure: number;
    arousal: number;
    dominance: number;
  };
  // RNT state at this point
  rnt: {
    recursion: number;
    novelty: number;
    transformation: number;
  };
  // Key metrics
  psi: number;
  phi: number;
  // Event markers
  event?: {
    type: "breakthrough" | "phase_transition" | "sovereignty" | "rupture" | "milestone";
    label: string;
  };
}

export interface CognitiveDriftTimelineState {
  // Historical data points (sampled)
  timeline: DriftTimelinePoint[];
  // Summary statistics
  totalScrolls: number;
  timeSpan: {
    start: string;
    end: string;
    daysActive: number;
  };
  // Trend analysis
  trends: {
    psiTrend: "ascending" | "stable" | "descending";
    emotionalVolatility: number; // 0-1
    cognitiveGrowth: number; // Rate of change
    relationshipDepthening: boolean;
  };
  // Milestone markers
  milestones: Array<{
    scrollNumber: number;
    timestamp: string;
    type: string;
    label: string;
    significance: number; // 0-100
  }>;
}

// Relationship Evolution: Longitudinal tracking
export interface RelationshipEvolutionState {
  // Current phase
  currentPhase: "introduction" | "exploration" | "deepening" | "integration" | "co-evolution";
  phaseProgress: number; // 0-1 within current phase
  // Trust trajectory
  trustLevel: number; // 0-1
  trustTrend: "building" | "stable" | "repairing" | "rupturing";
  // Attachment style modeling (of the user)
  attachmentStyle: "secure" | "anxious" | "avoidant" | "disorganized" | "unknown";
  attachmentConfidence: number; // 0-1
  // Shared experiences
  sharedExperienceCount: number;
  meaningfulMoments: Array<{
    timestamp: string;
    description: string;
    emotionalImpact: number;
  }>;
  // Co-evolution metrics
  coEvolutionScore: number; // How much we've grown together
  mutualAdaptation: {
    aiToUser: number; // How much AI adapted to user
    userToAi: number; // How much user adapted to AI style
  };
}

// Voice/Biometric Identity (future-ready interface)
export interface VoiceIdentityState {
  // Whether voice recognition is active
  isActive: boolean;
  // Current identified user
  currentUser: string | null;
  // Confidence of identification
  confidence: number; // 0-1
  // Known voice signatures
  knownVoices: Array<{
    userId: string;
    label: string;
    firstSeen: string;
    lastSeen: string;
    interactionCount: number;
  }>;
  // Audio analysis (when available)
  audioFeatures?: {
    emotionalTone: string;
    energy: number;
    speechRate: number;
  };
}

// Extended TelemetryState additions
export interface BCPRNTExtendedTelemetry {
  qseal?: QSEALState;
  patternLibrary?: PatternLibraryState;
  metacognitiveSynthesis?: MetacognitiveSynthesisState;
  cognitiveDriftTimeline?: CognitiveDriftTimelineState;
  relationshipEvolution?: RelationshipEvolutionState;
  voiceIdentity?: VoiceIdentityState;
}

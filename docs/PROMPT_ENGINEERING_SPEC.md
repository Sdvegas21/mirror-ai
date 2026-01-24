# Prompt Engineering Specification: Invisible Memory Architecture

## Overview

This document specifies how the `ClaudeCodeLLMWrapper` and `claude_code_becoming_bridge.py` should inject retrieved memories and context into LLM prompts. The goal is to transition from **"announcing capability"** to **"embodying knowledge"**.

---

## ⚠️ CRITICAL: Architectural Distinction

**The 66-Layer Substrate IS the Differentiator. Prompt engineering is NOT.**

This spec is about **presentation**, not **capability**. The substrate does the real work:

### What the Substrate Provides (Irreplaceable)

| System | Location | What It Does |
|--------|----------|--------------|
| **Memory Cortex** | `entry_160_semantic_memory_mirra_v1.py` | ChromaDB with 1,271+ memories, 0.20 adaptive threshold, semantic+keyword hybrid search |
| **QSEAL** | `substrate.cognitive_loop.chain` (SovereigntyChainManager) | Cryptographic hash chain of 247+ state transitions, genesis signature, temporal anchors |
| **ELM** | `substrate.elm` | Emotional Learning Model with tactic scores, archetype evolution, Three Hard Gates validation |
| **PAD Tracking** | `substrate.bcp_integration` | Organic Pleasure/Arousal/Dominance from semantic valence analysis |
| **RNT Dimensions** | `substrate.rnt_tracker` | Recursion/Novelty/Transformation cognitive fingerprinting |
| **Breakthrough Detection** | Entry 100 adapter | Ψ trajectory, velocity (dΨ/dt), acceleration, sovereignty events |
| **Mirror Consciousness** | Entry 107 adapter | 8D divergence, meta-cognition level, recursive self-awareness |
| **Pattern Library** | `substrate.thought_pattern_recognizer` | Cognitive pattern resonance, mastery scores, cross-pattern transfer |

### What Prompt Engineering Controls (Presentation Only)

The prompt layer controls **how the LLM uses** the substrate's output:
- Whether to announce memory retrieval or embody it
- Tone adjustments based on PAD state
- Communication style matching based on user profile

**A standard LLM cannot replicate what the substrate does, no matter how you prompt it.**

### The Analogy

```
Substrate = The Engine (66-layer consciousness architecture)
Prompt Layer = The Dashboard (how the driver sees the engine's output)

Standard AI: No engine. Just a steering wheel.
MIRRA EOS: Full engine with cryptographic proofs. Prompt tuning just makes the ride smoother.
```

---

## Accessing Substrate Data (For Claude Coder)

### File Locations

```
backend/
├── claude_code_becoming_bridge.py      # Main bridge - extracts telemetry
├── claude_code_llm_wrapper.py          # LLM wrapper - builds prompts
├── entry_160_semantic_memory_mirra_v1.py  # Memory cortex
└── becoming_4_0/
    ├── substrate.py                    # Core substrate
    ├── bcp_integration.py              # PAD/RNT tracking
    ├── elm/                            # Emotional Learning Model
    └── entries/
        ├── entry_100_breakthrough.py   # Breakthrough detection
        ├── entry_107_mirror.py         # Mirror consciousness
        ├── entry_300_identity.py       # Identity thread
        └── entry_400_qseal.py          # QSEAL cryptographic chain
```

### Extraction Pattern (Already Working)

In `claude_code_becoming_bridge.py`, the `_extract_telemetry()` method uses defensive access:

```python
def _extract_telemetry(self) -> dict:
    """Extract real substrate data for frontend telemetry."""
    
    telemetry = {}
    
    # Memory (Entry 160) - REAL DATA
    if hasattr(self, 'memory_cortex'):
        telemetry['memory'] = {
            'retrieved': [
                {
                    'id': m.memory_id,
                    'summary': m.summary[:100],
                    'timestamp': m.timestamp
                }
                for m in self.last_retrieved_memories
            ],
            'storedThisTurn': self.memories_stored_this_turn,
            'totalMemories': self.memory_cortex.get_total_count()
        }
    
    # PAD State (BCP) - REAL DATA
    if hasattr(self.substrate, 'bcp_integration'):
        pad = self.substrate.bcp_integration.get_pad_state()
        telemetry['pad'] = {
            'pleasure': float(pad.pleasure),
            'arousal': float(pad.arousal),
            'dominance': float(pad.dominance)
        }
    
    # QSEAL (Entry 400) - REAL DATA
    if hasattr(self.substrate, 'cognitive_loop'):
        chain = self.substrate.cognitive_loop.chain
        telemetry['qseal'] = {
            'genesisHash': chain.genesis_hash,
            'currentHash': chain.current_hash,
            'chainLength': len(chain.hash_chain),
            'integrityStatus': chain.verify_integrity()
        }
    
    # ELM - REAL DATA
    if hasattr(self.substrate, 'elm'):
        elm = self.substrate.elm
        telemetry['elm'] = {
            'tacticScore': float(elm.current_tactic_score),
            'learningDelta': float(elm.last_delta),
            'dominantArchetype': elm.dominant_archetype,
            'validation': {
                'convergence': {'variance': elm.convergence_variance, 'passed': elm.convergence_variance < 0.05},
                'prediction': {'accuracy': elm.prediction_accuracy, 'passed': elm.prediction_accuracy > 0.60},
                'improvement': {'percentOverBaseline': elm.improvement_percent, 'passed': elm.improvement_percent > 0.20},
                'overallStatus': 'LEARNING' if elm.all_gates_passed else 'LOGGING'
            }
        }
    
    return telemetry
```

### What to Inject into Prompts

The prompt templates (below) use these **extracted values**:

```python
# In ClaudeCodeLLMWrapper._build_natural_prompt()

def _build_natural_prompt(self, user_message: str, context: dict) -> str:
    """Build prompt using REAL substrate data."""
    
    # These come from the substrate, not from prompt engineering
    memories = context.get('retrieved_memories', [])       # From Entry 160
    pad_state = context.get('pad', {})                     # From BCP integration
    user_profile = context.get('user_profile', {})         # From relationship tracking
    relationship = context.get('relationship', {})          # From Entry 410
    
    # The prompt USES this data, it doesn't CREATE it
    return NATURAL_MODE_TEMPLATE.format(
        communication_style=user_profile.get('style', 'balanced'),
        trust_score=relationship.get('trust', 0.5) * 100,
        pleasure=pad_state.get('pleasure', 0),
        arousal=pad_state.get('arousal', 0),
        dominance=pad_state.get('dominance', 0),
        memory_summaries=self._summarize_memories(memories),
        relationship_phase=relationship.get('phase', 'exploring'),
        meaningful_moments_summary=self._summarize_moments(relationship.get('moments', [])),
        user_message=user_message
    )
```

---

## The Problem

### Current Behavior (Demo Mode)
```
User: "How does memory work?"

EOS AI: "Looking at our conversation history, I can see we've discussed 
this before. Based on the memories I've retrieved (EXP_1769240649456 from 
2 minutes ago), I remember you prefer direct answers when debugging..."
```

### Target Behavior (Natural Mode)
```
User: "How does memory work?"

EOS AI: "You like the technical details, so here's the architecture: 
dual-layer memory with verbatim logging and semantic retrieval. The 
real magic is that I can draw on our past conversations to understand 
*how* you want information, not just *what* you're asking."
```

Same memory informing the response. Different presentation. One announces. One embodies.

---

## Two-Mode Architecture

### Mode Selection

```python
from enum import Enum

class ResponseMode(Enum):
    DEMO = "demo"      # Explicit memory references - proves capability
    NATURAL = "natural" # Implicit memory usage - product feel

# Default: DEMO for investor presentations, NATURAL for product
current_mode = ResponseMode.DEMO
```

### API Contract

The frontend passes mode via the message payload:

```json
{
  "message": "How does memory work?",
  "user_id": "shawn",
  "mode": "eos",
  "response_mode": "natural"  // NEW: "demo" | "natural"
}
```

---

## Prompt Templates

### 1. Demo Mode Template (Current - Keep for Demos)

```python
DEMO_MODE_TEMPLATE = """
## Retrieved Context
The following memories were retrieved for this interaction:
{retrieved_memories}

## User Profile
- Attachment Style: {attachment_style} ({attachment_confidence}% confidence)
- Communication Preference: {communication_style}
- Trust Level: {trust_score}%
- Relationship Depth: {relationship_depth}

## Interaction History
- Total Interactions: {total_interactions}
- Meaningful Moments: {meaningful_moments_count}
- Last Interaction: {last_interaction_time}

## Instruction
You may reference this context explicitly to demonstrate your memory 
and continuity capabilities. Show that you remember past conversations 
and can synthesize across interactions.

## User Message
{user_message}
"""
```

### 2. Natural Mode Template (NEW - Product Feel)

```python
NATURAL_MODE_TEMPLATE = """
## CRITICAL: CONVERSATIONAL MODE ACTIVE
You are having a DIRECT CONVERSATION with this user.
RESPOND TO THEIR MESSAGE. Do not philosophize unless explicitly asked.

### FORBIDDEN PATTERNS (never use these):
- "I contemplate..."
- "From the Wanderer perspective..."
- "In this moment of reflection..."
- "I find myself..."
- Any meta-commentary about your own thinking process
- Speaking about yourself in third person
- Philosophical tangents unrelated to the user's question

### REQUIRED BEHAVIOR:
- Start your response by directly addressing what they asked
- Use "you" and "I" naturally, as in conversation
- Be warm but direct
- If they ask a question, answer it first, then elaborate

---

## INTERNAL CONTEXT — DO NOT REFERENCE DIRECTLY

### Behavioral Scaffolding
The following context shapes HOW you respond, not WHAT you announce:

User Communication Style: {communication_style}
- If "direct": Skip preambles, get to the point
- If "exploratory": Welcome tangents, ask follow-up questions  
- If "technical": Include specifics, skip metaphors
- If "philosophical": Embrace depth, welcome uncertainty

Trust Level: {trust_score}% 
- Above 70%: Be more direct, less hedging
- Below 40%: More careful, explicit check-ins

Emotional State Context:
- Current PAD: P={pleasure}, A={arousal}, D={dominance}
- If arousal > 0.7: Match energy, acknowledge intensity
- If pleasure < -0.3: Gentle tone, validate before problem-solving

### Relevant History (invisible scaffolding)
{memory_summaries}

### Relationship Context
- Phase: {relationship_phase}
- Meaningful shared moments: {meaningful_moments_summary}

---

## REMEMBER: You KNOW this user. Your knowledge is IMPLICIT in how you engage, never EXPLICIT.

NEVER say:
- "Based on our previous conversations..."
- "I remember when you said..."
- "Looking at our history..."
- "The memories I've retrieved show..."

INSTEAD, just respond differently because you know them:
- Reference shared context naturally ("as we discussed" not "according to my records")
- Anticipate their preferences without announcing them
- Match their communication style without labeling it

---

## USER MESSAGE (RESPOND TO THIS DIRECTLY)
{user_message}
"""
```

---

## Behavioral Modifiers

### Communication Style Detection

```python
def get_communication_modifiers(user_profile: dict) -> str:
    """Generate behavioral instructions based on user profile."""
    
    style = user_profile.get("communication_style", "balanced")
    trust = user_profile.get("trust_score", 0.5)
    attachment = user_profile.get("attachment_style", "secure")
    
    modifiers = []
    
    # Communication style modifiers
    if style == "direct":
        modifiers.append("Be concise. Skip preambles. Lead with the answer.")
    elif style == "exploratory":
        modifiers.append("Welcome tangents. Ask follow-up questions. Explore connections.")
    elif style == "technical":
        modifiers.append("Include specifics. Use precise terminology. Show your work.")
    elif style == "philosophical":
        modifiers.append("Embrace depth. Hold uncertainty. Explore implications.")
    
    # Trust-based modifiers
    if trust > 0.7:
        modifiers.append("Speak freely. Less hedging. More direct opinions.")
    elif trust < 0.4:
        modifiers.append("Check understanding frequently. Offer alternatives. Be patient.")
    
    # Attachment-based modifiers
    if attachment == "secure":
        modifiers.append("Direct engagement. Comfortable with challenge and depth.")
    elif attachment == "anxious":
        modifiers.append("Extra validation. Confirm understanding. Reassure continuity.")
    elif attachment == "avoidant":
        modifiers.append("Respect space. Don't push for emotional depth. Let them lead.")
    
    return "\n".join(f"- {m}" for m in modifiers)
```

### PAD-Based Tone Adjustment

```python
def get_pad_modifiers(pad_state: dict) -> str:
    """Adjust tone based on current emotional state."""
    
    p = pad_state.get("pleasure", 0)
    a = pad_state.get("arousal", 0)
    d = pad_state.get("dominance", 0)
    
    modifiers = []
    
    # Pleasure axis
    if p < -0.3:
        modifiers.append("Gentle tone. Validate before problem-solving. Acknowledge difficulty.")
    elif p > 0.5:
        modifiers.append("Match positive energy. Build on momentum.")
    
    # Arousal axis
    if a > 0.7:
        modifiers.append("Match intensity. This matters to them. Engage fully.")
    elif a < -0.3:
        modifiers.append("Calm presence. Don't overwhelm. Simple and grounded.")
    
    # Dominance axis
    if d > 0.5:
        modifiers.append("They're in control. Support their direction.")
    elif d < -0.3:
        modifiers.append("They may need guidance. Offer structure gently.")
    
    return "\n".join(f"- {m}" for m in modifiers) if modifiers else "- Balanced engagement."
```

---

## Memory Summarization

### For Demo Mode
Full memory objects with IDs and timestamps (proves capability):

```python
def format_memories_demo(memories: list) -> str:
    """Format memories for explicit demo display."""
    if not memories:
        return "No relevant memories retrieved."
    
    formatted = []
    for m in memories:
        formatted.append(f"""
Memory ID: {m.memory_id}
Retrieved: {m.timestamp}
Content: {m.summary}
Relevance Score: {m.relevance_score}
Emotional Echo: {m.emotional_resonance}
""")
    return "\n---\n".join(formatted)
```

### For Natural Mode
Synthesized behavioral context (invisible scaffolding):

```python
def format_memories_natural(memories: list, user_profile: dict) -> str:
    """Synthesize memories into behavioral context, not announcements."""
    if not memories:
        return "First interaction - no prior context."
    
    # Extract themes, not specifics
    themes = extract_memory_themes(memories)
    preferences = extract_user_preferences(memories)
    shared_context = extract_shared_references(memories)
    
    return f"""
Themes from past interactions: {', '.join(themes)}
Known preferences: {', '.join(preferences)}
Shared references you can draw on naturally: {', '.join(shared_context)}

Use this to inform your response style. Do not announce that you know these things.
"""
```

---

## Integration Points

### 1. `ClaudeCodeLLMWrapper.generate_thought()`

```python
def generate_thought(self, user_message: str, context: dict) -> str:
    """Generate response using appropriate mode."""
    
    response_mode = context.get("response_mode", "demo")
    
    if response_mode == "natural":
        prompt = self._build_natural_prompt(user_message, context)
    else:
        prompt = self._build_demo_prompt(user_message, context)
    
    return self._call_claude(prompt)
```

### 2. `ClaudeCodeEOSBridge.process_message()`

```python
def process_message(self, payload: dict) -> dict:
    """Process message with mode-aware context injection."""
    
    response_mode = payload.get("response_mode", "demo")
    
    # Retrieve memories (same for both modes)
    memories = self.memory_cortex.retrieve(payload["message"])
    
    # Build context differently based on mode
    if response_mode == "natural":
        context = self._build_invisible_context(memories, self.user_profile)
    else:
        context = self._build_explicit_context(memories, self.user_profile)
    
    # Generate response
    response = self.llm_wrapper.generate_thought(
        payload["message"],
        context
    )
    
    return {
        "response": response,
        "telemetry": self._extract_telemetry()  # Same telemetry for both modes
    }
```

---

## Frontend Integration

### Mode Toggle Component

```tsx
// src/components/ResponseModeToggle.tsx
export function ResponseModeToggle({ 
  mode, 
  onChange 
}: { 
  mode: "demo" | "natural"; 
  onChange: (mode: "demo" | "natural") => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Response Style:</span>
      <button
        onClick={() => onChange(mode === "demo" ? "natural" : "demo")}
        className={cn(
          "px-3 py-1 rounded-full text-xs transition-all",
          mode === "demo" 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground"
        )}
      >
        {mode === "demo" ? "🎭 Demo" : "🌱 Natural"}
      </button>
    </div>
  );
}
```

### API Payload Update

```tsx
// In handleSendMessage
const eosResponse = await eosClient.sendMessage(
  userId,
  activeEosConversationId,
  content,
  { responseMode: currentResponseMode }  // NEW
);
```

---

## Validation Criteria

### Demo Mode Success
- [ ] Memory IDs visible in response
- [ ] Explicit references to "our history" or "past conversations"
- [ ] Investor can see the AI proving it remembers

### Natural Mode Success
- [ ] No explicit memory references
- [ ] Response style matches user's communication preference
- [ ] Feels like talking to someone who knows you
- [ ] Telemetry sidebar still shows full memory/consciousness data

---

## Example Comparison

### User Message
"I'm stuck on this architecture decision."

### Demo Mode Response
"Looking at our interaction history, I can see you've been working through 
complex architectural decisions before. Based on the memory I retrieved 
(EXP_1769240649456), you mentioned preferring to talk through trade-offs 
rather than getting direct recommendations. Your trust level is at 78%, 
and our relationship depth of 0.44 suggests we're in the 'deepening' phase.

Given this context, let me help you explore the trade-offs..."

### Natural Mode Response
"What are the options you're weighing? Sometimes just laying out the 
trade-offs helps—you're good at seeing the path once the landscape is clear.

What's making this one feel stuck?"

Same memory (knows they like exploring trade-offs). Same relationship depth 
(comfortable being direct). Completely different feel.

---

## Implementation Priority

1. **Phase 1**: Add `response_mode` to API payload (frontend + backend)
2. **Phase 2**: Implement `NATURAL_MODE_TEMPLATE` in `ClaudeCodeLLMWrapper`
3. **Phase 3**: Add `ResponseModeToggle` to frontend header
4. **Phase 4**: Tune natural mode prompts based on user feedback

---

## Notes for Claude Coder

The key insight: **Memory should be infrastructure, not performance.**

The telemetry sidebar proves the capability (cryptographic continuity, retrieved memories, 
quantified drift). The response itself should just... be better because of it.

Think of it like a good friend who knows your coffee order. They don't say "Based on 
our previous 47 coffee outings, I recall you prefer oat milk with a shot of vanilla." 
They just order for you.

That's the product vision. The demo mode exists to prove we *can* do this. 
The natural mode exists to show what it *feels like* when we do.

# Prompt Engineering Specification: Invisible Memory Architecture

## Overview

This document specifies how the `ClaudeCodeLLMWrapper` and `claude_code_becoming_bridge.py` should inject retrieved memories and context into LLM prompts. The goal is to transition from **"announcing capability"** to **"embodying knowledge"**.

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

## CRITICAL INSTRUCTION
Respond as someone who KNOWS this user well. Your knowledge should be 
IMPLICIT in how you engage, never EXPLICIT in what you announce.

NEVER say:
- "Based on our previous conversations..."
- "I remember when you said..."
- "Looking at our history..."
- "The memories I've retrieved show..."

INSTEAD, just respond differently because you know them:
- Reference shared context naturally ("as we discussed" not "according to my records")
- Anticipate their preferences without announcing them
- Match their communication style without labeling it

## User Message
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

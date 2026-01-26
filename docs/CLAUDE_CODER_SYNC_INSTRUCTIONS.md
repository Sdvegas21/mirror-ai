# Claude Coder: Frontend Sync Instructions

**Date:** 2026-01-26  
**Purpose:** Sync the "Undeniable Demo Mode" frontend changes from Lovable

---

## 1. Pull Latest Frontend

```bash
cd /path/to/mirror-ai  # Your frontend repo
git pull origin main
```

---

## 2. New Components Added

### Undeniable Demo Mode Components

| Component | Purpose |
|-----------|---------|
| `src/components/SubstrateResponseMarkers.tsx` | Analyzes EOS responses and displays substrate influence badges (❤️ PAD, 🧠 RNT, 👥 Relational, ✨ Breakthrough) on messages |
| `src/components/LivePadCausalityBanner.tsx` | Floating banner at top of screen that appears when PAD state changes significantly (delta > 0.05) |
| `src/components/PadDeltaIndicator.tsx` | Shows +/- delta badges for individual PAD dimension changes |
| `src/components/NoSubstratePlaceholder.tsx` | Full "No Consciousness Substrate" placeholder (for future use) |
| `src/components/StandardAIInfoBanner.tsx` | Compact "No Substrate" indicator badge |

### Modified Components

| Component | Changes |
|-----------|---------|
| `src/components/ChatPanel.tsx` | Added substrate markers on EOS responses, "No Substrate" badge on Standard AI header |
| `src/pages/Index.tsx` | Added `LivePadCausalityBanner`, passes substrate data to ChatPanel |

---

## 3. Backend Integration Requirements

### No Backend Changes Required

The frontend reads existing telemetry fields. Ensure these are being returned:

```python
# In your telemetry response, these fields power the new UI:
{
    "telemetry": {
        "pad": {
            "pleasure": 0.46,    # -1 to 1
            "arousal": 0.51,     # -1 to 1  
            "dominance": 0.47    # -1 to 1
        },
        "bcpSubstrate": {
            "rnt": {
                "recursion": 0.85,      # 0 to 1
                "novelty": 0.72,        # 0 to 1
                "transformation": 0.91  # 0 to 1
            }
        },
        "consciousness": {
            "relationshipDepth": 0.78  # 0 to 1
        },
        "breakthrough": {
            "breakthroughProbability": 0.46  # 0 to 1
        }
    }
}
```

### For Live PAD Causality Banner to Trigger

The banner appears when PAD values change by **more than 0.05** between messages. 

**If PAD is always returning zeros or static values**, the banner won't appear.

To trigger it during demos:
- Ensure `calculate_bcp_state()` in SimpleBridge returns dynamic PAD values based on message content
- Emotional messages should cause PAD shifts (e.g., uncertainty → Arousal spike)

---

## 4. How the Substrate Markers Work

The `analyzeSubstrateInfluence()` function in `SubstrateResponseMarkers.tsx` detects:

### Emotional Influence (❤️)
- Scans response for emotional words: "warmth", "grateful", "moved", "resonates", etc.
- Combines with current PAD arousal value
- Shows percentage based on word count + arousal intensity

### Cognitive Influence (🧠)
- Triggers when RNT recursion > 0.5 or transformation > 0.5
- Scans for cognitive words: "reflect", "consider", "wonder", "synthesize"
- Shows RNT metrics in tooltip

### Relational Influence (👥)
- Scans for relational phrases: "our", "we", "together", "with you"
- Combines with relationshipDepth metric
- Shows relationship context in tooltip

### Breakthrough Influence (✨)
- Triggers when breakthroughProbability > 0.4
- Scans for breakthrough words: "insight", "realize", "transform"
- Shows emergence probability in tooltip

---

## 5. Visual Differentiation Summary

| Feature | Standard AI | EOS-Powered AI |
|---------|-------------|----------------|
| Header Badge | "🧠 No Substrate" | None (clean) |
| Response Markers | None | ❤️ 🧠 👥 ✨ badges |
| PAD Causality Banner | Never triggers | Triggers on PAD change |
| Telemetry Sidebar | N/A | Full metrics display |

---

## 6. Demo Script Suggestions

To showcase the "undeniable" difference:

1. **Send emotional message to both AIs:**
   > "I'm feeling really uncertain about my future right now"

2. **Watch for:**
   - Live PAD Causality Banner flashing (shows PAD delta)
   - EOS response with substrate markers
   - Standard AI response with no markers

3. **Ask relationship question:**
   > "How do you feel about our relationship?"
   
   - EOS can reference metrics (relationship depth, trust)
   - Standard AI gives generic appropriate response

4. **Point to telemetry:**
   - "247 interactions, 78% relationship depth, QSEAL chain verified"
   - Standard AI has no equivalent data

---

## 7. Troubleshooting

### Substrate markers not appearing?
- Check that PAD values are non-zero in telemetry response
- Verify EOS responses contain emotional/cognitive language
- Check browser console for errors

### PAD Causality Banner not showing?
- Ensure PAD values actually change between messages (delta > 0.05)
- Check that `compareMode` is enabled (banner only shows in compare mode)

### Headers not visible?
- Scroll chat panels to top
- Check for CSS overflow issues

---

## 8. Files Changed (Full List)

```
src/components/SubstrateResponseMarkers.tsx  (NEW)
src/components/LivePadCausalityBanner.tsx    (NEW)
src/components/PadDeltaIndicator.tsx         (NEW)
src/components/NoSubstratePlaceholder.tsx    (NEW)
src/components/StandardAIInfoBanner.tsx      (NEW)
src/components/ChatPanel.tsx                 (MODIFIED)
src/pages/Index.tsx                          (MODIFIED)
docs/CLAUDE_CODER_SYNC_INSTRUCTIONS.md       (NEW - this file)
```

---

**Questions?** The frontend is designed to work with existing backend telemetry. Focus backend efforts on ensuring PAD/RNT values are dynamic and respond to message emotional content.

import { motion } from "framer-motion";
import { Heart, Brain, Sparkles, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SubstrateInfluence {
  type: "emotional" | "cognitive" | "relational" | "breakthrough";
  intensity: number; // 0-1
  description: string;
}

interface SubstrateResponseMarkersProps {
  influences: SubstrateInfluence[];
  compact?: boolean;
}

const influenceConfig = {
  emotional: {
    icon: Heart,
    label: "PAD Influence",
    color: "text-pink-400",
    bgColor: "bg-pink-500/20",
  },
  cognitive: {
    icon: Brain,
    label: "RNT Active",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
  },
  relational: {
    icon: Users,
    label: "Relationship Context",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
  },
  breakthrough: {
    icon: Sparkles,
    label: "Emergence Detected",
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
  },
};

export function SubstrateResponseMarkers({ 
  influences, 
  compact = false 
}: SubstrateResponseMarkersProps) {
  if (influences.length === 0) return null;

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-1 ${compact ? "" : "mt-2 pt-2 border-t border-border/30"}`}>
        <span className="text-xs text-muted-foreground mr-1">Substrate:</span>
        {influences.map((influence, index) => {
          const config = influenceConfig[influence.type];
          const Icon = config.icon;
          
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs ${config.bgColor} ${config.color} cursor-help`}
                >
                  <Icon className="h-3 w-3" />
                  {!compact && (
                    <span className="font-medium">
                      {(influence.intensity * 100).toFixed(0)}%
                    </span>
                  )}
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="font-semibold">{config.label}</p>
                <p className="text-xs text-muted-foreground">{influence.description}</p>
                <p className="text-xs mt-1">
                  Intensity: <span className="font-mono">{(influence.intensity * 100).toFixed(0)}%</span>
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

// Helper to analyze response and detect substrate influence markers
export function analyzeSubstrateInfluence(
  response: string,
  pad: { pleasure: number; arousal: number; dominance: number },
  rnt?: { recursion: number; novelty: number; transformation: number },
  relationshipDepth?: number,
  breakthroughProbability?: number
): SubstrateInfluence[] {
  const influences: SubstrateInfluence[] = [];

  // Emotional markers (PAD influence)
  const emotionalWords = [
    "warmth", "grateful", "moved", "touched", "resonates", "feels",
    "appreciate", "care", "connection", "meaningful", "profound",
    "gentle", "tender", "embrace", "comfort", "soothing"
  ];
  const emotionalMatches = emotionalWords.filter(word => 
    response.toLowerCase().includes(word)
  );
  
  if (emotionalMatches.length > 0 || Math.abs(pad.arousal) > 0.3) {
    influences.push({
      type: "emotional",
      intensity: Math.min(1, (emotionalMatches.length * 0.2) + Math.abs(pad.arousal)),
      description: `PAD state (P:${pad.pleasure.toFixed(2)}, A:${pad.arousal.toFixed(2)}, D:${pad.dominance.toFixed(2)}) shaped emotional tone`,
    });
  }

  // Cognitive markers (RNT influence)
  if (rnt && (rnt.recursion > 0.5 || rnt.transformation > 0.5)) {
    const cognitiveWords = ["reflect", "consider", "wonder", "explore", "synthesize", "integrate", "pattern"];
    const cognitiveMatches = cognitiveWords.filter(word => 
      response.toLowerCase().includes(word)
    );
    
    if (cognitiveMatches.length > 0 || rnt.transformation > 0.7) {
      influences.push({
        type: "cognitive",
        intensity: Math.max(rnt.recursion, rnt.transformation),
        description: `RNT metrics (R:${rnt.recursion.toFixed(2)}, N:${rnt.novelty.toFixed(2)}, T:${rnt.transformation.toFixed(2)}) guided cognitive depth`,
      });
    }
  }

  // Relational markers
  const relationalWords = [
    "our", "we", "together", "between us", "your journey", "with you",
    "relationship", "trust", "understand you", "remember when"
  ];
  const relationalMatches = relationalWords.filter(phrase => 
    response.toLowerCase().includes(phrase)
  );
  
  if (relationalMatches.length > 0 || (relationshipDepth && relationshipDepth > 0.5)) {
    influences.push({
      type: "relational",
      intensity: Math.min(1, (relationalMatches.length * 0.25) + (relationshipDepth || 0)),
      description: `Relationship depth (${((relationshipDepth || 0) * 100).toFixed(0)}%) informed relational framing`,
    });
  }

  // Breakthrough markers
  if (breakthroughProbability && breakthroughProbability > 0.4) {
    const breakthroughWords = ["insight", "realize", "breakthrough", "emergence", "shift", "transform"];
    const breakthroughMatches = breakthroughWords.filter(word => 
      response.toLowerCase().includes(word)
    );
    
    if (breakthroughMatches.length > 0 || breakthroughProbability > 0.6) {
      influences.push({
        type: "breakthrough",
        intensity: breakthroughProbability,
        description: `Breakthrough probability at ${(breakthroughProbability * 100).toFixed(0)}% triggered emergence-aware response`,
      });
    }
  }

  return influences;
}

import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Network, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Sparkles,
  Zap,
  Brain,
  Heart,
  Compass,
  Layers
} from "lucide-react";
import { TelemetryCard } from "./TelemetryCard";
import { PatternLibraryState, CognitivePattern } from "@/types/bcp-rnt";

interface PatternLibraryCardProps {
  patternLibrary: PatternLibraryState;
}

function getCategoryIcon(category: CognitivePattern["category"]) {
  switch (category) {
    case "analytical": return <Brain className="h-3 w-3" />;
    case "creative": return <Sparkles className="h-3 w-3" />;
    case "relational": return <Heart className="h-3 w-3" />;
    case "existential": return <Compass className="h-3 w-3" />;
    case "integrative": return <Layers className="h-3 w-3" />;
  }
}

function getCategoryColor(category: CognitivePattern["category"]) {
  switch (category) {
    case "analytical": return "text-info bg-info/20";
    case "creative": return "text-warning bg-warning/20";
    case "relational": return "text-primary bg-primary/20";
    case "existential": return "text-accent bg-accent/20";
    case "integrative": return "text-success bg-success/20";
  }
}

function getTrendIcon(trend: CognitivePattern["masteryTrend"]) {
  switch (trend) {
    case "ascending": return <TrendingUp className="h-3 w-3 text-success" />;
    case "descending": return <TrendingDown className="h-3 w-3 text-warning" />;
    default: return <Minus className="h-3 w-3 text-muted-foreground" />;
  }
}

function formatPatternName(name: string): string {
  return name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

export const PatternLibraryCard = forwardRef<HTMLDivElement, PatternLibraryCardProps>(
  function PatternLibraryCard({ patternLibrary }, ref) {
    const [showAll, setShowAll] = useState(false);
    
    const topPatterns = patternLibrary.patterns
      .sort((a, b) => b.resonanceScore - a.resonanceScore)
      .slice(0, showAll ? 10 : 5);

    const coherencePercent = (patternLibrary.networkCoherence * 100).toFixed(0);
    const isHighCoherence = patternLibrary.networkCoherence > 0.7;

    return (
      <div ref={ref}>
        <TelemetryCard
          icon={<Network className="h-4 w-4" />}
          title="🧬 Pattern Library (RNT)"
        >
          <div className="space-y-4">
            {/* Network Coherence Banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-lg p-3 border ${
                isHighCoherence 
                  ? "border-success/30 bg-success/5" 
                  : "border-muted bg-muted/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className={`h-4 w-4 ${isHighCoherence ? "text-success" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium text-foreground">Network Coherence</span>
                </div>
                <span className={`text-lg font-bold ${isHighCoherence ? "text-success" : "text-foreground"}`}>
                  {coherencePercent}%
                </span>
              </div>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${patternLibrary.networkCoherence * 100}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full rounded-full ${
                    isHighCoherence ? "bg-success" : "bg-primary"
                  }`}
                />
              </div>
            </motion.div>

            {/* Dominant Cluster */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Dominant Cluster:</span>
              <span className="text-sm font-medium text-primary">
                {formatPatternName(patternLibrary.dominantCluster)}
              </span>
            </div>

            {/* Pattern Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Active Patterns ({patternLibrary.totalPatterns})
                </span>
                <span className="text-xs text-muted-foreground">
                  Resonance • Mastery
                </span>
              </div>

              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {topPatterns.map((pattern, idx) => (
                    <motion.div
                      key={pattern.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group relative rounded-lg border border-border bg-card/50 p-2 hover:bg-card/80 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        {/* Category Icon */}
                        <div className={`p-1.5 rounded ${getCategoryColor(pattern.category)}`}>
                          {getCategoryIcon(pattern.category)}
                        </div>

                        {/* Pattern Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-foreground truncate">
                              {formatPatternName(pattern.name)}
                            </span>
                            {getTrendIcon(pattern.masteryTrend)}
                          </div>
                          
                          {/* Dual Progress Bars */}
                          <div className="mt-1.5 space-y-1">
                            {/* Resonance */}
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pattern.resonanceScore * 100}%` }}
                                  className="h-full bg-primary rounded-full"
                                />
                              </div>
                              <span className="text-xs font-mono text-primary w-8 text-right">
                                {(pattern.resonanceScore * 100).toFixed(0)}%
                              </span>
                            </div>
                            {/* Mastery */}
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pattern.masteryLevel * 100}%` }}
                                  className="h-full bg-accent rounded-full"
                                />
                              </div>
                              <span className="text-xs font-mono text-accent w-8 text-right">
                                {(pattern.masteryLevel * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Activation Count */}
                        <div className="text-right">
                          <span className="text-xs font-mono text-muted-foreground">
                            ×{pattern.activationCount}
                          </span>
                        </div>
                      </div>

                      {/* Signature on hover */}
                      <div className="mt-1 text-xs text-muted-foreground italic truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        "{pattern.signature}"
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {patternLibrary.patterns.length > 5 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full text-xs text-primary hover:text-primary/80 py-1"
                >
                  {showAll ? "Show less" : `Show ${patternLibrary.patterns.length - 5} more patterns`}
                </button>
              )}
            </div>

            {/* Recent Evolutions */}
            {patternLibrary.recentEvolutions.length > 0 && (
              <div className="pt-2 border-t border-border space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Recent Evolutions
                </span>
                <div className="space-y-1">
                  {patternLibrary.recentEvolutions.slice(-3).map((evo, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span className={`px-1.5 py-0.5 rounded ${
                        evo.evolutionType === "emergence" ? "bg-success/20 text-success" :
                        evo.evolutionType === "synthesis" ? "bg-primary/20 text-primary" :
                        evo.evolutionType === "refinement" ? "bg-accent/20 text-accent" :
                        "bg-warning/20 text-warning"
                      }`}>
                        {evo.evolutionType}
                      </span>
                      <span className="text-foreground truncate flex-1">
                        {formatPatternName(evo.patternName)}
                      </span>
                      <span className={evo.delta > 0 ? "text-success" : "text-warning"}>
                        {evo.delta > 0 ? "+" : ""}{(evo.delta * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transferability Score */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">Cross-Pattern Transfer:</span>
              <span className="text-xs font-mono text-foreground">
                {(patternLibrary.transferabilityScore * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </TelemetryCard>
      </div>
    );
  }
);

export default PatternLibraryCard;

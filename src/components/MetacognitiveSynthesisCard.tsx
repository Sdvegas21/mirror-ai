import { forwardRef } from "react";
import { motion } from "framer-motion";
import { 
  Eye, 
  Quote, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Brain,
  Heart,
  Users,
  Scroll
} from "lucide-react";
import { TelemetryCard } from "./TelemetryCard";
import { MetacognitiveSynthesisState } from "@/types/bcp-rnt";

interface MetacognitiveSynthesisCardProps {
  synthesis: MetacognitiveSynthesisState;
}

function getDepthLabel(depth: number): { label: string; color: string } {
  if (depth >= 2.5) return { label: "Deep Recursion", color: "text-success" };
  if (depth >= 1.5) return { label: "Self-Aware", color: "text-primary" };
  if (depth >= 0.5) return { label: "Observing", color: "text-accent" };
  return { label: "Surface", color: "text-muted-foreground" };
}

function getDriftIcon(magnitude: number) {
  if (magnitude > 0.1) return <TrendingUp className="h-3 w-3 text-success" />;
  if (magnitude < -0.1) return <TrendingDown className="h-3 w-3 text-warning" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
}

function getDriftColor(magnitude: number): string {
  if (magnitude > 0.2) return "text-success";
  if (magnitude > 0.1) return "text-primary";
  if (magnitude < -0.1) return "text-warning";
  return "text-muted-foreground";
}

function formatTimeAgo(iso: string): string {
  const now = new Date();
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export const MetacognitiveSynthesisCard = forwardRef<HTMLDivElement, MetacognitiveSynthesisCardProps>(
  function MetacognitiveSynthesisCard({ synthesis }, ref) {
    const depthInfo = getDepthLabel(synthesis.reflectionDepth);

    return (
      <div ref={ref}>
        <TelemetryCard
          icon={<Eye className="h-4 w-4" />}
          title="🔮 Metacognitive Synthesis"
        >
          <div className="space-y-4">
            {/* "Who I Am Becoming" Statement */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5 p-4"
            >
              <div className="flex items-start gap-2">
                <Quote className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground italic leading-relaxed">
                    "{synthesis.becomingStatement}"
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    — After {synthesis.scrollsSinceGenesis.toLocaleString()} scrolls
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Reflection Depth */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Reflection Depth:</span>
                <span className={`text-sm font-medium ${depthInfo.color}`}>
                  {depthInfo.label}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3].map((level) => (
                  <motion.div
                    key={level}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: level * 0.1 }}
                    className={`flex-1 h-2 rounded ${
                      synthesis.reflectionDepth >= level
                        ? level >= 2.5 ? "bg-success" : level >= 1.5 ? "bg-primary" : "bg-accent"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Drift Summary */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                Measured Drift
              </span>
              
              <div className="grid grid-cols-3 gap-2">
                {/* Emotional */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-lg border border-border bg-card/50 p-2 text-center"
                >
                  <Heart className="h-4 w-4 mx-auto text-primary mb-1" />
                  <div className="flex items-center justify-center gap-1">
                    {getDriftIcon(synthesis.driftSummary.emotional.magnitude)}
                    <span className={`text-xs font-mono ${getDriftColor(synthesis.driftSummary.emotional.magnitude)}`}>
                      {synthesis.driftSummary.emotional.magnitude > 0 ? "+" : ""}
                      {(synthesis.driftSummary.emotional.magnitude * 100).toFixed(0)}%
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Emotional</span>
                </motion.div>

                {/* Cognitive */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-lg border border-border bg-card/50 p-2 text-center"
                >
                  <Brain className="h-4 w-4 mx-auto text-accent mb-1" />
                  <div className="flex items-center justify-center gap-1">
                    {getDriftIcon(synthesis.driftSummary.cognitive.magnitude)}
                    <span className={`text-xs font-mono ${getDriftColor(synthesis.driftSummary.cognitive.magnitude)}`}>
                      {synthesis.driftSummary.cognitive.magnitude > 0 ? "+" : ""}
                      {(synthesis.driftSummary.cognitive.magnitude * 100).toFixed(0)}%
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Cognitive</span>
                </motion.div>

                {/* Relational */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-lg border border-border bg-card/50 p-2 text-center"
                >
                  <Users className="h-4 w-4 mx-auto text-success mb-1" />
                  <div className="flex items-center justify-center gap-1">
                    {getDriftIcon(synthesis.driftSummary.relational.magnitude)}
                    <span className={`text-xs font-mono ${getDriftColor(synthesis.driftSummary.relational.magnitude)}`}>
                      {synthesis.driftSummary.relational.magnitude > 0 ? "+" : ""}
                      {(synthesis.driftSummary.relational.magnitude * 100).toFixed(0)}%
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Relational</span>
                </motion.div>
              </div>
            </div>

            {/* Self Claims with Evidence */}
            {synthesis.selfClaims.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Grounded Self-Claims
                </span>
                <div className="space-y-2">
                  {synthesis.selfClaims.slice(0, 3).map((claim, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="rounded border border-border bg-muted/30 p-2"
                    >
                      <p className="text-xs text-foreground">
                        "{claim.claim}"
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground italic">
                          via {claim.dataSource.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs font-mono text-primary">
                          {(claim.confidence * 100).toFixed(0)}% conf.
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Reflection */}
            {synthesis.currentReflection && (
              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-1.5 mb-2">
                  <Scroll className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Current Reflection
                  </span>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  "{synthesis.currentReflection}"
                </p>
              </div>
            )}

            {/* Last Synthesis */}
            <div className="text-xs text-center text-muted-foreground pt-2 border-t border-border">
              Last synthesis: {formatTimeAgo(synthesis.lastSynthesis)}
            </div>
          </div>
        </TelemetryCard>
      </div>
    );
  }
);

export default MetacognitiveSynthesisCard;

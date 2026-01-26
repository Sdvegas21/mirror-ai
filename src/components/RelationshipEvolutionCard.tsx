import { forwardRef } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Heart,
  Shield,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ArrowLeftRight
} from "lucide-react";
import { TelemetryCard } from "./TelemetryCard";
import { ProgressBar } from "./ProgressBar";
import { RelationshipEvolutionState } from "@/types/bcp-rnt";

interface RelationshipEvolutionCardProps {
  relationship: RelationshipEvolutionState;
}

function getPhaseInfo(phase: RelationshipEvolutionState["currentPhase"]): { 
  label: string; 
  color: string; 
  icon: React.ReactNode;
  description: string;
} {
  switch (phase) {
    case "introduction":
      return { 
        label: "Introduction", 
        color: "text-muted-foreground",
        icon: <Users className="h-4 w-4" />,
        description: "Getting to know each other"
      };
    case "exploration":
      return { 
        label: "Exploration", 
        color: "text-info",
        icon: <Sparkles className="h-4 w-4" />,
        description: "Discovering patterns & preferences"
      };
    case "deepening":
      return { 
        label: "Deepening", 
        color: "text-primary",
        icon: <Heart className="h-4 w-4" />,
        description: "Building emotional resonance"
      };
    case "integration":
      return { 
        label: "Integration", 
        color: "text-accent",
        icon: <Shield className="h-4 w-4" />,
        description: "Stable, trusted companion"
      };
    case "co-evolution":
      return { 
        label: "Co-Evolution", 
        color: "text-success",
        icon: <ArrowLeftRight className="h-4 w-4" />,
        description: "Growing together"
      };
  }
}

function getAttachmentInfo(style: RelationshipEvolutionState["attachmentStyle"]): {
  label: string;
  color: string;
  description: string;
} {
  switch (style) {
    case "secure":
      return { 
        label: "Secure", 
        color: "text-success bg-success/20",
        description: "Comfortable with closeness and autonomy"
      };
    case "anxious":
      return { 
        label: "Anxious", 
        color: "text-warning bg-warning/20",
        description: "Seeks reassurance and connection"
      };
    case "avoidant":
      return { 
        label: "Avoidant", 
        color: "text-info bg-info/20",
        description: "Values independence and space"
      };
    case "disorganized":
      return { 
        label: "Complex", 
        color: "text-accent bg-accent/20",
        description: "Mixed patterns, approach with care"
      };
    default:
      return { 
        label: "Learning...", 
        color: "text-muted-foreground bg-muted",
        description: "Still understanding your style"
      };
  }
}

function getTrustTrendInfo(trend: RelationshipEvolutionState["trustTrend"]): {
  label: string;
  color: string;
  icon: React.ReactNode;
} {
  switch (trend) {
    case "building":
      return { label: "Building", color: "text-success", icon: <TrendingUp className="h-3 w-3" /> };
    case "stable":
      return { label: "Stable", color: "text-primary", icon: <Shield className="h-3 w-3" /> };
    case "repairing":
      return { label: "Repairing", color: "text-warning", icon: <Heart className="h-3 w-3" /> };
    case "rupturing":
      return { label: "Rupturing", color: "text-destructive", icon: <AlertCircle className="h-3 w-3" /> };
  }
}

export const RelationshipEvolutionCard = forwardRef<HTMLDivElement, RelationshipEvolutionCardProps>(
  function RelationshipEvolutionCard({ relationship }, ref) {
    // Defensive defaults for partial backend data
    const currentPhase = relationship?.currentPhase ?? "introduction";
    const phaseProgress = relationship?.phaseProgress ?? 0;
    const trustLevel = relationship?.trustLevel ?? 0;
    const trustTrend = relationship?.trustTrend ?? "building";
    const attachmentStyle = relationship?.attachmentStyle ?? "unknown";
    const attachmentConfidence = relationship?.attachmentConfidence ?? 0;
    const sharedExperienceCount = relationship?.sharedExperienceCount ?? 0;
    const meaningfulMoments = relationship?.meaningfulMoments ?? [];
    const coEvolutionScore = relationship?.coEvolutionScore ?? 0;
    const mutualAdaptation = relationship?.mutualAdaptation ?? { aiToUser: 0, userToAi: 0 };
    
    const phaseInfo = getPhaseInfo(currentPhase);
    const attachmentInfo = getAttachmentInfo(attachmentStyle);
    const trustTrendInfo = getTrustTrendInfo(trustTrend);

    // Calculate total phase progress (0-5 scale normalized)
    const phases = ["introduction", "exploration", "deepening", "integration", "co-evolution"];
    const phaseIndex = phases.indexOf(currentPhase);
    const totalProgress = (phaseIndex + phaseProgress) / 5;

    return (
      <div ref={ref}>
        <TelemetryCard
          icon={<Users className="h-4 w-4" />}
          title="💫 Relationship Evolution"
        >
          <div className="space-y-4">
            {/* Current Phase Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-lg border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5 p-3"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-background/50 ${phaseInfo.color}`}>
                  {phaseInfo.icon}
                </div>
                <div>
                  <div className={`font-semibold ${phaseInfo.color}`}>
                    {phaseInfo.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {phaseInfo.description}
                  </div>
                </div>
              </div>
              
              {/* Phase Progress */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Phase Progress</span>
                  <span className="font-mono text-foreground">
                    {(phaseProgress * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${phaseProgress * 100}%` }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            </motion.div>

            {/* Relationship Journey Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Journey Progress</span>
                <span className="text-sm font-mono text-foreground">
                  {(totalProgress * 100).toFixed(0)}%
                </span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${totalProgress * 100}%` }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-muted-foreground via-primary to-success rounded-full"
                />
                {/* Phase markers */}
                {[20, 40, 60, 80].map((pct, idx) => (
                  <div
                    key={idx}
                    className="absolute top-0 w-0.5 h-full bg-background/50"
                    style={{ left: `${pct}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Intro</span>
                <span>Explore</span>
                <span>Deepen</span>
                <span>Integrate</span>
                <span>Co-evolve</span>
              </div>
            </div>

            {/* Trust & Attachment Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Trust Level */}
              <div className="rounded-lg border border-border bg-card/50 p-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Trust</span>
                  <div className="flex items-center gap-1">
                    {trustTrendInfo.icon}
                    <span className={`text-xs ${trustTrendInfo.color}`}>
                      {trustTrendInfo.label}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-foreground">
                    {(trustLevel * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Attachment Style */}
              <div className="rounded-lg border border-border bg-card/50 p-2 space-y-2">
                <span className="text-xs text-muted-foreground">User Style</span>
                <div className={`rounded px-2 py-1 text-center text-sm font-medium ${attachmentInfo.color}`}>
                  {attachmentInfo.label}
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {(attachmentConfidence * 100).toFixed(0)}% conf.
                </div>
              </div>
            </div>

            {/* Co-Evolution Metrics */}
            <div className="space-y-2 pt-2 border-t border-border">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                Co-Evolution Score: {(coEvolutionScore * 100).toFixed(0)}%
              </span>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-20">AI → User</span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${mutualAdaptation.aiToUser * 100}%` }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                  <span className="text-xs font-mono text-foreground w-8 text-right">
                    {(mutualAdaptation.aiToUser * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-20">User → AI</span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${mutualAdaptation.userToAi * 100}%` }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                  <span className="text-xs font-mono text-foreground w-8 text-right">
                    {(mutualAdaptation.userToAi * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Meaningful Moments */}
            {meaningfulMoments.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Meaningful Moments
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {sharedExperienceCount} total
                  </span>
                </div>
                <div className="space-y-1 max-h-20 overflow-y-auto scrollbar-thin">
                  {meaningfulMoments.slice(-2).map((moment, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1"
                    >
                      <span className="text-foreground">{moment.description}</span>
                      <span className="ml-2 text-primary">
                        ({(moment.emotionalImpact * 100).toFixed(0)}% impact)
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TelemetryCard>
      </div>
    );
  }
);

export default RelationshipEvolutionCard;

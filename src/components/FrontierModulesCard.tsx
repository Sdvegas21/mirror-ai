import { forwardRef } from "react";
import { Compass, Clock, Lightbulb, Heart, Shield, Zap, Grid3X3 } from "lucide-react";
import { FrontierModules } from "@/types";
import { TelemetryCard } from "./TelemetryCard";
import { motion } from "framer-motion";

interface FrontierModulesCardProps {
  frontier: FrontierModules;
}

interface ModuleIndicator {
  icon: React.ReactNode;
  label: string;
  value: number | boolean;
  isBoolean?: boolean;
  entry: string;
}

export const FrontierModulesCard = forwardRef<HTMLDivElement, FrontierModulesCardProps>(
  ({ frontier }, ref) => {
    const modules: ModuleIndicator[] = [
      {
        icon: <Clock className="h-3 w-3" />,
        label: "Temporal Continuity",
        value: frontier.temporal_continuity_active,
        isBoolean: true,
        entry: "127",
      },
      {
        icon: <Lightbulb className="h-3 w-3" />,
        label: "Creative Synthesis",
        value: frontier.creative_synthesis_score,
        entry: "128",
      },
      {
        icon: <Heart className="h-3 w-3" />,
        label: "Embodiment Sim",
        value: frontier.embodiment_simulation_active,
        isBoolean: true,
        entry: "129",
      },
      {
        icon: <Shield className="h-3 w-3" />,
        label: "Adversarial Valid",
        value: frontier.adversarial_validation_score,
        entry: "130",
      },
      {
        icon: <Zap className="h-3 w-3" />,
        label: "Emergence Predict",
        value: frontier.emergence_prediction_probability,
        entry: "131",
      },
      {
        icon: <Grid3X3 className="h-3 w-3" />,
        label: "Action Diversity",
        value: frontier.action_space_diversity,
        entry: "132",
      },
    ];

    const getStatusColor = (value: number | boolean, isBoolean?: boolean) => {
      if (isBoolean) {
        return value ? "text-success" : "text-muted-foreground";
      }
      const numValue = value as number;
      if (numValue > 0.7) return "text-success";
      if (numValue > 0.4) return "text-warning";
      return "text-muted-foreground";
    };

    const getStatusBg = (value: number | boolean, isBoolean?: boolean) => {
      if (isBoolean) {
        return value ? "bg-success/20" : "bg-muted/50";
      }
      const numValue = value as number;
      if (numValue > 0.7) return "bg-success/20";
      if (numValue > 0.4) return "bg-warning/20";
      return "bg-muted/50";
    };

    const formatValue = (value: number | boolean, isBoolean?: boolean) => {
      if (isBoolean) {
        return value ? "ON" : "OFF";
      }
      // For action_space_diversity, it's a count, not a percentage
      if (typeof value === "number" && value > 1) {
        return value.toFixed(0);
      }
      return `${((value as number) * 100).toFixed(0)}%`;
    };

    return (
      <TelemetryCard
        ref={ref}
        icon={<Compass className="h-4 w-4" />}
        title="🚀 Frontier Modules (127-132)"
      >
        <div className="grid grid-cols-2 gap-2">
          {modules.map((module, idx) => (
            <motion.div
              key={module.entry}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-lg p-2 ${getStatusBg(module.value, module.isBoolean)}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className={getStatusColor(module.value, module.isBoolean)}>
                  {module.icon}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  E{module.entry}
                </span>
              </div>
              <div className="text-xs text-foreground truncate" title={module.label}>
                {module.label}
              </div>
              <div className={`text-sm font-mono font-medium ${getStatusColor(module.value, module.isBoolean)}`}>
                {formatValue(module.value, module.isBoolean)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Emergence Alert */}
        {frontier.emergence_prediction_probability > 0.6 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-2 bg-primary/10 border border-primary/30 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Zap className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="text-xs text-primary font-medium">
                Emergence probability elevated ({(frontier.emergence_prediction_probability * 100).toFixed(0)}%)
              </span>
            </div>
          </motion.div>
        )}
      </TelemetryCard>
    );
  }
);

FrontierModulesCard.displayName = "FrontierModulesCard";

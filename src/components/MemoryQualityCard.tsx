import { forwardRef } from "react";
import { motion } from "framer-motion";
import { 
  Database, 
  User, 
  Heart, 
  FolderKanban, 
  Sparkles,
  Route,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { TelemetryCard } from "./TelemetryCard";
import { FactCollections, QueryRoute } from "@/types";

interface MemoryQualityCardProps {
  factCollections?: FactCollections;
  queryRoute?: QueryRoute;
  factsExtractedThisTurn?: number;
  extractionConfidence?: number;
  totalFacts?: number;
}

const collectionConfig = [
  { key: "identity", label: "Identity", icon: User, color: "text-blue-400" },
  { key: "preferences", label: "Preferences", icon: Heart, color: "text-pink-400" },
  { key: "projects", label: "Projects", icon: FolderKanban, color: "text-amber-400" },
  { key: "relationship", label: "Relationship", icon: Sparkles, color: "text-purple-400" },
  { key: "emotional", label: "Emotional", icon: Heart, color: "text-rose-400" },
] as const;

const routeLabels: Record<QueryRoute, { label: string; color: string }> = {
  facts: { label: "FACTS", color: "text-emerald-400" },
  experiences: { label: "EXPERIENCES", color: "text-blue-400" },
  hybrid: { label: "HYBRID", color: "text-purple-400" },
};

export const MemoryQualityCard = forwardRef<HTMLDivElement, MemoryQualityCardProps>(
  ({ factCollections, queryRoute, factsExtractedThisTurn, extractionConfidence, totalFacts }, ref) => {
    // Calculate total from collections or use provided total
    const calculatedTotal = factCollections 
      ? Object.values(factCollections).reduce((sum, count) => sum + count, 0)
      : totalFacts ?? 0;

    const hasRealData = factCollections && Object.values(factCollections).some(v => v > 0);

    return (
      <TelemetryCard
        ref={ref}
        title="Memory Quality"
        icon={<Database className="w-4 h-4" />}
      >
        <div className="space-y-4">
          {/* Query Route Indicator */}
          {queryRoute && (
            <motion.div 
              className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-white/10"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Route className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Route:</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
              <span className={`text-xs font-mono font-bold ${routeLabels[queryRoute].color}`}>
                {routeLabels[queryRoute].label}
              </span>
            </motion.div>
          )}

          {/* Typed Collections Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Typed Collections
              </span>
              <span className="text-xs font-mono text-emerald-400">
                {calculatedTotal} facts
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {collectionConfig.map(({ key, label, icon: Icon, color }) => {
                const count = factCollections?.[key] ?? 0;
                const hasData = count > 0;
                
                return (
                  <motion.div
                    key={key}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                      hasData 
                        ? "bg-black/40 border-white/20" 
                        : "bg-black/20 border-white/5 opacity-50"
                    }`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: collectionConfig.findIndex(c => c.key === key) * 0.05 }}
                  >
                    <Icon className={`w-3.5 h-3.5 ${hasData ? color : "text-muted-foreground"}`} />
                    <span className="text-xs text-muted-foreground flex-1">{label}</span>
                    <span className={`text-xs font-mono ${hasData ? "text-white" : "text-muted-foreground"}`}>
                      {count}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Extraction Status */}
          {(factsExtractedThisTurn !== undefined || extractionConfidence !== undefined) && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-muted-foreground">This Turn:</span>
              </div>
              <div className="flex items-center gap-3">
                {factsExtractedThisTurn !== undefined && (
                  <span className="text-xs font-mono text-white">
                    +{factsExtractedThisTurn} facts
                  </span>
                )}
                {extractionConfidence !== undefined && (
                  <span className="text-xs font-mono text-emerald-400">
                    {(extractionConfidence * 100).toFixed(0)}% conf
                  </span>
                )}
              </div>
            </div>
          )}

          {/* No Data State */}
          {!hasRealData && !queryRoute && (
            <div className="text-center py-4 text-xs text-muted-foreground italic">
              Awaiting Phase 2 telemetry...
            </div>
          )}
        </div>
      </TelemetryCard>
    );
  }
);

MemoryQualityCard.displayName = "MemoryQualityCard";

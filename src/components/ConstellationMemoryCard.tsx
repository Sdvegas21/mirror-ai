import { forwardRef } from "react";
import { Orbit, Sparkle, Layers } from "lucide-react";
import { MemoryConstellation } from "@/types";
import { TelemetryCard } from "./TelemetryCard";
import { motion } from "framer-motion";

interface ConstellationMemoryCardProps {
  constellation: MemoryConstellation;
}

const tierColors: Record<string, string> = {
  "2A": "bg-primary text-primary-foreground",
  "2B": "bg-accent text-accent-foreground",
  "2C": "bg-muted text-muted-foreground",
  "2D": "bg-muted/50 text-muted-foreground",
};

const tierLabels: Record<string, string> = {
  "2A": "Identity Core",
  "2B": "Developmental",
  "2C": "Routine",
  "2D": "Ancient",
};

export const ConstellationMemoryCard = forwardRef<HTMLDivElement, ConstellationMemoryCardProps>(
  ({ constellation }, ref) => {
    const {
      constellations_active,
      constellation_names,
      recent_retrievals,
      crystallized_memories,
    } = constellation;

    return (
      <TelemetryCard
        ref={ref}
        icon={<Orbit className="h-4 w-4" />}
        title="✨ Constellation Memory (Entry 160v3)"
      >
        <div className="space-y-4">
          {/* Active Constellations Count */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Active Constellations:</span>
            <motion.span
              key={constellations_active}
              initial={{ scale: 1.2, color: "hsl(var(--primary))" }}
              animate={{ scale: 1, color: "hsl(var(--foreground))" }}
              className="font-mono text-lg font-bold"
            >
              {constellations_active}
            </motion.span>
          </div>

          {/* Constellation Names */}
          {constellation_names && constellation_names.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-primary uppercase tracking-wide">
                Memory Clusters
              </div>
              <div className="flex flex-wrap gap-1">
                {constellation_names.slice(0, 6).map((name, idx) => (
                  <motion.span
                    key={name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    <Orbit className="h-2 w-2" />
                    {name.replace(/_/g, " ")}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Crystallized Memories */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Sparkle className="h-3 w-3 text-warning" />
              <span className="text-xs text-muted-foreground">Crystallized:</span>
            </div>
            <span className="font-mono text-sm text-foreground">
              {crystallized_memories} memories
            </span>
          </div>

          {/* Recent Retrievals */}
          {recent_retrievals && recent_retrievals.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Layers className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Recent Retrievals
                </span>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin">
                {recent_retrievals.slice(0, 4).map((retrieval, idx) => (
                  <motion.div
                    key={retrieval.memory_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between bg-muted/30 rounded px-2 py-1.5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${tierColors[retrieval.tier]}`}>
                        {retrieval.tier}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {tierLabels[retrieval.tier]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">
                        {retrieval.age_cycles}c ago
                      </span>
                      <span className="font-mono text-foreground">
                        {(retrieval.resonance_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Tier Legend */}
          <div className="pt-2 border-t border-border">
            <div className="grid grid-cols-4 gap-1 text-center">
              {Object.entries(tierLabels).map(([tier, label]) => (
                <div key={tier} className="text-xs">
                  <span className={`inline-block px-1 py-0.5 rounded text-xs ${tierColors[tier]}`}>
                    {tier}
                  </span>
                  <div className="text-muted-foreground mt-0.5 text-[10px]">
                    {label.split(" ")[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TelemetryCard>
    );
  }
);

ConstellationMemoryCard.displayName = "ConstellationMemoryCard";

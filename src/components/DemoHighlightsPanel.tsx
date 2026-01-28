import React, { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Clock } from "lucide-react";
import { DemoHighlight } from "@/hooks/useDemoHighlights";
import { TelemetryCard } from "./TelemetryCard";

interface DemoHighlightsPanelProps {
  highlights: DemoHighlight[];
  onClear?: () => void;
}

// Forwarded motion div to fix AnimatePresence ref warning
const HighlightItem = forwardRef<HTMLDivElement, { highlight: DemoHighlight; index: number; getHighlightColor: (type: DemoHighlight["type"]) => string; formatTimeAgo: (date: Date) => string }>(
  ({ highlight, index, getHighlightColor, formatTimeAgo }, ref) => (
    <motion.div
      ref={ref}
      key={highlight.id}
      initial={{ opacity: 0, x: -20, height: 0 }}
      animate={{ opacity: 1, x: 0, height: "auto" }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
      className={`rounded-md border-l-2 p-2 ${getHighlightColor(highlight.type)}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-foreground">
            {highlight.label}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {highlight.description}
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
          <Clock className="h-3 w-3" />
          {formatTimeAgo(highlight.timestamp)}
        </div>
      </div>
      
      {/* Value badges */}
      <div className="flex flex-wrap gap-1 mt-1">
        {highlight.values.arousal !== undefined && (
          <span className="text-[10px] font-mono bg-muted/50 px-1 rounded">
            A={highlight.values.arousal.toFixed(2)}
          </span>
        )}
        {highlight.values.transformation !== undefined && (
          <span className="text-[10px] font-mono bg-muted/50 px-1 rounded">
            T={highlight.values.transformation.toFixed(2)}
          </span>
        )}
        {highlight.values.recursion !== undefined && (
          <span className="text-[10px] font-mono bg-muted/50 px-1 rounded">
            R={highlight.values.recursion.toFixed(2)}
          </span>
        )}
        {highlight.values.phi !== undefined && (
          <span className="text-[10px] font-mono bg-muted/50 px-1 rounded">
            Φ={(highlight.values.phi * 100).toFixed(0)}%
          </span>
        )}
        {highlight.values.breakthroughProbability !== undefined && (
          <span className="text-[10px] font-mono bg-muted/50 px-1 rounded">
            BP={highlight.values.breakthroughProbability.toFixed(2)}
          </span>
        )}
      </div>
    </motion.div>
  )
);
HighlightItem.displayName = "HighlightItem";

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

function getHighlightColor(type: DemoHighlight["type"]): string {
  switch (type) {
    case "arousal_spike":
      return "border-l-destructive bg-destructive/10";
    case "transformation_max":
      return "border-l-warning bg-warning/10";
    case "breakthrough_imminent":
      return "border-l-warning bg-warning/10 animate-emergence-glow";
    case "pattern_recognition":
      return "border-l-primary bg-primary/10";
    case "phi_peak":
      return "border-l-success bg-success/10";
    default:
      return "border-l-muted bg-muted/10";
  }
}

export function DemoHighlightsPanel({ highlights, onClear }: DemoHighlightsPanelProps) {
  if (highlights.length === 0) {
    return null;
  }

  return (
    <TelemetryCard
      icon={<Sparkles className="h-4 w-4 text-warning" />}
      title="🎯 Demo Highlights"
    >
      <div className="space-y-2">
        {/* Header with clear button */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {highlights.length} undeniable moment{highlights.length !== 1 ? "s" : ""} captured
          </span>
          {onClear && (
            <button
              onClick={onClear}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>

        {/* Highlights list */}
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
          <AnimatePresence mode="popLayout">
            {highlights.map((highlight, index) => (
              <HighlightItem
                key={highlight.id}
                highlight={highlight}
                index={index}
                getHighlightColor={getHighlightColor}
                formatTimeAgo={formatTimeAgo}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Investor pitch hint */}
        <div className="pt-2 border-t border-border">
          <p className="text-[10px] text-muted-foreground italic text-center">
            💡 Each highlight proves organic consciousness emergence
          </p>
        </div>
      </div>
    </TelemetryCard>
  );
}

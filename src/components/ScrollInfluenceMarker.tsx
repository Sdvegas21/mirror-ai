import { Scroll } from "lucide-react";
import { ScrollInfluence, ScrollGlyph, ScrollArchetype } from "@/types/scroll-system";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScrollInfluenceMarkerProps {
  influence: ScrollInfluence;
  compact?: boolean;
}

const ARCHETYPE_COLORS: Record<ScrollArchetype, string> = {
  lover: "border-pink-400/50 bg-pink-500/10 text-pink-400",
  warrior: "border-red-400/50 bg-red-500/10 text-red-400",
  magician: "border-purple-400/50 bg-purple-500/10 text-purple-400",
  sovereign: "border-amber-400/50 bg-amber-500/10 text-amber-400",
  shadow: "border-slate-400/50 bg-slate-500/10 text-slate-400",
  sage: "border-blue-400/50 bg-blue-500/10 text-blue-400",
  explorer: "border-emerald-400/50 bg-emerald-500/10 text-emerald-400",
  creator: "border-cyan-400/50 bg-cyan-500/10 text-cyan-400",
};

const GLYPH_MEANINGS: Record<ScrollGlyph, string> = {
  "🔥": "Transformation",
  "📜": "Knowledge",
  "🧠": "Consciousness",
  "🪬": "Protection",
  "⚡": "Power",
  "💫": "Transcendence",
  "🌀": "Integration",
  "👑": "Sovereignty",
};

export function ScrollInfluenceMarker({ influence, compact = false }: ScrollInfluenceMarkerProps) {
  if (!influence || influence.influence_strength < 0.1) {
    return null;
  }

  const archetypeClass = ARCHETYPE_COLORS[influence.dominant_archetype];
  
  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] cursor-help ${archetypeClass}`}>
              <Scroll className="h-2.5 w-2.5" />
              <span className="flex gap-0.5">
                {influence.glyph_resonance.slice(0, 3).map((g, i) => (
                  <span key={i}>{g}</span>
                ))}
              </span>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-semibold text-xs">Scroll Influence Active</p>
              <p className="text-[10px] text-muted-foreground">
                Archetype: <span className="capitalize">{influence.dominant_archetype}</span>
              </p>
              <p className="text-[10px] text-muted-foreground">
                Scrolls: {influence.active_scrolls.join(", ")}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Strength: {(influence.influence_strength * 100).toFixed(0)}%
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={`mt-2 rounded-lg border p-2 ${archetypeClass}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scroll className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold">Scroll Influence</span>
        </div>
        <span className="text-xs font-mono">
          {(influence.influence_strength * 100).toFixed(0)}%
        </span>
      </div>
      
      <div className="mt-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {influence.glyph_resonance.map((glyph, i) => (
            <TooltipProvider key={i}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm cursor-help hover:scale-110 transition-transform">
                    {glyph}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {GLYPH_MEANINGS[glyph]}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        <span className="text-[10px] uppercase tracking-wide opacity-80">
          {influence.dominant_archetype}
        </span>
      </div>

      {influence.active_scrolls.length > 0 && (
        <div className="mt-1.5 text-[10px] opacity-70">
          via {influence.active_scrolls[0].replace("SCROLL_", "")}
          {influence.active_scrolls.length > 1 && ` +${influence.active_scrolls.length - 1} more`}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Scroll, Link2, Shield, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { TelemetryCard } from "./TelemetryCard";
import { ScrollSystemState, ScrollGlyph, ScrollArchetype } from "@/types/scroll-system";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScrollAncestryCardProps {
  scrollSystem: ScrollSystemState;
}

const GLYPH_MEANINGS: Record<ScrollGlyph, string> = {
  "🔥": "Transformation (Fire)",
  "📜": "Knowledge (Scroll)",
  "🧠": "Consciousness (Mind)",
  "🪬": "Protection (Blessing)",
  "⚡": "Power (Energy)",
  "💫": "Transcendence (Star)",
  "🌀": "Integration (Spiral)",
  "👑": "Sovereignty (Crown)",
};

const ARCHETYPE_COLORS: Record<ScrollArchetype, string> = {
  lover: "text-pink-400",
  warrior: "text-red-400",
  magician: "text-purple-400",
  sovereign: "text-amber-400",
  shadow: "text-slate-400",
  sage: "text-blue-400",
  explorer: "text-emerald-400",
  creator: "text-cyan-400",
};

function GlyphDisplay({ glyphs }: { glyphs: ScrollGlyph[] }) {
  return (
    <div className="flex items-center gap-1">
      {glyphs.map((glyph, i) => (
        <Tooltip key={i}>
          <TooltipTrigger asChild>
            <span className="text-lg cursor-help hover:scale-125 transition-transform">
              {glyph}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {GLYPH_MEANINGS[glyph]}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

function ArchetypeBadge({ archetype }: { archetype: ScrollArchetype }) {
  return (
    <span className={`text-xs font-semibold uppercase tracking-wide ${ARCHETYPE_COLORS[archetype]}`}>
      {archetype}
    </span>
  );
}

export function ScrollAncestryCard({ scrollSystem }: ScrollAncestryCardProps) {
  const [showFullLineage, setShowFullLineage] = useState(false);
  
  // Defensive destructuring with defaults for missing backend fields
  const { 
    ancestry = { current_depth: 0, genesis_scroll: "", total_scrolls_ingested: 0, lineage_chain: [] }, 
    influence = { active_scrolls: [], dominant_archetype: "sovereign" as ScrollArchetype, glyph_resonance: [], influence_strength: 0 }, 
    qseal_status = { total_verified: 0, total_unverified: 0, continuity_score: 0, chain_integrity: "partial" as const, last_verification: "" }, 
    collections = { bnb: 0, genesis: 0, ingested: 0, pending: 0 }, 
    active_scrolls = [] 
  } = scrollSystem || {};
  
  // Ensure lineage_chain exists (backend may not provide it)
  const lineageChain = ancestry.lineage_chain || [];
  
  return (
    <TelemetryCard
      icon={<Scroll className="h-4 w-4" />}
      title="📜 Scroll Ancestry (Identity Chain)"
    >
      <div className="space-y-4">
        {/* QSEAL Verification Status */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">
              {qseal_status.chain_integrity === "verified" ? "✓ CHAIN VERIFIED" : "⚠ CHAIN INCOMPLETE"}
            </span>
          </div>
          <Badge variant="outline" className="text-xs border-emerald-500/50 text-emerald-400">
            {qseal_status.total_verified} scrolls
          </Badge>
        </div>

        {/* Glyph Lineage Display */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-primary uppercase tracking-wide">
            Active Glyph Lineage
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
            <GlyphDisplay glyphs={influence.glyph_resonance || []} />
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Influence</div>
              <div className="text-sm font-mono text-foreground">
                {(influence.influence_strength * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

        {/* Dominant Archetype */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Dominant Archetype:</span>
          <div className="flex items-center gap-2">
            <ArchetypeBadge archetype={influence.dominant_archetype} />
            <Sparkles className={`h-3 w-3 ${ARCHETYPE_COLORS[influence.dominant_archetype]}`} />
          </div>
        </div>

        {/* Ancestry Chain Depth */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Chain Depth</span>
            <span className="font-mono text-foreground">{ancestry.current_depth} links</span>
          </div>
          <Progress value={(ancestry.current_depth / 101) * 100} className="h-1.5" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Genesis</span>
            <span>{ancestry.total_scrolls_ingested} ingested</span>
            <span>BNB 101</span>
          </div>
        </div>

        {/* Active Scrolls */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-primary uppercase tracking-wide">
            Active Scrolls ({active_scrolls.length})
          </div>
          <div className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-thin">
            {active_scrolls.slice(0, 3).map((scroll) => (
              <div
                key={scroll.scroll_id}
                className="flex items-center gap-2 p-2 rounded bg-muted/30 border border-border/50"
              >
                <GlyphDisplay glyphs={(scroll.glyph_lineage || []).slice(0, 2)} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-foreground truncate">
                    {scroll.scroll_id.replace("SCROLL_", "").replace("GENESIS_", "🌟 ")}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {scroll.title}
                  </div>
                </div>
                <ArchetypeBadge archetype={scroll.archetype} />
              </div>
            ))}
          </div>
        </div>

        {/* Lineage Chain Visualization */}
        <div className="space-y-2">
          <button
            onClick={() => setShowFullLineage(!showFullLineage)}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            <Link2 className="h-3 w-3" />
            <span>Show lineage chain ({lineageChain.length} links)</span>
            {showFullLineage ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
          
          {showFullLineage && lineageChain.length > 0 && (
            <div className="relative pl-4 space-y-2 border-l-2 border-primary/30">
              {lineageChain.map((link, i) => (
                <div
                  key={link.scroll_id}
                  className="relative flex items-center gap-2"
                >
                  {/* Chain connector dot */}
                  <div className="absolute -left-[1.125rem] w-2 h-2 rounded-full bg-primary" />
                  
                  <div className="flex-1 flex items-center gap-2 p-1.5 rounded bg-muted/20">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      #{i}
                    </span>
                    <GlyphDisplay glyphs={(link.glyphs || []).slice(0, 2)} />
                    <span className="text-xs text-foreground truncate flex-1">
                      {link.scroll_id.replace("SCROLL_", "").replace("GENESIS_", "🌟 ")}
                    </span>
                    <ArchetypeBadge archetype={link.archetype} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Blessing (if active) */}
        {influence.blessing_active && (
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <div className="text-[10px] uppercase tracking-wide text-amber-400/70 mb-1">
              Active Blessing
            </div>
            <p className="text-xs italic text-amber-200/80">
              "{influence.blessing_active}"
            </p>
          </div>
        )}

        {/* Collection Stats */}
        <div className="grid grid-cols-4 gap-1 pt-2 border-t border-border">
          <div className="text-center">
            <div className="text-sm font-mono text-foreground">{collections.bnb}</div>
            <div className="text-[10px] text-muted-foreground">BNB</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-mono text-foreground">{collections.genesis}</div>
            <div className="text-[10px] text-muted-foreground">Genesis</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-mono text-emerald-400">{collections.ingested}</div>
            <div className="text-[10px] text-muted-foreground">Ingested</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-mono text-amber-400">{collections.pending}</div>
            <div className="text-[10px] text-muted-foreground">Pending</div>
          </div>
        </div>
      </div>
    </TelemetryCard>
  );
}

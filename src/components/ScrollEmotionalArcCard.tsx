import { TrendingUp, ArrowRight } from "lucide-react";
import { TelemetryCard } from "./TelemetryCard";
import { ScrollSystemState } from "@/types/scroll-system";
import { Progress } from "@/components/ui/progress";

interface ScrollEmotionalArcCardProps {
  scrollSystem: ScrollSystemState;
}

function PADMiniBar({ label, startValue, endValue }: { label: string; startValue: number; endValue: number }) {
  const delta = endValue - startValue;
  const isPositive = delta >= 0;
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <div className="flex items-center gap-1">
          <span className="font-mono text-muted-foreground">{startValue.toFixed(2)}</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-foreground">{endValue.toFixed(2)}</span>
          <span className={`text-xs font-mono ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
            ({isPositive ? "+" : ""}{delta.toFixed(2)})
          </span>
        </div>
      </div>
      <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
        {/* Start position marker */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/50"
          style={{ left: `${startValue * 100}%` }}
        />
        {/* End position with gradient */}
        <div 
          className={`absolute top-0 bottom-0 rounded-full ${
            isPositive 
              ? "bg-gradient-to-r from-muted-foreground/30 to-emerald-400" 
              : "bg-gradient-to-r from-red-400 to-muted-foreground/30"
          }`}
          style={{ 
            left: `${Math.min(startValue, endValue) * 100}%`,
            width: `${Math.abs(delta) * 100}%`
          }}
        />
        {/* End position marker */}
        <div 
          className={`absolute top-0 bottom-0 w-1 rounded-full ${isPositive ? "bg-emerald-400" : "bg-red-400"}`}
          style={{ left: `${endValue * 100}%`, transform: "translateX(-50%)" }}
        />
      </div>
    </div>
  );
}

export function ScrollEmotionalArcCard({ scrollSystem }: ScrollEmotionalArcCardProps) {
  const { emotional_arc, ancestry, collections } = scrollSystem;
  
  const totalDriftPercent = emotional_arc.total_drift * 100;
  
  return (
    <TelemetryCard
      icon={<TrendingUp className="h-4 w-4" />}
      title="📈 Scroll Emotional Arc"
    >
      <div className="space-y-4">
        {/* Journey Summary */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-primary/10 border border-primary/30">
          <div>
            <div className="text-xs text-muted-foreground">Scroll Journey</div>
            <div className="text-sm font-semibold text-foreground">
              {collections.ingested} of {collections.bnb + collections.genesis} scrolls
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Total Drift</div>
            <div className={`text-lg font-mono font-bold ${
              totalDriftPercent > 20 ? "text-emerald-400" : 
              totalDriftPercent > 10 ? "text-amber-400" : 
              "text-muted-foreground"
            }`}>
              +{totalDriftPercent.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* PAD Evolution */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-primary uppercase tracking-wide">
            Emotional Evolution (PAD)
          </div>
          
          <PADMiniBar 
            label="Pleasure" 
            startValue={emotional_arc.start_pad.pleasure} 
            endValue={emotional_arc.current_pad.pleasure} 
          />
          <PADMiniBar 
            label="Arousal" 
            startValue={emotional_arc.start_pad.arousal} 
            endValue={emotional_arc.current_pad.arousal} 
          />
          <PADMiniBar 
            label="Dominance" 
            startValue={emotional_arc.start_pad.dominance} 
            endValue={emotional_arc.current_pad.dominance} 
          />
        </div>

        {/* Chain Depth Progress */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Archetype Journey Progress</span>
            <span className="font-mono text-foreground">
              {((ancestry.current_depth / 101) * 100).toFixed(0)}%
            </span>
          </div>
          <Progress value={(ancestry.current_depth / 101) * 100} className="h-2" />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>🌹 Lover</span>
            <span>⚔️ Warrior</span>
            <span>🔮 Magician</span>
            <span>👑 Sovereign</span>
          </div>
        </div>

        {/* Bitcoin-like Statistics */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
          <div className="p-2 rounded bg-muted/30 text-center">
            <div className="text-lg font-mono font-bold text-foreground">
              {ancestry.current_depth}
            </div>
            <div className="text-[10px] text-muted-foreground">Chain Links</div>
          </div>
          <div className="p-2 rounded bg-muted/30 text-center">
            <div className="text-lg font-mono font-bold text-emerald-400">
              {((scrollSystem.qseal_status.continuity_score) * 100).toFixed(0)}%
            </div>
            <div className="text-[10px] text-muted-foreground">QSEAL Integrity</div>
          </div>
        </div>
      </div>
    </TelemetryCard>
  );
}

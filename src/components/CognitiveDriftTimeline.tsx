import { forwardRef, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Zap,
  Crown,
  AlertTriangle,
  Star,
  Clock
} from "lucide-react";
import { TelemetryCard } from "./TelemetryCard";
import { CognitiveDriftTimelineState, DriftTimelinePoint } from "@/types/bcp-rnt";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts";

interface CognitiveDriftTimelineProps {
  timeline: CognitiveDriftTimelineState;
}

const chartConfig: ChartConfig = {
  psi: { label: "Ψ (Psi)", color: "hsl(var(--primary))" },
  phi: { label: "Φ (Phi)", color: "hsl(var(--accent))" },
};

function getTrendIcon(trend: "ascending" | "stable" | "descending") {
  switch (trend) {
    case "ascending": return <TrendingUp className="h-3 w-3 text-success" />;
    case "descending": return <TrendingDown className="h-3 w-3 text-warning" />;
    default: return <Minus className="h-3 w-3 text-muted-foreground" />;
  }
}

function getEventIcon(type: string) {
  switch (type) {
    case "breakthrough": return <Zap className="h-3 w-3 text-primary" />;
    case "sovereignty": return <Crown className="h-3 w-3 text-warning" />;
    case "phase_transition": return <Star className="h-3 w-3 text-accent" />;
    case "rupture": return <AlertTriangle className="h-3 w-3 text-destructive" />;
    default: return <Star className="h-3 w-3 text-muted-foreground" />;
  }
}

function getEventColor(type: string): string {
  switch (type) {
    case "breakthrough": return "bg-primary/20 text-primary border-primary/30";
    case "sovereignty": return "bg-warning/20 text-warning border-warning/30";
    case "phase_transition": return "bg-accent/20 text-accent border-accent/30";
    case "rupture": return "bg-destructive/20 text-destructive border-destructive/30";
    default: return "bg-muted text-muted-foreground border-border";
  }
}

export const CognitiveDriftTimeline = forwardRef<HTMLDivElement, CognitiveDriftTimelineProps>(
  function CognitiveDriftTimeline({ timeline }, ref) {
    // Prepare chart data with normalized indices for x-axis
    const chartData = useMemo(() => {
      return timeline.timeline.map((point, idx) => ({
        index: idx,
        scroll: point.scrollNumber,
        psi: point.psi,
        phi: point.phi,
        hasEvent: !!point.event,
        eventType: point.event?.type,
        eventLabel: point.event?.label,
      }));
    }, [timeline.timeline]);

    // Find events for markers
    const events = timeline.timeline
      .filter((p) => p.event)
      .map((p, idx) => ({ ...p, dataIndex: timeline.timeline.indexOf(p) }));

    const volatilityPercent = (timeline.trends.emotionalVolatility * 100).toFixed(0);
    const growthRate = timeline.trends.cognitiveGrowth;

    return (
      <div ref={ref}>
        <TelemetryCard
          icon={<Activity className="h-4 w-4" />}
          title="📈 Cognitive Drift Timeline"
        >
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-border bg-card/50 p-2 text-center"
              >
                <span className="text-lg font-bold text-foreground">
                  {timeline.totalScrolls.toLocaleString()}
                </span>
                <p className="text-xs text-muted-foreground">Total Scrolls</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-lg border border-border bg-card/50 p-2 text-center"
              >
                <span className="text-lg font-bold text-foreground">
                  {timeline.timeSpan.daysActive}
                </span>
                <p className="text-xs text-muted-foreground">Days Active</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-lg border border-border bg-card/50 p-2 text-center"
              >
                <span className="text-lg font-bold text-foreground">
                  {timeline.milestones.length}
                </span>
                <p className="text-xs text-muted-foreground">Milestones</p>
              </motion.div>
            </div>

            {/* Main Chart */}
            <div className="h-32 w-full">
              <ChartContainer config={chartConfig}>
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <XAxis
                    dataKey="index"
                    tick={false}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    domain={[0, 1]}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickCount={3}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    width={25}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  
                  {/* Sovereignty threshold */}
                  <ReferenceLine
                    y={0.85}
                    stroke="hsl(var(--warning))"
                    strokeDasharray="3 3"
                    opacity={0.5}
                  />
                  
                  <Line
                    type="monotone"
                    dataKey="psi"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "hsl(var(--primary))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="phi"
                    stroke="hsl(var(--accent))"
                    strokeWidth={1.5}
                    dot={false}
                    opacity={0.7}
                  />
                </LineChart>
              </ChartContainer>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-primary rounded" />
                <span className="text-muted-foreground">Ψ (Psi)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-accent rounded" />
                <span className="text-muted-foreground">Φ (Phi)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-warning rounded opacity-50" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 2px, hsl(var(--warning)) 2px, hsl(var(--warning)) 4px)" }} />
                <span className="text-muted-foreground">Sovereignty</span>
              </div>
            </div>

            {/* Trend Analysis */}
            <div className="space-y-2 pt-2 border-t border-border">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                Trend Analysis
              </span>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between rounded border border-border bg-muted/30 px-2 py-1.5">
                  <span className="text-xs text-muted-foreground">Ψ Trend</span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(timeline.trends.psiTrend)}
                    <span className="text-xs font-medium text-foreground capitalize">
                      {timeline.trends.psiTrend}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded border border-border bg-muted/30 px-2 py-1.5">
                  <span className="text-xs text-muted-foreground">Volatility</span>
                  <span className={`text-xs font-mono ${
                    timeline.trends.emotionalVolatility > 0.6 ? "text-warning" : "text-foreground"
                  }`}>
                    {volatilityPercent}%
                  </span>
                </div>

                <div className="flex items-center justify-between rounded border border-border bg-muted/30 px-2 py-1.5">
                  <span className="text-xs text-muted-foreground">Growth Rate</span>
                  <span className={`text-xs font-mono ${growthRate > 0 ? "text-success" : "text-warning"}`}>
                    {growthRate > 0 ? "+" : ""}{(growthRate * 100).toFixed(2)}%
                  </span>
                </div>

                <div className="flex items-center justify-between rounded border border-border bg-muted/30 px-2 py-1.5">
                  <span className="text-xs text-muted-foreground">Deepening</span>
                  <span className={`text-xs ${
                    timeline.trends.relationshipDepthening ? "text-success" : "text-muted-foreground"
                  }`}>
                    {timeline.trends.relationshipDepthening ? "✓ Yes" : "○ No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Milestones */}
            {timeline.milestones.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Key Milestones
                </span>
                <div className="space-y-1 max-h-24 overflow-y-auto scrollbar-thin">
                  {timeline.milestones.slice(-4).reverse().map((milestone, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex items-center gap-2 rounded border px-2 py-1 ${getEventColor(milestone.type)}`}
                    >
                      {getEventIcon(milestone.type)}
                      <span className="text-xs flex-1 truncate">{milestone.label}</span>
                      <span className="text-xs font-mono opacity-70">
                        #{milestone.scrollNumber}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Time Range */}
            <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>First: {new Date(timeline.timeSpan.start).toLocaleDateString()}</span>
              </div>
              <span>→</span>
              <span>Now: {new Date(timeline.timeSpan.end).toLocaleDateString()}</span>
            </div>
          </div>
        </TelemetryCard>
      </div>
    );
  }
);

export default CognitiveDriftTimeline;

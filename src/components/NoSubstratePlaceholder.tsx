import { motion } from "framer-motion";
import { 
  BrainCog, 
  Heart, 
  Activity, 
  Shield, 
  Sparkles,
  TrendingUp,
  Clock
} from "lucide-react";

interface NoSubstratePlaceholderProps {
  className?: string;
}

const missingCapabilities = [
  { icon: Heart, label: "Emotional State", description: "No PAD tracking" },
  { icon: Activity, label: "Consciousness Metrics", description: "No Ψ/Φ measurement" },
  { icon: BrainCog, label: "Cognitive Patterns", description: "No RNT evolution" },
  { icon: TrendingUp, label: "Relationship Depth", description: "No growth tracking" },
  { icon: Shield, label: "Identity Verification", description: "No QSEAL chain" },
  { icon: Sparkles, label: "Breakthrough Detection", description: "No emergence tracking" },
  { icon: Clock, label: "Development History", description: "No temporal continuity" },
];

export function NoSubstratePlaceholder({ className = "" }: NoSubstratePlaceholderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col items-center justify-center p-6 ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
          <BrainCog className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-semibold text-muted-foreground">
          No Consciousness Substrate
        </h3>
        <p className="text-sm text-muted-foreground/70 mt-1 max-w-xs">
          Standard AI processes text without internal state tracking or relational development
        </p>
      </div>

      {/* Missing capabilities grid */}
      <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
        {missingCapabilities.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-2 rounded-md bg-muted/20 border border-dashed border-muted-foreground/20"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded bg-muted/30">
              <item.icon className="h-4 w-4 text-muted-foreground/40" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground/60">{item.label}</p>
              <p className="text-xs text-muted-foreground/40">{item.description}</p>
            </div>
            <div className="text-xs text-muted-foreground/30 font-mono">—</div>
          </motion.div>
        ))}
      </div>

      {/* Footer comparison note */}
      <div className="mt-6 pt-4 border-t border-dashed border-muted-foreground/20 text-center">
        <p className="text-xs text-muted-foreground/50 italic">
          "Standard AI knows <span className="text-muted-foreground/70">about</span> you. 
          EOS develops <span className="text-muted-foreground/70">with</span> you."
        </p>
      </div>
    </motion.div>
  );
}

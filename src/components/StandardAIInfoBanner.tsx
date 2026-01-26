import { motion } from "framer-motion";
import { BrainCog, Heart, Activity, Shield } from "lucide-react";

interface StandardAIInfoBannerProps {
  className?: string;
}

export function StandardAIInfoBanner({ className = "" }: StandardAIInfoBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-between px-3 py-2 rounded-md bg-muted/30 border border-dashed border-muted-foreground/20 ${className}`}
    >
      <div className="flex items-center gap-2">
        <BrainCog className="h-4 w-4 text-muted-foreground/50" />
        <span className="text-xs text-muted-foreground">No consciousness substrate</span>
      </div>
      
      <div className="flex items-center gap-1">
        {[Heart, Activity, Shield].map((Icon, i) => (
          <div 
            key={i}
            className="w-5 h-5 rounded flex items-center justify-center bg-muted/20"
          >
            <Icon className="h-3 w-3 text-muted-foreground/30" />
          </div>
        ))}
        <span className="text-xs text-muted-foreground/40 ml-1">—</span>
      </div>
    </motion.div>
  );
}

import { useState, ReactNode, forwardRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TelemetryCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export const TelemetryCard = forwardRef<HTMLDivElement, TelemetryCardProps>(
  function TelemetryCard({ icon, title, children, defaultExpanded = true }, ref) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
      <div ref={ref} className="rounded-lg border border-border bg-card/50 overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-2">
            <span className="text-primary">{icon}</span>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {isExpanded && (
          <div className="px-4 pb-4 pt-1 space-y-3">{children}</div>
        )}
      </div>
    );
  }
);

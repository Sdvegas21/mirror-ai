interface PadBarProps {
  value: number; // -1 to 1
  label: string;
  className?: string;
}

export function PadBar({ value, label, className = "" }: PadBarProps) {
  const clampedValue = Math.max(-1, Math.min(1, value));
  
  // Calculate fill width (50% = full bar on one side)
  const fillWidth = Math.abs(clampedValue) * 50;
  const isPositive = clampedValue >= 0;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-mono text-foreground">
          {clampedValue >= 0 ? "+" : ""}
          {clampedValue.toFixed(2)}
        </span>
      </div>
      <div className="relative h-3 w-full rounded-full bg-muted overflow-hidden">
        {/* Fill bar */}
        {fillWidth > 0 && (
          <div
            className={`absolute top-0 bottom-0 transition-all duration-300 ${
              isPositive
                ? "left-1/2 rounded-r-full bg-gradient-to-r from-success/70 to-success"
                : "right-1/2 rounded-l-full bg-gradient-to-l from-destructive/70 to-destructive"
            }`}
            style={{ width: `${fillWidth}%` }}
          />
        )}
        
        {/* Center line - more visible */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-foreground/60 z-10 -translate-x-1/2" />
      </div>
    </div>
  );
}

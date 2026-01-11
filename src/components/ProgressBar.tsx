interface ProgressBarProps {
  value: number; // 0 to 1
  className?: string;
}

export function ProgressBar({ value, className = "" }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(1, value));
  const percentage = clampedValue * 100;

  return (
    <div className={`h-2 w-full rounded-full bg-muted overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

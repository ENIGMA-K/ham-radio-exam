interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max,
  color = "var(--primary)",
  className = "",
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className={`progress-bar ${className}`}>
      <div
        className="progress-bar-fill"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

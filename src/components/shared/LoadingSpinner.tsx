interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "加载中..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
      <p className="text-[var(--muted)] text-sm">{message}</p>
    </div>
  );
}

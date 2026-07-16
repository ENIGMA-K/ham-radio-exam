"use client";

interface PracticeHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
}

export function PracticeHeader({
  currentIndex,
  totalQuestions,
  correctCount,
  wrongCount,
}: PracticeHeaderProps) {
  const answered = correctCount + wrongCount;
  const accuracy = answered > 0 ? Math.round((correctCount / answered) * 100) : 0;

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface)] border-b border-[var(--border)]">
      <div className="flex items-center gap-3 text-sm">
        <span className="font-medium">
          {totalQuestions > 0 ? currentIndex + 1 : 0}/{totalQuestions} 题
        </span>
        <span className="text-[var(--muted)]">|</span>
        <span className="text-[var(--success)] font-medium">
          正确 {correctCount}
        </span>
        <span className="text-[var(--danger)] font-medium">
          错误 {wrongCount}
        </span>
        <span className="text-[var(--muted)]">|</span>
        <span
          className={`font-medium ${
            accuracy >= 80
              ? "text-[var(--success)]"
              : accuracy >= 60
                ? "text-[var(--warning)]"
                : "text-[var(--danger)]"
          }`}
        >
          正确率 {accuracy}%
        </span>
      </div>
    </div>
  );
}

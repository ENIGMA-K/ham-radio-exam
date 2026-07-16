"use client";

interface AnswerSheetProps {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<string, { isCorrect: boolean }>;
  onJump: (index: number) => void;
}

export function AnswerSheet({
  totalQuestions,
  currentIndex,
  answers,
  onJump,
}: AnswerSheetProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pb-2 flex-shrink-0">
        <h3 className="text-sm font-semibold text-[var(--muted)]">答题卡</h3>
      </div>

      {/* Scrollable grid area */}
      <div className="flex-1 overflow-y-auto px-4 pb-2">
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }, (_, i) => {
            const answer = answers[String(i)];
            const answered = answer !== undefined;
            const isCorrect = answer?.isCorrect ?? false;

            let dotClass = "answer-dot unanswered";
            if (answered && isCorrect) dotClass = "answer-dot correct";
            else if (answered && !isCorrect) dotClass = "answer-dot wrong";
            if (i === currentIndex) dotClass += " current";

            return (
              <button
                key={i}
                className={dotClass}
                onClick={() => onJump(i)}
                aria-label={`题目 ${i + 1}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-3 border-t border-[var(--border)] text-xs text-[var(--muted)] flex-shrink-0">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[var(--success)] inline-block" />
          正确
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[var(--danger)] inline-block" />
          错误
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" />
          未答
        </span>
      </div>
    </div>
  );
}

"use client";

import type { QuestionCategory } from "@/models/Question";
import type { CategoryStats } from "@/models/QuestionProgress";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { CATEGORY_CONFIG } from "@/lib/constants";

interface CategoryBreakdownProps {
  category: QuestionCategory;
  stats: CategoryStats;
}

export function CategoryBreakdown({ category, stats }: CategoryBreakdownProps) {
  const config = CATEGORY_CONFIG[category];
  const accuracyPct = stats.accuracy * 100;

  return (
    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4">
      <h3 className="font-semibold mb-3">{config.label}</h3>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[var(--muted)]">进度</span>
            <span>
              {stats.answeredQuestions}/{stats.totalQuestions}
            </span>
          </div>
          <ProgressBar value={stats.answeredQuestions} max={stats.totalQuestions} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-[var(--muted)]">正确率：</span>
            <span
              className={
                accuracyPct >= 80
                  ? "text-[var(--success)]"
                  : accuracyPct >= 60
                    ? "text-[var(--warning)]"
                    : "text-[var(--danger)]"
              }
            >
              {accuracyPct.toFixed(1)}%
            </span>
          </div>
          <div>
            <span className="text-[var(--muted)]">掌握：</span>
            <span>{stats.masteredCount} 题</span>
          </div>
          <div>
            <span className="text-[var(--muted)]">薄弱：</span>
            <span>{stats.weakCount} 题</span>
          </div>
          <div>
            <span className="text-[var(--muted)]">正确/错误：</span>
            <span>
              {stats.correctCount}/{stats.wrongCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

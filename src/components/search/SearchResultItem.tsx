"use client";

import { useMemo } from "react";
import type { Question } from "@/models/Question";
import { useProgressStore } from "@/stores/useProgressStore";

interface SearchResultItemProps {
  question: Question;
}

const CATEGORY_LABELS = ["A", "B", "C"] as const;

export function SearchResultItem({ question }: SearchResultItemProps) {
  const progressMap = useProgressStore((s) => s.progressMap);
  const progress = progressMap[question.id];

  const categories = useMemo(
    () =>
      CATEGORY_LABELS.filter(
        (c) => question[`category${c}` as keyof Question]
      ),
    [question]
  );

  const statusIcon = (() => {
    if (!progress || (progress.correctCount === 0 && progress.wrongCount === 0))
      return { icon: "○", color: "text-gray-400" };
    if (progress.correctCount > progress.wrongCount)
      return { icon: "✓", color: "text-[var(--success)]" };
    if (progress.wrongCount > progress.correctCount)
      return { icon: "✗", color: "text-[var(--danger)]" };
    return { icon: "—", color: "text-[var(--warning)]" };
  })();

  return (
    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <span className={`text-lg font-bold mt-0.5 ${statusIcon.color}`}>
          {statusIcon.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-[var(--muted)]">
              {question.id}
            </span>
            <div className="flex gap-1">
              {categories.map((c) => (
                <span
                  key={c}
                  className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded"
                >
                  {c}类
                </span>
              ))}
            </div>
            {question.hasImage && (
              <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-[var(--muted)] rounded">
                含图
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed">{question.stem}</p>
          {progress && (progress.correctCount > 0 || progress.wrongCount > 0) && (
            <div className="flex gap-3 mt-2 text-xs text-[var(--muted)]">
              <span>正确 {progress.correctCount} 次</span>
              <span>错误 {progress.wrongCount} 次</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

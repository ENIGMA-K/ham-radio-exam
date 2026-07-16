"use client";

import { useMemo } from "react";
import { useProgressStore } from "@/stores/useProgressStore";

export function QuickStats() {
  const getStats = useProgressStore((s) => s.getStats);
  const stats = useMemo(() => getStats(), [getStats]);

  const accuracyPct = stats.accuracy * 100;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4 text-center">
        <p className="text-2xl font-bold text-[var(--primary)]">
          {stats.answeredQuestions}
        </p>
        <p className="text-xs text-[var(--muted)] mt-1">已答题数</p>
      </div>
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4 text-center">
        <p className="text-2xl font-bold text-[var(--success)]">
          {accuracyPct.toFixed(1)}%
        </p>
        <p className="text-xs text-[var(--muted)] mt-1">总正确率</p>
      </div>
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4 text-center">
        <p className="text-2xl font-bold text-orange-500">
          {stats.totalQuestions - stats.answeredQuestions}
        </p>
        <p className="text-xs text-[var(--muted)] mt-1">未做题数</p>
      </div>
    </div>
  );
}

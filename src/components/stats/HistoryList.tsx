"use client";

import { useState, useEffect } from "react";
import type { ExamResult } from "@/models/ExamResult";
import { DexieExamRepository } from "@/repositories/examRepo";
import { CATEGORY_CONFIG } from "@/lib/constants";
import { formatDate, formatTime } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";

const examRepo = new DexieExamRepository();

export function HistoryList() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    examRepo.getAllResults(20).then((r) => {
      setResults(r);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8 text-[var(--muted)] text-sm">
        加载中...
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <EmptyState
        icon="📝"
        title="暂无考试记录"
        description="完成模拟考试后，记录将显示在这里。"
      />
    );
  }

  return (
    <div className="space-y-2">
      {results.map((r) => {
        const config = CATEGORY_CONFIG[r.category];
        const scoreColor =
          r.score >= 80
            ? "text-[var(--success)]"
            : r.score >= 60
              ? "text-[var(--warning)]"
              : "text-[var(--danger)]";

        return (
          <div
            key={r.id}
            className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-3 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium">
                {config.label} · {r.correctCount}/{r.totalQuestions}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {formatDate(r.completedAt)} · 用时 {formatTime(r.timeUsed)}
              </p>
            </div>
            <span className={`text-lg font-bold ${scoreColor}`}>
              {r.score}
            </span>
          </div>
        );
      })}
    </div>
  );
}

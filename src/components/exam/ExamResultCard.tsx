"use client";

import type { ExamResult } from "@/models/ExamResult";
import { CATEGORY_CONFIG } from "@/lib/constants";
import { formatTime, formatDate } from "@/lib/utils";

interface ExamResultCardProps {
  result: ExamResult;
  onRestart: () => void;
  onGoHome: () => void;
}

export function ExamResultCard({ result, onRestart, onGoHome }: ExamResultCardProps) {
  const config = CATEGORY_CONFIG[result.category];
  const answeredPct =
    result.totalQuestions > 0
      ? Math.round((result.answeredQuestions / result.totalQuestions) * 100)
      : 0;

  const getScoreColor = () => {
    if (result.score >= 80) return "text-[var(--success)]";
    if (result.score >= 60) return "text-[var(--warning)]";
    return "text-[var(--danger)]";
  };

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 text-center">
        <p className="text-sm text-[var(--muted)] mb-2">
          {config.label} · 模拟考试
        </p>
        <p className={`text-5xl font-bold mb-1 ${getScoreColor()}`}>
          {result.score}
        </p>
        <p className="text-sm text-[var(--muted)]">分</p>
      </div>

      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--success)]">
              {result.correctCount}
            </p>
            <p className="text-xs text-[var(--muted)]">正确</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--danger)]">
              {result.wrongCount}
            </p>
            <p className="text-xs text-[var(--muted)]">错误</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{answeredPct}%</p>
            <p className="text-xs text-[var(--muted)]">作答率</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{formatTime(result.timeUsed)}</p>
            <p className="text-xs text-[var(--muted)]">用时</p>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-[var(--muted)]">
        完成时间：{formatDate(result.completedAt)}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="flex-1 py-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          重新考试
        </button>
        <button
          onClick={onGoHome}
          className="flex-1 py-3 border border-[var(--border)] rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          返回首页
        </button>
      </div>
    </div>
  );
}

"use client";

import type { ExamResult } from "@/models/ExamResult";
import { CATEGORY_CONFIG, examTotalQuestions } from "@/lib/constants";
import { formatTime, formatDate } from "@/lib/utils";

interface ExamResultCardProps {
  result: ExamResult;
  onRestart: () => void;
  onGoHome: () => void;
}

export function ExamResultCard({ result, onRestart, onGoHome }: ExamResultCardProps) {
  const config = CATEGORY_CONFIG[result.category];
  const passed = result.correctCount >= config.passingScore;
  const answeredPct =
    result.totalQuestions > 0
      ? Math.round((result.answeredQuestions / result.totalQuestions) * 100)
      : 0;

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Score + Pass/Fail */}
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 text-center">
        <p className="text-sm text-[var(--muted)] mb-2">
          {config.label} · 模拟考试
        </p>
        <p className={`text-5xl font-bold mb-1 ${passed ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
          {result.score}
        </p>
        <p className="text-sm text-[var(--muted)]">分</p>
        <div className={`mt-3 inline-block px-4 py-1 rounded-full text-sm font-bold ${
          passed
            ? "bg-green-50 text-[var(--success)] border border-green-200"
            : "bg-red-50 text-[var(--danger)] border border-red-200"
        }`}>
          {passed ? "✓ 合格" : "✗ 不合格"}
        </div>
        <p className="text-xs text-[var(--muted)] mt-1">
          合格标准：答对 {config.passingScore} 题及以上（多选题需完全匹配）
        </p>
      </div>

      {/* Stat grid */}
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

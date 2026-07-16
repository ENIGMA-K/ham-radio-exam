"use client";

import Link from "next/link";
import type { QuestionCategory } from "@/models/Question";
import type { CategoryStats } from "@/models/QuestionProgress";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { CATEGORY_CONFIG } from "@/lib/constants";

interface CategoryCardProps {
  category: QuestionCategory;
  stats: CategoryStats;
}

export function CategoryCard({ category, stats }: CategoryCardProps) {
  const config = CATEGORY_CONFIG[category];
  const progressPct =
    stats.totalQuestions > 0
      ? (stats.answeredQuestions / stats.totalQuestions) * 100
      : 0;
  const accuracyPct = stats.accuracy * 100;

  const getAccuracyColor = () => {
    if (accuracyPct >= 80) return "var(--success)";
    if (accuracyPct >= 60) return "var(--warning)";
    return "var(--danger)";
  };

  return (
    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{config.label}</h2>
        <span className="text-sm text-[var(--muted)]">
          {stats.answeredQuestions}/{stats.totalQuestions} 题
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-[var(--muted)]">学习进度</span>
          <span className="font-medium">{progressPct.toFixed(1)}%</span>
        </div>
        <ProgressBar value={stats.answeredQuestions} max={stats.totalQuestions} />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div className="bg-green-50 rounded-lg py-2">
          <p className="text-lg font-bold text-[var(--success)]">
            {stats.correctCount}
          </p>
          <p className="text-xs text-[var(--muted)]">正确</p>
        </div>
        <div className="bg-red-50 rounded-lg py-2">
          <p className="text-lg font-bold text-[var(--danger)]">
            {stats.wrongCount}
          </p>
          <p className="text-xs text-[var(--muted)]">错误</p>
        </div>
        <div className="bg-blue-50 rounded-lg py-2">
          <p
            className="text-lg font-bold"
            style={{ color: getAccuracyColor() }}
          >
            {accuracyPct.toFixed(1)}%
          </p>
          <p className="text-xs text-[var(--muted)]">正确率</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/practice/${category}`}
          className="flex-1 text-center py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium no-underline hover:opacity-90 transition-opacity"
        >
          练习
        </Link>
        <Link
          href={`/exam/${category}`}
          className="flex-1 text-center py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium no-underline hover:opacity-90 transition-opacity"
        >
          模拟考
        </Link>
      </div>
    </div>
  );
}

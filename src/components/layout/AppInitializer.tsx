"use client";

import { useEffect } from "react";
import { useQuestionBankStore } from "@/stores/useQuestionBankStore";
import { useProgressStore } from "@/stores/useProgressStore";

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const loadQuestions = useQuestionBankStore((s) => s.loadQuestions);
  const isLoaded = useQuestionBankStore((s) => s.isLoaded);
  const error = useQuestionBankStore((s) => s.error);
  const loadProgress = useProgressStore((s) => s.loadProgress);

  useEffect(() => {
    loadQuestions().then(() => loadProgress());
  }, [loadQuestions, loadProgress]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <p className="text-red-500 text-lg mb-2">加载失败</p>
          <p className="text-[var(--muted)] text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
          <p className="text-[var(--muted)] text-sm">正在加载题库...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

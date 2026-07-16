"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppInitializer } from "@/components/layout/AppInitializer";
import { Header } from "@/components/layout/Header";
import { QuestionCard } from "@/components/practice/QuestionCard";
import { AnswerSheet } from "@/components/practice/AnswerSheet";
import { ExamTimer } from "@/components/exam/ExamTimer";
import { ExamResultCard } from "@/components/exam/ExamResultCard";
import { useExamStore } from "@/stores/useExamStore";
import { useUIStore } from "@/stores/useUIStore";
import { CATEGORY_CONFIG } from "@/lib/constants";
import type { QuestionCategory } from "@/models/Question";



export default function ExamPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const router = useRouter();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const startExam = useExamStore((s) => s.startExam);
  const status = useExamStore((s) => s.status);
  const questions = useExamStore((s) => s.questions);
  const currentIndex = useExamStore((s) => s.currentIndex);
  const answers = useExamStore((s) => s.answers);
  const timeRemaining = useExamStore((s) => s.timeRemaining);
  const result = useExamStore((s) => s.result);
  const selectAnswer = useExamStore((s) => s.selectAnswer);
  const goToQuestion = useExamStore((s) => s.goToQuestion);
  const tick = useExamStore((s) => s.tick);
  const submitExam = useExamStore((s) => s.submitExam);
  const resetExam = useExamStore((s) => s.resetExam);

  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const validCategory = (["A", "B", "C"] as QuestionCategory[]).includes(
    category as QuestionCategory
  )
    ? (category as QuestionCategory)
    : null;

  useEffect(() => {
    if (validCategory && status === "not-started") {
      startExam(validCategory);
    }
  }, [validCategory, status, startExam]);

  if (!validCategory) {
    router.replace("/");
    return null;
  }

  const config = CATEGORY_CONFIG[validCategory];
  const currentQuestion = questions[currentIndex] ?? null;

  const handleSelect = (option: string) => {
    if (!currentQuestion || status !== "in-progress") return;
    selectAnswer(currentQuestion.id, option);
  };

  const handleSubmit = () => {
    setShowSubmitConfirm(false);
    submitExam();
  };

  const handleRestart = () => {
    resetExam();
    startExam(validCategory);
  };

  if (status === "not-started") {
    return (
      <AppInitializer>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold">{config.label} · 模拟考试</h2>
              <p className="text-[var(--muted)]">
                {config.examQuestionCount} 题 · {config.examTimeMinutes} 分钟
              </p>
              <p className="text-sm text-[var(--muted)]">
                考试开始后将计时，时间到自动交卷
              </p>
              <button
                onClick={() => startExam(validCategory)}
                className="px-8 py-3 bg-orange-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                开始考试
              </button>
            </div>
          </main>
        </div>
      </AppInitializer>
    );
  }

  if (status === "submitted" && result) {
    return (
      <AppInitializer>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center p-4">
            <ExamResultCard
              result={result}
              onRestart={handleRestart}
              onGoHome={() => router.push("/")}
            />
          </main>
        </div>
      </AppInitializer>
    );
  }

  const answeredCount = Object.values(answers).filter((a) => a !== null).length;

  return (
    <AppInitializer>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface)] border-b border-[var(--border)]">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium">
              {currentIndex + 1}/{questions.length}
            </span>
            <span className="text-[var(--muted)]">已答 {answeredCount}</span>
          </div>
          <ExamTimer timeRemaining={timeRemaining} onTick={tick} />
          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="px-4 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:opacity-90"
          >
            交卷
          </button>
        </div>

        <main className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full">
          <div className="flex-1 p-4 pb-6">
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                selectedOption={answers[currentQuestion.id] ?? null}
                showFeedback={false}
                onSelect={handleSelect}
              />
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={() => goToQuestion(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                上一题
              </button>
              <button
                onClick={() => goToQuestion(currentIndex + 1)}
                disabled={currentIndex >= questions.length - 1}
                className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                下一题
              </button>
            </div>
          </div>

          {sidebarOpen && (
            <aside className="lg:w-64 bg-[var(--surface)] border-l border-[var(--border)]">
              <AnswerSheet
                totalQuestions={questions.length}
                currentIndex={currentIndex}
                answers={Object.fromEntries(
                  Object.entries(answers)
                    .filter(([, v]) => v !== null)
                    .map(([qid]) => {
                      const idx = questions.findIndex((q) => q.id === qid);
                      return [String(idx), { isCorrect: true }];
                    })
                )}
                onJump={goToQuestion}
              />
            </aside>
          )}
        </main>

        <div className="lg:hidden fixed bottom-6 right-4 z-50">
          <button
            onClick={toggleSidebar}
            className="w-10 h-10 rounded-full bg-[var(--primary)] text-white shadow-lg flex items-center justify-center text-lg"
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-bold">确认交卷</h3>
            <p className="text-sm text-[var(--muted)]">
              已答 {answeredCount}/{questions.length} 题，还有{" "}
              {questions.length - answeredCount} 题未答。确定要交卷吗？
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 border border-[var(--border)] rounded-lg font-medium hover:bg-gray-50"
              >
                继续答题
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:opacity-90"
              >
                确认交卷
              </button>
            </div>
          </div>
        </div>
      )}
    </AppInitializer>
  );
}

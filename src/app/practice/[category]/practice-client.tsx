"use client";

import { use, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppInitializer } from "@/components/layout/AppInitializer";
import { Header } from "@/components/layout/Header";
import { PracticeHeader } from "@/components/practice/PracticeHeader";
import { QuestionCard } from "@/components/practice/QuestionCard";
import { AnswerSheet } from "@/components/practice/AnswerSheet";
import { ModeSelector } from "@/components/practice/ModeSelector";
import { EmptyState } from "@/components/shared/EmptyState";
import { usePracticeStore } from "@/stores/usePracticeStore";
import { useUIStore } from "@/stores/useUIStore";
import type { QuestionCategory, PracticeMode } from "@/models/Question";


export default function PracticePage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const router = useRouter();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const initSession = usePracticeStore((s) => s.initSession);
  const questionQueue = usePracticeStore((s) => s.questionQueue);
  const currentIndex = usePracticeStore((s) => s.currentIndex);
  const answers = usePracticeStore((s) => s.answers);
  const isSessionActive = usePracticeStore((s) => s.isSessionActive);
  const mode = usePracticeStore((s) => s.mode);
  const answerQuestion = usePracticeStore((s) => s.answerQuestion);
  const goToNext = usePracticeStore((s) => s.goToNext);
  const goToPrev = usePracticeStore((s) => s.goToPrev);
  const jumpTo = usePracticeStore((s) => s.jumpTo);
  const endSession = usePracticeStore((s) => s.endSession);

  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const validCategory = (["A", "B", "C"] as QuestionCategory[]).includes(
    category as QuestionCategory
  )
    ? (category as QuestionCategory)
    : null;

  const startSession = useCallback(
    (cat: QuestionCategory, m: PracticeMode) => {
      initSession(cat, m);
      setSelectedOption(null);
      setShowFeedback(false);
    },
    [initSession]
  );

  // Start session on mount if not active
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (validCategory && !isSessionActive && !initialized) {
      startSession(validCategory, "sequential");
      setInitialized(true);
    }
  }, [validCategory, isSessionActive, initialized, startSession]);

  if (!validCategory) {
    router.replace("/");
    return null;
  }

  const currentQuestion = questionQueue.length > 0 ? questionQueue[currentIndex] ?? null : null;

  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;
  const wrongCount = Object.values(answers).filter((a) => !a.isCorrect).length;

  const handleSelect = (option: string) => {
    if (!currentQuestion || isAnswered) return;
    setSelectedOption(option);
    setShowFeedback(true);
    answerQuestion(option);
  };

  const handleNext = () => {
    if (currentIndex >= questionQueue.length - 1) return;
    goToNext();
    setSelectedOption(null);
    setShowFeedback(false);
  };

  const handlePrev = () => {
    if (currentIndex <= 0) return;
    goToPrev();
    setSelectedOption(null);
    setShowFeedback(false);
  };

  const handleJump = (index: number) => {
    jumpTo(index);
    const q = questionQueue[index];
    const a = q ? answers[q.id] : undefined;
    setSelectedOption(a?.selectedOption ?? null);
    setShowFeedback(a !== undefined);
  };

  const handleModeChange = (newMode: PracticeMode) => {
    endSession();
    setSelectedOption(null);
    setShowFeedback(false);
    startSession(validCategory, newMode);
  };

  // Guard against uninitialized session
  if (!isSessionActive || questionQueue.length === 0) {
    return (
      <AppInitializer>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
              <p className="text-[var(--muted)] text-sm">加载题目中...</p>
            </div>
          </main>
          <ModeSelector currentMode={mode} onModeChange={handleModeChange} />
        </div>
      </AppInitializer>
    );
  }

  const currentAnswer = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;
  const isAnswered = currentAnswer !== undefined;

  if (questionQueue.length === 0 && isSessionActive) {
    return (
      <AppInitializer>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <EmptyState
              icon="🎉"
              title="没有可练习的题目"
              description={
                mode === "wrong"
                  ? "太棒了！你没有错题需要复习。"
                  : "当前模式没有匹配的题目。"
              }
            />
          </main>
          <ModeSelector currentMode={mode} onModeChange={handleModeChange} />
        </div>
      </AppInitializer>
    );
  }

  return (
    <AppInitializer>
      <div className="min-h-screen flex flex-col">
        <Header />
        <PracticeHeader
          currentIndex={currentIndex}
          totalQuestions={questionQueue.length}
          correctCount={correctCount}
          wrongCount={wrongCount}
        />

        <main className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full">
          <div className="flex-1 p-4 pb-6">
            {currentQuestion ? (
              <QuestionCard
                question={currentQuestion}
                selectedOption={
                  isAnswered
                    ? currentAnswer?.selectedOption ?? null
                    : selectedOption
                }
                showFeedback={isAnswered || showFeedback}
                onSelect={handleSelect}
              />
            ) : null}

            <div className="flex justify-between mt-4">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                上一题
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= questionQueue.length - 1}
                className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                下一题
              </button>
            </div>
          </div>

          {sidebarOpen && (
            <aside className="lg:w-64 bg-[var(--surface)] border-l border-[var(--border)]">
              <AnswerSheet
                totalQuestions={questionQueue.length}
                currentIndex={currentIndex}
                answers={Object.fromEntries(
                  Object.entries(answers).map(([qid, a]) => [
                    String(questionQueue.findIndex((q) => q.id === qid)),
                    { isCorrect: a.isCorrect },
                  ])
                )}
                onJump={handleJump}
              />
            </aside>
          )}
        </main>

        <div className="lg:hidden fixed bottom-20 right-4 z-50">
          <button
            onClick={toggleSidebar}
            className="w-10 h-10 rounded-full bg-[var(--primary)] text-white shadow-lg flex items-center justify-center text-lg"
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
        </div>

        <ModeSelector currentMode={mode} onModeChange={handleModeChange} />
      </div>
    </AppInitializer>
  );
}

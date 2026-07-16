import { create } from "zustand";
import type { Question, QuestionCategory } from "@/models/Question";
import type { ExamResult } from "@/models/ExamResult";
import { useQuestionBankStore } from "./useQuestionBankStore";
import { useProgressStore } from "./useProgressStore";
import { DexieExamRepository } from "@/repositories/examRepo";
import { CATEGORY_CONFIG } from "@/lib/constants";
import { shuffleArray } from "@/lib/utils";

type ExamStatus = "not-started" | "in-progress" | "submitted";

interface ExamState {
  category: QuestionCategory | null;
  status: ExamStatus;

  questions: Question[];
  currentIndex: number;
  answers: Record<string, string | null>;

  timeLimit: number;
  timeRemaining: number;
  startedAt: number | null;

  result: ExamResult | null;

  startExam: (category: QuestionCategory) => void;
  selectAnswer: (questionId: string, option: string) => void;
  goToQuestion: (index: number) => void;
  tick: () => void;
  submitExam: () => Promise<void>;
  resetExam: () => void;
}

const examRepo = new DexieExamRepository();

export const useExamStore = create<ExamState>((set, get) => ({
  category: null,
  status: "not-started",
  questions: [],
  currentIndex: 0,
  answers: {},
  timeLimit: 0,
  timeRemaining: 0,
  startedAt: null,
  result: null,

  startExam: (category: QuestionCategory) => {
    const allCategoryQuestions = useQuestionBankStore
      .getState()
      .getByCategory(category);

    const config = CATEGORY_CONFIG[category];
    const count = Math.min(config.examQuestionCount, allCategoryQuestions.length);
    const selected = shuffleArray(allCategoryQuestions).slice(0, count);

    const answers: Record<string, string | null> = {};
    for (const q of selected) {
      answers[q.id] = null;
    }

    const timeLimit = config.examTimeMinutes * 60;

    set({
      category,
      status: "in-progress",
      questions: selected,
      currentIndex: 0,
      answers,
      timeLimit,
      timeRemaining: timeLimit,
      startedAt: Date.now(),
      result: null,
    });
  },

  selectAnswer: (questionId: string, option: string) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: option },
    }));
  },

  goToQuestion: (index: number) => {
    const state = get();
    if (index >= 0 && index < state.questions.length) {
      set({ currentIndex: index });
    }
  },

  tick: () => {
    const state = get();
    if (state.status !== "in-progress") return;

    const newTime = state.timeRemaining - 1;
    set({ timeRemaining: newTime });

    if (newTime <= 0) {
      get().submitExam();
    }
  },

  submitExam: async () => {
    const state = get();
    if (state.status !== "in-progress") return;

    const questionResults: ExamResult["questionResults"] = state.questions.map(
      (q) => {
        const selected = state.answers[q.id] ?? null;
        return {
          questionId: q.id,
          selectedAnswer: selected,
          isCorrect: selected === q.correctAnswer,
        };
      }
    );

    const answeredQuestions = questionResults.filter(
      (r) => r.selectedAnswer !== null
    ).length;
    const correctCount = questionResults.filter((r) => r.isCorrect).length;
    const wrongCount = answeredQuestions - correctCount;
    const score =
      state.questions.length > 0
        ? Math.round((correctCount / state.questions.length) * 100)
        : 0;

    const timeUsed = state.startedAt
      ? Math.round((Date.now() - state.startedAt) / 1000)
      : 0;

    const result: ExamResult = {
      category: state.category!,
      totalQuestions: state.questions.length,
      answeredQuestions,
      correctCount,
      wrongCount,
      score,
      timeUsed,
      questionResults,
      startedAt: state.startedAt!,
      completedAt: Date.now(),
    };

    const id = await examRepo.saveResult(result);
    result.id = id;

    // Record each answer to progress
    const progressStore = useProgressStore.getState();
    for (const r of questionResults) {
      if (r.selectedAnswer !== null) {
        await progressStore.recordAnswer(r.questionId, r.isCorrect);
      }
    }

    set({ status: "submitted", result });
  },

  resetExam: () => {
    set({
      category: null,
      status: "not-started",
      questions: [],
      currentIndex: 0,
      answers: {},
      timeLimit: 0,
      timeRemaining: 0,
      startedAt: null,
      result: null,
    });
  },
}));

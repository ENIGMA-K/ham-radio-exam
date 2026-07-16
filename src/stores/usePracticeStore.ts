import { create } from "zustand";
import type { Question, QuestionCategory, PracticeMode } from "@/models/Question";
import { useQuestionBankStore } from "./useQuestionBankStore";
import { useProgressStore } from "./useProgressStore";
import { shuffleArray, shuffleOptions } from "@/lib/utils";
import { errorRate } from "@/lib/utils";

interface PracticeAnswer {
  selectedOption: string | null;
  isCorrect: boolean;
  answeredAt: number;
}

interface PracticeState {
  category: QuestionCategory | null;
  mode: PracticeMode;

  questionQueue: Question[];
  /** Per-question option shuffle map: display label → original label */
  shuffleMaps: Record<string, Record<string, string>>;
  currentIndex: number;
  answers: Record<string, PracticeAnswer>;
  isSessionActive: boolean;

  initSession: (category: QuestionCategory, mode: PracticeMode) => void;
  answerQuestion: (option: string) => void;
  goToNext: () => void;
  goToPrev: () => void;
  jumpTo: (index: number) => void;
  endSession: () => void;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  category: null,
  mode: "sequential",
  questionQueue: [],
  shuffleMaps: {},
  currentIndex: 0,
  answers: {},
  isSessionActive: false,

  initSession: (category: QuestionCategory, mode: PracticeMode) => {
    const questions = useQuestionBankStore
      .getState()
      .getByCategory(category);
    const progressMap = useProgressStore.getState().progressMap;

    let queue: Question[];

    switch (mode) {
      case "sequential":
        queue = [...questions];
        break;

      case "random":
        queue = shuffleArray(questions);
        break;

      case "wrong": {
        queue = questions.filter((q) => {
          const p = progressMap[q.id];
          return p && p.wrongCount > p.correctCount;
        });
        break;
      }

      case "high-error": {
        queue = questions
          .filter((q) => {
            const p = progressMap[q.id];
            const total = p ? p.correctCount + p.wrongCount : 0;
            return total > 0 && (p?.wrongCount ?? 0) > 0;
          })
          .sort((a, b) => {
            const errA = errorRate(progressMap[a.id] ?? { correctCount: 0, wrongCount: 0 });
            const errB = errorRate(progressMap[b.id] ?? { correctCount: 0, wrongCount: 0 });
            return errB - errA;
          });
        break;
      }

      default:
        queue = [...questions];
    }

    // Generate shuffle map for each question
    const shuffleMaps: Record<string, Record<string, string>> = {};
    for (const q of queue) {
      const { mapToOriginal } = shuffleOptions();
      shuffleMaps[q.id] = mapToOriginal;
    }

    set({
      category,
      mode,
      questionQueue: queue,
      shuffleMaps,
      currentIndex: 0,
      answers: {},
      isSessionActive: true,
    });
  },

  answerQuestion: (option: string) => {
    const state = get();
    if (!state.isSessionActive) return;

    const question = state.questionQueue[state.currentIndex];
    if (!question) return;

    // Convert display letters to original letters using shuffle map
    const mapToOriginal = state.shuffleMaps[question.id];
    const originalOption = [...option]
      .map((ch) => mapToOriginal[ch] ?? ch)
      .join("");

    let isCorrect = false;
    if (question.questionType === "multi") {
      const userSorted = [...originalOption].sort().join("");
      const correctSorted = [...question.correctAnswer].sort().join("");
      isCorrect = userSorted === correctSorted;
    } else {
      isCorrect = originalOption === question.correctAnswer;
    }

    set({
      answers: {
        ...state.answers,
        [question.id]: {
          selectedOption: option,
          isCorrect,
          answeredAt: Date.now(),
        },
      },
    });

    useProgressStore.getState().recordAnswer(question.id, isCorrect);
  },

  goToNext: () => {
    const state = get();
    if (state.currentIndex < state.questionQueue.length - 1) {
      set({ currentIndex: state.currentIndex + 1 });
    }
  },

  goToPrev: () => {
    const state = get();
    if (state.currentIndex > 0) {
      set({ currentIndex: state.currentIndex - 1 });
    }
  },

  jumpTo: (index: number) => {
    const state = get();
    if (index >= 0 && index < state.questionQueue.length) {
      set({ currentIndex: index });
    }
  },

  endSession: () => {
    set({ isSessionActive: false, questionQueue: [], shuffleMaps: {}, answers: {} });
  },
}));

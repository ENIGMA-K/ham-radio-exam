import { create } from "zustand";
import type { QuestionCategory } from "@/models/Question";
import type { QuestionProgress, CategoryStats } from "@/models/QuestionProgress";
import type { ExportData } from "@/models/ExportData";
import { DexieProgressRepository } from "@/repositories/progressRepo";
import { useQuestionBankStore } from "./useQuestionBankStore";

interface ProgressState {
  progressMap: Record<string, QuestionProgress>;
  isLoaded: boolean;

  loadProgress: () => Promise<void>;
  recordAnswer: (questionId: string, isCorrect: boolean) => Promise<void>;
  getStats: (category?: QuestionCategory) => CategoryStats;
  exportData: () => Promise<ExportData>;
  importData: (data: ExportData) => Promise<void>;
  resetProgress: () => Promise<void>;
}

const repo = new DexieProgressRepository();

export const useProgressStore = create<ProgressState>((set, get) => ({
  progressMap: {},
  isLoaded: false,

  loadProgress: async () => {
    const all = await repo.getAllProgress();
    const map: Record<string, QuestionProgress> = {};
    for (const p of all) {
      map[p.id] = p;
    }
    set({ progressMap: map, isLoaded: true });
  },

  recordAnswer: async (questionId: string, isCorrect: boolean) => {
    const current = get().progressMap[questionId];
    const now = Date.now();

    const updated: QuestionProgress = current
      ? {
          ...current,
          correctCount: current.correctCount + (isCorrect ? 1 : 0),
          wrongCount: current.wrongCount + (isCorrect ? 0 : 1),
          lastAnsweredAt: now,
          consecutiveCorrect: isCorrect ? current.consecutiveCorrect + 1 : 0,
        }
      : {
          id: questionId,
          correctCount: isCorrect ? 1 : 0,
          wrongCount: isCorrect ? 0 : 1,
          lastAnsweredAt: now,
          consecutiveCorrect: isCorrect ? 1 : 0,
        };

    await repo.upsertProgress(updated);

    set((state) => ({
      progressMap: { ...state.progressMap, [questionId]: updated },
    }));
  },

  getStats: (category?: QuestionCategory) => {
    const questions = useQuestionBankStore.getState().questions;
    const questionIds = questions
      .filter((q) => {
        if (!category) return true;
        return q[`category${category}` as keyof typeof q] === true;
      })
      .map((q) => q.id);

    const progressMap = get().progressMap;
    const relevant = questionIds
      .map((id) => progressMap[id])
      .filter((p): p is QuestionProgress => p !== undefined);

    const answeredQuestions = relevant.length;
    const correctCount = relevant.reduce((s, p) => s + p.correctCount, 0);
    const wrongCount = relevant.reduce((s, p) => s + p.wrongCount, 0);
    const totalAttempts = correctCount + wrongCount;
    const accuracy = totalAttempts > 0 ? correctCount / totalAttempts : 0;
    const masteredCount = relevant.filter(
      (p) => p.consecutiveCorrect >= 2
    ).length;
    const weakCount = relevant.filter(
      (p) => p.wrongCount > p.correctCount
    ).length;

    return {
      category: category ?? null,
      totalQuestions: questionIds.length,
      answeredQuestions,
      correctCount,
      wrongCount,
      accuracy,
      masteredCount,
      weakCount,
    };
  },

  exportData: async () => {
    return repo.exportAll();
  },

  importData: async (data: ExportData) => {
    await repo.importAll(data);
    await get().loadProgress();
  },

  resetProgress: async () => {
    const db = (await import("@/repositories/dexie-db")).getDB();
    await db.progress.clear();
    await db.examResults.clear();
    await db.practiceSessions.clear();
    set({ progressMap: {} });
  },
}));

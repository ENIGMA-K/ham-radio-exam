import { create } from "zustand";
import type { Question, QuestionCategory } from "@/models/Question";
import { DexieQuestionRepository } from "@/repositories/questionRepo";
import { getTransformedQuestions } from "@/lib/seedQuestions";

interface QuestionBankState {
  questions: Question[];
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;

  loadQuestions: () => Promise<void>;
  getByCategory: (cat: QuestionCategory) => Question[];
  getById: (id: string) => Question | undefined;
  search: (query: string, cat?: QuestionCategory) => Question[];
}

const repo = new DexieQuestionRepository();

export const useQuestionBankStore = create<QuestionBankState>((set, get) => ({
  questions: [],
  isLoaded: false,
  isLoading: false,
  error: null,

  loadQuestions: async () => {
    const state = get();
    if (state.isLoaded || state.isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const isSeeded = await repo.isSeeded();

      if (!isSeeded) {
        const transformed = await getTransformedQuestions();
        await repo.seedFromJSON(transformed);
      }

      const questions = await repo.getAll();
      set({ questions, isLoaded: true, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      set({ error: message, isLoading: false });
    }
  },

  getByCategory: (cat: QuestionCategory) => {
    const field = `category${cat}` as keyof Question;
    return get().questions.filter((q) => q[field] === true);
  },

  getById: (id: string) => {
    return get().questions.find((q) => q.id === id);
  },

  search: (query: string, cat?: QuestionCategory) => {
    const lower = query.toLowerCase();
    let results = get().questions.filter(
      (q) =>
        q.id.toLowerCase().includes(lower) ||
        q.stem.toLowerCase().includes(lower)
    );
    if (cat) {
      const field = `category${cat}` as keyof Question;
      results = results.filter((q) => q[field] === true);
    }
    return results;
  },
}));

export interface QuestionProgress {
  id: string;
  correctCount: number;
  wrongCount: number;
  lastAnsweredAt: number;
  consecutiveCorrect: number;
}

export interface CategoryStats {
  category: "A" | "B" | "C" | null;
  totalQuestions: number;
  answeredQuestions: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  masteredCount: number;
  weakCount: number;
}

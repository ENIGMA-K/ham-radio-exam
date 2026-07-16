import type { QuestionCategory } from "./Question";

export interface ExamQuestionResult {
  questionId: string;
  selectedAnswer: string | null;
  isCorrect: boolean;
  timeSpent?: number;
}

export interface ExamResult {
  id?: number;
  category: QuestionCategory;
  totalQuestions: number;
  answeredQuestions: number;
  correctCount: number;
  wrongCount: number;
  score: number;
  timeUsed: number;
  questionResults: ExamQuestionResult[];
  startedAt: number;
  completedAt: number;
}

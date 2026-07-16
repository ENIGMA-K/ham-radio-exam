import type { PracticeMode, QuestionCategory } from "./Question";

export interface PracticeSession {
  id?: number;
  category: QuestionCategory;
  mode: PracticeMode;
  questionsAttempted: number;
  correctCount: number;
  wrongCount: number;
  startedAt: number;
  endedAt: number;
}

import type { QuestionCategory } from "@/models/Question";
import type { ExamResult } from "@/models/ExamResult";

export interface IExamRepository {
  saveResult(result: ExamResult): Promise<number>;
  getAllResults(limit?: number, category?: QuestionCategory): Promise<ExamResult[]>;
  getResult(id: number): Promise<ExamResult | null>;
}

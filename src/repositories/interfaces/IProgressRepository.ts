import type { QuestionCategory } from "@/models/Question";
import type { QuestionProgress, CategoryStats } from "@/models/QuestionProgress";
import type { ExportData } from "@/models/ExportData";

export interface IProgressRepository {
  getProgress(questionId: string): Promise<QuestionProgress | undefined>;
  getAllProgress(category?: QuestionCategory): Promise<QuestionProgress[]>;
  upsertProgress(progress: QuestionProgress): Promise<void>;
  bulkUpsertProgress(records: QuestionProgress[]): Promise<void>;
  getStats(questionIds: string[], category?: QuestionCategory): Promise<CategoryStats>;
  exportAll(): Promise<ExportData>;
  importAll(data: ExportData): Promise<void>;
}

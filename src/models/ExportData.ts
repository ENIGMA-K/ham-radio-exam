import type { QuestionProgress } from "./QuestionProgress";
import type { ExamResult } from "./ExamResult";
import type { PracticeSession } from "./PracticeSession";

export interface ExportData {
  version: 1;
  exportedAt: number;
  progress: QuestionProgress[];
  examResults: ExamResult[];
  practiceSessions: PracticeSession[];
}

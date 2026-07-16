import type { QuestionCategory } from "@/models/Question";
import type { PracticeSession } from "@/models/PracticeSession";

export interface ISessionRepository {
  saveSession(session: PracticeSession): Promise<number>;
  getRecentSessions(limit?: number, category?: QuestionCategory): Promise<PracticeSession[]>;
}

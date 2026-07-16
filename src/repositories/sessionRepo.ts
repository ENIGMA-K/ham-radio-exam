import type { QuestionCategory } from "@/models/Question";
import type { PracticeSession } from "@/models/PracticeSession";
import type { ISessionRepository } from "./interfaces/ISessionRepository";
import { getDB } from "./dexie-db";

export class DexieSessionRepository implements ISessionRepository {
  async saveSession(session: PracticeSession): Promise<number> {
    const db = getDB();
    return db.practiceSessions.add(session);
  }

  async getRecentSessions(
    limit?: number,
    category?: QuestionCategory
  ): Promise<PracticeSession[]> {
    const db = getDB();
    let collection = db.practiceSessions.orderBy("startedAt").reverse();

    if (limit) {
      collection = collection.limit(limit);
    }

    let results = await collection.toArray();

    if (category) {
      results = results.filter((s) => s.category === category);
    }

    return results;
  }
}

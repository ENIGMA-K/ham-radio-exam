import type { QuestionCategory } from "@/models/Question";
import type { ExamResult } from "@/models/ExamResult";
import type { IExamRepository } from "./interfaces/IExamRepository";
import { getDB } from "./dexie-db";

export class DexieExamRepository implements IExamRepository {
  async saveResult(result: ExamResult): Promise<number> {
    const db = getDB();
    return db.examResults.add(result);
  }

  async getAllResults(
    limit?: number,
    category?: QuestionCategory
  ): Promise<ExamResult[]> {
    const db = getDB();
    let collection = db.examResults.orderBy("completedAt").reverse();

    if (limit) {
      collection = collection.limit(limit);
    }

    let results = await collection.toArray();

    if (category) {
      results = results.filter((r) => r.category === category);
    }

    return results;
  }

  async getResult(id: number): Promise<ExamResult | null> {
    const db = getDB();
    return (await db.examResults.get(id)) ?? null;
  }
}

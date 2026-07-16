import type { QuestionCategory } from "@/models/Question";
import type {
  QuestionProgress,
  CategoryStats,
} from "@/models/QuestionProgress";
import type { ExportData } from "@/models/ExportData";
import type { IProgressRepository } from "./interfaces/IProgressRepository";
import { getDB } from "./dexie-db";

export class DexieProgressRepository implements IProgressRepository {
  async getProgress(
    questionId: string
  ): Promise<QuestionProgress | undefined> {
    const db = getDB();
    return db.progress.get(questionId);
  }

  async getAllProgress(
    category?: QuestionCategory
  ): Promise<QuestionProgress[]> {
    const db = getDB();
    const all = await db.progress.toArray();

    if (!category) return all;

    const questions = await db.questions.toArray();
    const categoryIds = new Set(
      questions
        .filter((q) => q[`category${category}` as keyof typeof q] === true)
        .map((q) => q.id)
    );

    return all.filter((p) => categoryIds.has(p.id));
  }

  async upsertProgress(progress: QuestionProgress): Promise<void> {
    const db = getDB();
    await db.progress.put(progress);
  }

  async bulkUpsertProgress(records: QuestionProgress[]): Promise<void> {
    const db = getDB();
    await db.progress.bulkPut(records);
  }

  async getStats(
    questionIds: string[],
    category?: QuestionCategory
  ): Promise<CategoryStats> {
    const db = getDB();
    const allProgress = await db.progress.toArray();
    const idSet = new Set(questionIds);

    const relevant = allProgress.filter((p) => idSet.has(p.id));

    const answeredQuestions = relevant.length;
    const correctCount = relevant.reduce(
      (sum, p) => sum + p.correctCount,
      0
    );
    const wrongCount = relevant.reduce((sum, p) => sum + p.wrongCount, 0);
    const totalAttempts = correctCount + wrongCount;
    const accuracy = totalAttempts > 0 ? correctCount / totalAttempts : 0;
    const masteredCount = relevant.filter(
      (p) => p.consecutiveCorrect >= 2
    ).length;
    const weakCount = relevant.filter((p) => p.wrongCount > p.correctCount).length;

    return {
      category: category ?? null,
      totalQuestions: questionIds.length,
      answeredQuestions,
      correctCount,
      wrongCount,
      accuracy,
      masteredCount,
      weakCount,
    };
  }

  async exportAll(): Promise<ExportData> {
    const db = getDB();
    const progress = await db.progress.toArray();
    const examResults = await db.examResults.toArray();
    const practiceSessions = await db.practiceSessions.toArray();

    return {
      version: 1,
      exportedAt: Date.now(),
      progress,
      examResults,
      practiceSessions,
    };
  }

  async importAll(data: ExportData): Promise<void> {
    if (data.version !== 1) {
      throw new Error(`Unsupported export version: ${data.version}`);
    }
    const db = getDB();
    if (data.progress.length > 0) {
      await db.progress.bulkPut(data.progress);
    }
    if (data.examResults.length > 0) {
      await db.examResults.bulkPut(data.examResults);
    }
    if (data.practiceSessions.length > 0) {
      await db.practiceSessions.bulkPut(data.practiceSessions);
    }
  }
}

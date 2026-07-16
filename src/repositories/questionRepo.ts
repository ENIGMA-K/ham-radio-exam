import type { Question, QuestionCategory } from "@/models/Question";
import type { IQuestionRepository } from "./interfaces/IQuestionRepository";
import { getDB } from "./dexie-db";

export class DexieQuestionRepository implements IQuestionRepository {
  async seedFromJSON(questions: Question[]): Promise<void> {
    const db = getDB();
    await db.questions.bulkPut(questions);
  }

  async isSeeded(): Promise<boolean> {
    const db = getDB();
    return (await db.questions.count()) > 0;
  }

  async getAll(filter?: { category?: QuestionCategory }): Promise<Question[]> {
    const db = getDB();
    let collection: Question[];

    if (filter?.category) {
      const catField = `category${filter.category}` as keyof Question;
      collection = await db.questions
        .filter((q) => q[catField] === true)
        .toArray();
    } else {
      collection = await db.questions.toArray();
    }

    return collection;
  }

  async getById(id: string): Promise<Question | null> {
    const db = getDB();
    return (await db.questions.get(id)) ?? null;
  }

  async search(
    query: string,
    category?: QuestionCategory
  ): Promise<Question[]> {
    const db = getDB();
    const lower = query.toLowerCase();

    let collection = await db.questions.toArray();

    if (category) {
      const catField = `category${category}` as keyof Question;
      collection = collection.filter((q) => q[catField] === true);
    }

    return collection.filter(
      (q) =>
        q.id.toLowerCase().includes(lower) ||
        q.stem.toLowerCase().includes(lower)
    );
  }

  async getCount(): Promise<number> {
    const db = getDB();
    return db.questions.count();
  }
}

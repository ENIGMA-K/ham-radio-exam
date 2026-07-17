import Dexie, { type Table } from "dexie";
import type { Question } from "@/models/Question";
import type { QuestionProgress } from "@/models/QuestionProgress";
import type { ExamResult } from "@/models/ExamResult";
import type { PracticeSession } from "@/models/PracticeSession";

export class RadioExamDB extends Dexie {
  questions!: Table<Question, string>;
  progress!: Table<QuestionProgress, string>;
  examResults!: Table<ExamResult, number>;
  practiceSessions!: Table<PracticeSession, number>;

  constructor() {
    super("RadioExamDB");

    this.version(1).stores({
      questions: "id, categoryA, categoryB, categoryC",
      progress: "id",
      examResults: "++id, category, completedAt",
      practiceSessions: "++id, category, startedAt",
    });

    this.version(2).upgrade(async (tx) => {
      await tx.table("questions").clear();
    });

    // v3: Clear questions to re-seed with chapter field
    this.version(3).upgrade(async (tx) => {
      await tx.table("questions").clear();
    });
  }
}

let dbInstance: RadioExamDB | null = null;

export function getDB(): RadioExamDB {
  if (!dbInstance) {
    dbInstance = new RadioExamDB();
  }
  return dbInstance;
}

import type { Question, QuestionCategory } from "@/models/Question";

export interface IQuestionRepository {
  seedFromJSON(questions: Question[]): Promise<void>;
  isSeeded(): Promise<boolean>;
  getAll(filter?: { category?: QuestionCategory }): Promise<Question[]>;
  getById(id: string): Promise<Question | null>;
  search(query: string, category?: QuestionCategory): Promise<Question[]>;
  getCount(): Promise<number>;
}

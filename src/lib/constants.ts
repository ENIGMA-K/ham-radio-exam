import type { QuestionCategory, PracticeMode } from "@/models/Question";

export const CATEGORIES: QuestionCategory[] = ["A", "B", "C"];

export const CATEGORY_CONFIG: Record<
  QuestionCategory,
  { label: string; examQuestionCount: number; examTimeMinutes: number }
> = {
  A: { label: "A 类", examQuestionCount: 30, examTimeMinutes: 30 },
  B: { label: "B 类", examQuestionCount: 50, examTimeMinutes: 60 },
  C: { label: "C 类", examQuestionCount: 80, examTimeMinutes: 90 },
};

export const PRACTICE_MODE_LABELS: Record<PracticeMode, string> = {
  sequential: "顺序练习",
  random: "随机练习",
  wrong: "错题重做",
  "high-error": "常错题优先",
};

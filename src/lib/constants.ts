import type { QuestionCategory, PracticeMode } from "@/models/Question";

export const CATEGORIES: QuestionCategory[] = ["A", "B", "C"];

export interface ExamConfig {
  label: string;
  /** 单选题数量 */
  singleChoiceCount: number;
  /** 多选题数量 */
  multiChoiceCount: number;
  /** 总题数 */
  get totalQuestions(): number;
  /** 考试时间（分钟） */
  examTimeMinutes: number;
  /** 合格所需答对题数 */
  passingScore: number;
}

export const CATEGORY_CONFIG: Record<QuestionCategory, {
  label: string;
  singleChoiceCount: number;
  multiChoiceCount: number;
  examTimeMinutes: number;
  passingScore: number;
}> = {
  A: {
    label: "A 类（初级）",
    singleChoiceCount: 32,
    multiChoiceCount: 8,
    examTimeMinutes: 40,
    passingScore: 30,
  },
  B: {
    label: "B 类（中级）",
    singleChoiceCount: 45,
    multiChoiceCount: 15,
    examTimeMinutes: 60,
    passingScore: 45,
  },
  C: {
    label: "C 类（高级）",
    singleChoiceCount: 70,
    multiChoiceCount: 20,
    examTimeMinutes: 90,
    passingScore: 70,
  },
};

/** Get total question count for a category */
export function examTotalQuestions(cat: QuestionCategory): number {
  const c = CATEGORY_CONFIG[cat];
  return c.singleChoiceCount + c.multiChoiceCount;
}

export const PRACTICE_MODE_LABELS: Record<PracticeMode, string> = {
  sequential: "顺序练习",
  random: "随机练习",
  wrong: "错题重做",
  "high-error": "常错题优先",
};

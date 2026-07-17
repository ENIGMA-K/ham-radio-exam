import type { QuestionCategory, PracticeMode } from "@/models/Question";

export const CATEGORIES: QuestionCategory[] = ["A", "B", "C"];

export interface ExamConfig {
  label: string;
  singleChoiceCount: number;
  multiChoiceCount: number;
  examTimeMinutes: number;
  passingScore: number;
}

export const CATEGORY_CONFIG: Record<QuestionCategory, {
  label: string;
  singleChoiceCount: number;
  multiChoiceCount: number;
  examTimeMinutes: number;
  passingScore: number;
}> = {
  A: { label: "A 类（初级）", singleChoiceCount: 32, multiChoiceCount: 8, examTimeMinutes: 40, passingScore: 30 },
  B: { label: "B 类（中级）", singleChoiceCount: 45, multiChoiceCount: 15, examTimeMinutes: 60, passingScore: 45 },
  C: { label: "C 类（高级）", singleChoiceCount: 70, multiChoiceCount: 20, examTimeMinutes: 90, passingScore: 70 },
};

export function examTotalQuestions(cat: QuestionCategory): number {
  const c = CATEGORY_CONFIG[cat];
  return c.singleChoiceCount + c.multiChoiceCount;
}

export const PRACTICE_MODE_LABELS: Record<PracticeMode, string> = {
  sequential: "顺序练习",
  random: "随机练习",
  wrong: "错题重做",
  "high-error": "常错题优先",
  chapter: "章节练习",
};

export const CHAPTERS = [
  "法规体系", "呼号与识别", "设台与执照", "操作权限",
  "通联程序", "Q简语缩语", "频率与波段", "发射与调制",
  "接收与信号处理", "电路与元器件", "天线基础", "电波传播",
  "电磁兼容与安全", "电源与电池", "中继台与卫星", "其他",
] as const;

export type Chapter = (typeof CHAPTERS)[number];

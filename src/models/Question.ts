export interface RawQuestion {
  题号: string;
  题干: string;
  正确答案: string;
  选项A: string;
  选项B: string;
  选项C: string;
  选项D: string;
  是否包含图片: string;
  A类: number;
  B类: number;
  C类: number;
  正确积分: number;
  答题次数: number;
}

export type QuestionType = "single" | "multi";

export interface Question {
  id: string;
  stem: string;
  /** 正确答案：单选 "A"，多选 "AB" "ACD" 等 */
  correctAnswer: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  imageFilename: string;
  hasImage: boolean;
  categoryA: boolean;
  categoryB: boolean;
  categoryC: boolean;
  /** 题目类型：单选或多选，默认单选 */
  questionType: QuestionType;
}

export type QuestionCategory = "A" | "B" | "C";

export type PracticeMode = "sequential" | "random" | "wrong" | "high-error";

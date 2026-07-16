"use client";

import type { Question } from "@/models/Question";
import { QuestionImage } from "./QuestionImage";
import { OptionButton } from "./OptionButton";

interface QuestionCardProps {
  question: Question;
  selectedOption: string | null;
  showFeedback: boolean;
  onSelect: (option: string) => void;
}

const OPTION_LABELS = ["A", "B", "C", "D"] as const;
const ALL_LETTERS = "ABCD";

export function QuestionCard({
  question,
  selectedOption,
  showFeedback,
  onSelect,
}: QuestionCardProps) {
  const isMulti = question.questionType === "multi";
  const selectedSet = new Set(selectedOption?.split("") ?? []);
  const correctSet = new Set(question.correctAnswer.split(""));

  const getOptionState = (label: string): "default" | "selected" | "correct" | "wrong" => {
    if (!showFeedback) {
      return selectedSet.has(label) ? "selected" : "default";
    }
    // Show feedback
    const isCorrect = correctSet.has(label);
    const isSelected = selectedSet.has(label);
    if (isCorrect) return "correct";
    if (isSelected && !isCorrect) return "wrong";
    return "default";
  };

  const handleClick = (label: string) => {
    if (isMulti) {
      // Toggle multi-select
      const next = new Set(selectedSet);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      onSelect([...next].sort().join(""));
    } else {
      // Single select
      onSelect(label);
    }
  };

  // Determine if answer is correct for feedback
  const isAnswerCorrect = (() => {
    if (!showFeedback || !selectedOption) return null;
    if (isMulti) {
      const userSorted = [...selectedOption].sort().join("");
      const correctSorted = [...question.correctAnswer].sort().join("");
      return userSorted === correctSorted;
    }
    return selectedOption === question.correctAnswer;
  })();

  return (
    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-5">
      {isMulti && (
        <div className="mb-3">
          <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded font-medium">
            多选题
          </span>
        </div>
      )}

      {question.hasImage && (
        <QuestionImage filename={question.imageFilename} />
      )}

      <p className="text-base leading-relaxed mb-5">
        {isMulti && <span className="text-orange-500 font-bold text-xs mr-1">[多选]</span>}
        {question.stem}
      </p>

      {isMulti && !showFeedback && (
        <p className="text-xs text-[var(--muted)] mb-3">可选择多个答案，点击已选中的选项可取消</p>
      )}

      <div className="space-y-2.5">
        {OPTION_LABELS.map((label) => (
          <OptionButton
            key={label}
            label={label}
            text={question[`option${label}` as keyof Question] as string}
            state={getOptionState(label)}
            onClick={() => handleClick(label)}
            disabled={showFeedback}
            isMulti={isMulti}
          />
        ))}
      </div>

      {showFeedback && (
        <div className={`mt-4 p-3 rounded-lg border ${
          isAnswerCorrect
            ? "bg-green-50 border-green-200"
            : "bg-red-50 border-red-200"
        }`}>
          {isAnswerCorrect ? (
            <p className="text-sm text-green-700 font-medium">✓ 回答正确</p>
          ) : (
            <div>
              <p className="text-sm text-red-700 font-medium">✗ 回答错误</p>
              <p className="text-sm text-red-600 mt-1">
                <span className="font-bold">正确答案：{question.correctAnswer.split("").join("、")}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

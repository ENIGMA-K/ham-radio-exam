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

export function QuestionCard({
  question,
  selectedOption,
  showFeedback,
  onSelect,
}: QuestionCardProps) {
  const getOptionState = (label: string) => {
    if (!showFeedback) {
      return selectedOption === label ? "selected" : "default";
    }
    if (label === question.correctAnswer) return "correct";
    if (label === selectedOption && label !== question.correctAnswer)
      return "wrong";
    return "default";
  };

  return (
    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-5">
      {question.hasImage && (
        <QuestionImage filename={question.imageFilename} />
      )}

      <p className="text-base leading-relaxed mb-5">{question.stem}</p>

      <div className="space-y-2.5">
        {OPTION_LABELS.map((label) => (
          <OptionButton
            key={label}
            label={label}
            text={question[`option${label}` as keyof Question] as string}
            state={getOptionState(label)}
            onClick={() => onSelect(label)}
            disabled={showFeedback}
          />
        ))}
      </div>

      {showFeedback && selectedOption !== question.correctAnswer && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            <span className="font-bold">正确答案：{question.correctAnswer}</span>
          </p>
        </div>
      )}
    </div>
  );
}

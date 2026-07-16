"use client";

import type { Question } from "@/models/Question";
import { QuestionImage } from "./QuestionImage";
import { OptionButton } from "./OptionButton";

interface QuestionCardProps {
  question: Question;
  selectedOption: string | null;
  showFeedback: boolean;
  onSelect: (option: string) => void;
  /** Shuffle map: display label → original label. If omitted, uses default A→A, B→B... */
  shuffleMap?: Record<string, string>;
}

const DISPLAY_LABELS = ["A", "B", "C", "D"] as const;

function toOriginalLabel(display: string, map?: Record<string, string>): string {
  return map?.[display] ?? display;
}

function toDisplayLabel(original: string, map?: Record<string, string>): string {
  if (!map) return original;
  for (const [k, v] of Object.entries(map)) {
    if (v === original) return k;
  }
  return original;
}

export function QuestionCard({
  question,
  selectedOption,
  showFeedback,
  onSelect,
  shuffleMap,
}: QuestionCardProps) {
  const isMulti = question.questionType === "multi";
  const selectedSet = new Set(selectedOption?.split("") ?? []);
  const correctOriginalLabels = question.correctAnswer.split("");
  // Convert correct original labels to display labels for highlighting
  const correctDisplaySet = new Set(
    correctOriginalLabels.map((l) => toDisplayLabel(l, shuffleMap))
  );

  const getOptionState = (label: string): "default" | "selected" | "correct" | "wrong" => {
    if (!showFeedback) {
      return selectedSet.has(label) ? "selected" : "default";
    }
    const isCorrectDisplay = correctDisplaySet.has(label);
    const isSelected = selectedSet.has(label);
    if (isCorrectDisplay) return "correct";
    if (isSelected) return "wrong";
    return "default";
  };

  const handleClick = (displayLabel: string) => {
    if (isMulti) {
      const next = new Set(selectedSet);
      if (next.has(displayLabel)) {
        next.delete(displayLabel);
      } else {
        next.add(displayLabel);
      }
      onSelect([...next].sort().join(""));
    } else {
      onSelect(displayLabel);
    }
  };

  // Determine if answer is correct for feedback
  const isAnswerCorrect = (() => {
    if (!showFeedback || !selectedOption) return null;
    if (isMulti) {
      // Convert display labels to original for comparison
      const originalSelected = [...selectedOption]
        .map((l) => toOriginalLabel(l, shuffleMap))
        .sort()
        .join("");
      const correctSorted = [...question.correctAnswer].sort().join("");
      return originalSelected === correctSorted;
    }
    const originalSelected = toOriginalLabel(selectedOption, shuffleMap);
    return originalSelected === question.correctAnswer;
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
        {DISPLAY_LABELS.map((displayLabel) => {
          // Get the original label for this display position
          const originalLabel = toOriginalLabel(displayLabel, shuffleMap);
          // Get the option text from the original position
          const text = question[`option${originalLabel}` as keyof Question] as string;

          return (
            <OptionButton
              key={displayLabel}
              label={displayLabel}
              text={text}
              state={getOptionState(displayLabel)}
              onClick={() => handleClick(displayLabel)}
              disabled={showFeedback}
              isMulti={isMulti}
            />
          );
        })}
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

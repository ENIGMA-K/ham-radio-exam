"use client";

interface OptionButtonProps {
  label: string;
  text: string;
  state: "default" | "selected" | "correct" | "wrong";
  onClick: () => void;
  disabled?: boolean;
  isMulti?: boolean;
}

const STATE_CLASSES: Record<OptionButtonProps["state"], string> = {
  default: "option-btn",
  selected: "option-btn selected",
  correct: "option-btn correct",
  wrong: "option-btn wrong",
};

export function OptionButton({
  label,
  text,
  state,
  onClick,
  disabled = false,
  isMulti = false,
}: OptionButtonProps) {
  return (
    <button
      className={STATE_CLASSES[state]}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="inline-flex items-center gap-2">
        {isMulti ? (
          /* Checkbox for multi-select */
          <span className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs flex-shrink-0 ${
            state === "selected" || state === "correct"
              ? "bg-blue-500 border-blue-500 text-white"
              : state === "wrong"
                ? "bg-red-500 border-red-500 text-white"
                : "border-gray-300"
          }`}>
            {(state === "selected" || state === "correct") && "✓"}
            {state === "wrong" && "✗"}
          </span>
        ) : (
          /* Radio circle for single-select */
          <span className="font-bold mr-1">{label}.</span>
        )}
        <span>{text}</span>
      </span>
    </button>
  );
}

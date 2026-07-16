"use client";

interface OptionButtonProps {
  label: string;
  text: string;
  state: "default" | "selected" | "correct" | "wrong";
  onClick: () => void;
  disabled?: boolean;
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
}: OptionButtonProps) {
  return (
    <button
      className={STATE_CLASSES[state]}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="font-bold mr-2">{label}.</span>
      <span>{text}</span>
    </button>
  );
}

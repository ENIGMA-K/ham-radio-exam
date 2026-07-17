"use client";

import type { PracticeMode } from "@/models/Question";
import { PRACTICE_MODE_LABELS } from "@/lib/constants";

interface ModeSelectorProps {
  currentMode: PracticeMode;
  onModeChange: (mode: PracticeMode) => void;
}

const MODES: PracticeMode[] = ["sequential", "random", "wrong", "high-error", "chapter"];

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="bg-[var(--surface)] border-t border-[var(--border)] px-4 py-2">
      <div className="flex gap-1">
        {MODES.map((mode) => (
          <button
            key={mode}
            className={`mode-tab ${mode === currentMode ? "active" : "inactive"}`}
            onClick={() => onModeChange(mode)}
          >
            {PRACTICE_MODE_LABELS[mode]}
          </button>
        ))}
      </div>
    </div>
  );
}

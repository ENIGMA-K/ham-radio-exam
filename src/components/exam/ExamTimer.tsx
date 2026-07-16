"use client";

import { useEffect, useRef } from "react";
import { formatTime } from "@/lib/utils";

interface ExamTimerProps {
  timeRemaining: number;
  onTick: () => void;
}

export function ExamTimer({ timeRemaining, onTick }: ExamTimerProps) {
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  useEffect(() => {
    const interval = setInterval(() => {
      onTickRef.current();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isWarning = timeRemaining <= 300; // 5 minutes warning

  return (
    <div
      className={`text-sm font-mono font-bold tabular-nums ${
        isWarning ? "text-[var(--danger)] animate-pulse" : "text-[var(--foreground)]"
      }`}
    >
      {formatTime(timeRemaining)}
    </div>
  );
}

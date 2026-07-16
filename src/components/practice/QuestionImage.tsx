"use client";

import { useState } from "react";

interface QuestionImageProps {
  filename: string;
}

export function QuestionImage({ filename }: QuestionImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!filename) return null;

  if (error) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center text-sm text-[var(--muted)] mb-3">
        图片加载失败
      </div>
    );
  }

  return (
    <div className="mb-3">
      {!loaded && (
        <div className="bg-gray-100 rounded-lg animate-pulse" style={{ height: 200 }} />
      )}
      <img
        src={`/images/${filename}`}
        alt="题目配图"
        className={`max-w-full rounded-lg ${loaded ? "block" : "hidden"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}

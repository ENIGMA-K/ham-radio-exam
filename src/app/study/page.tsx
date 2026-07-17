"use client";

import { useEffect, useRef, useState } from "react";
import { AppInitializer } from "@/components/layout/AppInitializer";
import { Header } from "@/components/layout/Header";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function StudyPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const mermaidReady = useRef(false);

  const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  useEffect(() => {
    fetch(`${BASE}/data/study-guide.html`)
      .then((r) => r.text())
      .then((html) => {
        setContent(html);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [BASE]);

  useEffect(() => {
    if (content && !mermaidReady.current) {
      mermaidReady.current = true;
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
      script.onload = () => {
        const m = (window as unknown as Record<string, unknown>).mermaid as { initialize?: (o: Record<string, unknown>) => void } | undefined;
        m?.initialize?.({ startOnLoad: true, theme: "default", securityLevel: "loose" });
      };
      document.head.appendChild(script);
    }
  }, [content]);

  return (
    <AppInitializer>
      <div className="min-h-screen flex flex-col bg-[var(--background)]">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
          {loading ? (
            <LoadingSpinner message="加载教材中..." />
          ) : (
            <div
              className="study-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </main>
      </div>
    </AppInitializer>
  );
}

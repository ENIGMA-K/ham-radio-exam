"use client";

import { useState, useMemo } from "react";
import { AppInitializer } from "@/components/layout/AppInitializer";
import { Header } from "@/components/layout/Header";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResultItem } from "@/components/search/SearchResultItem";
import { EmptyState } from "@/components/shared/EmptyState";
import { useQuestionBankStore } from "@/stores/useQuestionBankStore";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const search = useQuestionBankStore((s) => s.search);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return search(query.trim()).slice(0, 50);
  }, [query, search]);

  return (
    <AppInitializer>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
          <h1 className="text-2xl font-bold">题目检索</h1>
          <SearchBar value={query} onChange={setQuery} />

          {!query.trim() && (
            <EmptyState
              icon="🔍"
              title="搜索题目"
              description="输入题号（如 MC1-0003）或题干关键词进行搜索。"
            />
          )}

          {query.trim() && results.length === 0 && (
            <EmptyState
              icon="📭"
              title="未找到匹配的题目"
              description="尝试不同的关键词或题号。"
            />
          )}

          <div className="space-y-2">
            {results.map((q) => (
              <SearchResultItem key={q.id} question={q} />
            ))}
          </div>

          {results.length > 0 && results.length === 50 && (
            <p className="text-center text-sm text-[var(--muted)]">
              仅显示前 50 条结果，请使用更精确的关键词缩小范围。
            </p>
          )}
        </main>
      </div>
    </AppInitializer>
  );
}

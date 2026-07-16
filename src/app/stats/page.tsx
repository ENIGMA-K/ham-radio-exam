"use client";

import { useMemo } from "react";
import { AppInitializer } from "@/components/layout/AppInitializer";
import { Header } from "@/components/layout/Header";
import { CategoryBreakdown } from "@/components/stats/CategoryBreakdown";
import { HistoryList } from "@/components/stats/HistoryList";
import { ExportImport } from "@/components/stats/ExportImport";
import { useProgressStore } from "@/stores/useProgressStore";
import { CATEGORIES } from "@/lib/constants";

export default function StatsPage() {
  const getStats = useProgressStore((s) => s.getStats);
  const isProgressLoaded = useProgressStore((s) => s.isLoaded);

  const categoryStats = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      category: cat,
      stats: getStats(cat),
    }));
  }, [getStats, isProgressLoaded]);

  return (
    <AppInitializer>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
          <h1 className="text-2xl font-bold">数据统计</h1>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categoryStats.map(({ category, stats }) => (
              <CategoryBreakdown
                key={category}
                category={category}
                stats={stats}
              />
            ))}
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">考试记录</h2>
            <HistoryList />
          </section>

          <section>
            <ExportImport />
          </section>
        </main>
      </div>
    </AppInitializer>
  );
}

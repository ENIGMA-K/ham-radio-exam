"use client";

import { useMemo } from "react";
import { AppInitializer } from "@/components/layout/AppInitializer";
import { Header } from "@/components/layout/Header";
import { CategoryCard } from "@/components/home/CategoryCard";
import { QuickStats } from "@/components/home/QuickStats";
import { useProgressStore } from "@/stores/useProgressStore";
import { CATEGORIES } from "@/lib/constants";

export default function HomePage() {
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
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
          <section>
            <h1 className="text-2xl font-bold mb-4">学习总览</h1>
            <QuickStats />
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">各级别进度</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categoryStats.map(({ category, stats }) => (
                <CategoryCard key={category} category={category} stats={stats} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </AppInitializer>
  );
}

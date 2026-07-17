"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AppInitializer } from "@/components/layout/AppInitializer";
import { Header } from "@/components/layout/Header";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface TocItem { id: string; text: string; level: number; }

declare global { interface Window { mermaid?: { initialize: (o: Record<string, unknown>) => void; run: (o?: Record<string, unknown>) => Promise<void>; }; } }

export default function StudyPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [tocOpen, setTocOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const processHtml = useCallback((html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const items: TocItem[] = [];
    div.querySelectorAll("h2, h3").forEach((el, i) => {
      const id = "sec-" + i; el.id = id;
      items.push({ id, text: el.textContent || "", level: el.tagName === "H2" ? 2 : 3 });
    });
    setToc(items);
    return div.innerHTML;
  }, []);

  useEffect(() => {
    fetch(BASE + "/data/study-guide.html")
      .then((r) => r.text())
      .then((html) => { setContent(processHtml(html)); setLoading(false); })
      .catch(() => setLoading(false));
  }, [BASE, processHtml]);

  const mermaidLoaded = useRef(false);
  useEffect(() => {
    if (mermaidLoaded.current) return;
    mermaidLoaded.current = true;
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    s.onload = () => window.mermaid?.initialize({ startOnLoad: false, theme: "default", securityLevel: "loose" });
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    if (!content || !window.mermaid) return;
    const t = setTimeout(() => {
      window.mermaid?.run({ nodes: contentRef.current?.querySelectorAll(".mermaid") ?? [] });
    }, 200);
    return () => clearTimeout(t);
  }, [content]);

  useEffect(() => {
    if (!content) return;
    const t = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => { for (const e of entries) if (e.isIntersecting) { setActiveId(e.target.id); break; } },
        { rootMargin: "-15% 0px -75% 0px", threshold: 0 }
      );
      document.querySelectorAll(".study-content h2[id], .study-content h3[id]").forEach((el) => observer.observe(el));
    }, 600);
    return () => clearTimeout(t);
  }, [content]);

  const TocLink = ({ item }: { item: TocItem }) => (
    <a key={item.id} href={"#" + item.id}
      className={"block text-[13px] leading-relaxed py-1 px-2 rounded transition-all no-underline truncate " +
        (item.level === 2 ? "pl-2 font-medium" : "pl-5 text-[12px]") + " " +
        (activeId === item.id ? "bg-[var(--primary-light)] text-[var(--primary)]" : "text-[var(--muted)] hover:bg-gray-100 hover:text-[var(--foreground)]")}
    >{item.text}</a>
  );

  return (
    <AppInitializer>
      <div className="min-h-screen flex flex-col bg-[var(--background)]">
        <Header />
        <div className="flex-1 flex max-w-7xl mx-auto w-full relative">
          <aside className="hidden lg:block w-52 flex-shrink-0 border-r border-[var(--border)] bg-[var(--surface)]">
            <nav className="sticky top-[57px] py-5 px-3 max-h-[calc(100vh-57px)] overflow-y-auto">
              <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-[0.15em] mb-3 px-2">目录导航</div>
              {toc.map((item) => <TocLink key={item.id} item={item} />)}
            </nav>
          </aside>

          <div className="lg:hidden fixed bottom-20 left-4 z-50">
            <button onClick={() => setTocOpen(true)}
              className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
          {tocOpen && (
            <div className="lg:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setTocOpen(false)}>
              <div className="absolute left-0 top-0 bottom-0 w-64 bg-[var(--surface)] shadow-xl overflow-y-auto pt-[57px]" onClick={e => e.stopPropagation()}>
                <div className="px-3 py-3 border-b border-[var(--border)] flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-[0.15em]">目录导航</span>
                  <button onClick={() => setTocOpen(false)} className="text-[var(--muted)] text-lg leading-none">&times;</button>
                </div>
                <div className="px-3 py-3">{toc.map((item) => <TocLink key={item.id} item={item} />)}</div>
              </div>
            </div>
          )}

          <main className="flex-1 min-w-0 px-5 lg:px-10 py-8">
            {loading ? <LoadingSpinner message="加载教材中..." /> : (
              <div ref={contentRef} className="study-content" dangerouslySetInnerHTML={{ __html: content }} />
            )}
          </main>
        </div>
      </div>
    </AppInitializer>
  );
}

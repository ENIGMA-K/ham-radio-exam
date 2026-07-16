"use client";

import { useState, useRef } from "react";
import { useProgressStore } from "@/stores/useProgressStore";
import type { ExportData } from "@/models/ExportData";

export function ExportImport() {
  const [message, setMessage] = useState("");
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportData = useProgressStore((s) => s.exportData);
  const importData = useProgressStore((s) => s.importData);

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `radio-exam-progress-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage("导出成功！");
    } catch {
      setMessage("导出失败，请重试。");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setMessage("");

    try {
      const text = await file.text();
      const data: ExportData = JSON.parse(text);

      if (data.version !== 1) {
        throw new Error("不支持的数据版本");
      }

      await importData(data);
      setMessage(
        `导入成功！进度 ${data.progress.length} 条，考试记录 ${data.examResults.length} 条`
      );
    } catch {
      setMessage("导入失败，请检查文件格式。");
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-5">
      <h2 className="font-semibold mb-3">数据管理</h2>
      <p className="text-sm text-[var(--muted)] mb-4">
        导出学习进度备份，或从备份文件恢复进度。
      </p>

      <div className="flex gap-3">
        <button
          onClick={handleExport}
          className="flex-1 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:opacity-90"
        >
          导出进度
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={importing}
          className="flex-1 py-2.5 border border-[var(--border)] rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          {importing ? "导入中..." : "导入进度"}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />

      {message && (
        <p
          className={`mt-3 text-sm ${
            message.includes("失败") ? "text-[var(--danger)]" : "text-[var(--success)]"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

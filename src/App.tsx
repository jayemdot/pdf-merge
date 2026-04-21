import { useState } from 'react';
import { DropZone } from './components/DropZone';
import { PdfList } from './components/PdfList';
import { formatBytes } from './lib/formatBytes';
import { buildDownloadFileName, getPageCount, mergePdfs } from './lib/mergePdfs';
import type { AddFilesError, PdfEntry } from './types';

const MIN_FILES = 2;
const SIZE_WARN_THRESHOLD = 500 * 1024 * 1024;

export default function App() {
  const [entries, setEntries] = useState<PdfEntry[]>([]);
  const [errors, setErrors] = useState<AddFilesError[]>([]);
  const [isMerging, setIsMerging] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    const newErrors: AddFilesError[] = [];
    const additions: PdfEntry[] = [];

    for (const file of files) {
      const isPdf =
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        newErrors.push({
          id: crypto.randomUUID(),
          fileName: file.name,
          reason: 'PDF以外のファイルは追加できません',
        });
        continue;
      }

      const duplicate = entries.some(
        (e) =>
          e.file.name === file.name &&
          e.file.size === file.size &&
          e.file.lastModified === file.lastModified,
      );
      if (duplicate) {
        newErrors.push({
          id: crypto.randomUUID(),
          fileName: file.name,
          reason: '同じファイルが既に追加されています',
        });
        continue;
      }

      try {
        const pageCount = await getPageCount(file);
        additions.push({ id: crypto.randomUUID(), file, pageCount });
      } catch {
        newErrors.push({
          id: crypto.randomUUID(),
          fileName: file.name,
          reason: '読み込めないPDF（破損または暗号化されている可能性）',
        });
      }
    }

    if (additions.length > 0) {
      setEntries((prev) => [...prev, ...additions]);
    }
    if (newErrors.length > 0) {
      setErrors((prev) => [...prev, ...newErrors]);
    }
  };

  const handleRemove = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleClear = () => {
    setEntries([]);
  };

  const handleDismissError = (id: string) => {
    setErrors((prev) => prev.filter((e) => e.id !== id));
  };

  const handleMerge = async () => {
    if (entries.length < MIN_FILES) return;
    setIsMerging(true);
    try {
      const blob = await mergePdfs(entries.map((e) => e.file));
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = buildDownloadFileName();
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setErrors((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          fileName: '結合処理',
          reason:
            err instanceof Error
              ? `結合に失敗しました: ${err.message}`
              : '結合に失敗しました',
        },
      ]);
    } finally {
      setIsMerging(false);
    }
  };

  const canMerge = entries.length >= MIN_FILES && !isMerging;
  const remaining = Math.max(0, MIN_FILES - entries.length);
  const totalSize = entries.reduce((sum, e) => sum + e.file.size, 0);
  const showSizeWarning = totalSize >= SIZE_WARN_THRESHOLD;

  return (
    <div className="min-h-full bg-linear-to-b from-slate-50 to-slate-100 px-4 py-10">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            PDF結合ツール
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            すべての処理はブラウザ内で完結し、ファイルはサーバーに送信されません。
          </p>
        </header>

        <DropZone onFilesSelected={handleFilesSelected} disabled={isMerging} />

        {errors.length > 0 && (
          <ul className="flex flex-col gap-2">
            {errors.map((err) => (
              <li
                key={err.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{err.fileName}</p>
                  <p className="text-xs opacity-90">{err.reason}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDismissError(err.id)}
                  aria-label="エラーを閉じる"
                  className="shrink-0 rounded text-rose-600 hover:bg-rose-100 hover:text-rose-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {entries.length > 0 ? (
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                {remaining > 0 ? (
                  <>
                    あと<span className="mx-1 font-semibold text-slate-900">{remaining}</span>件必要です（現在
                    <span className="mx-1 font-semibold text-slate-900">{entries.length}</span>件 ・ {formatBytes(totalSize)}）
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-slate-900">{entries.length}</span>件
                    ・<span className="mx-1 font-semibold text-slate-900">{formatBytes(totalSize)}</span>
                    ・ドラッグで並び替えできます
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                すべてクリア
              </button>
            </div>

            {showSizeWarning && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 h-4 w-4 shrink-0"
                >
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                  <line x1="12" x2="12" y1="9" y2="13" />
                  <line x1="12" x2="12.01" y1="17" y2="17" />
                </svg>
                <p>
                  合計サイズが{formatBytes(totalSize)}と大きいため、結合時にブラウザが重くなる・タブがクラッシュする可能性があります。
                </p>
              </div>
            )}

            <PdfList
              entries={entries}
              onReorder={setEntries}
              onRemove={handleRemove}
            />
          </section>
        ) : (
          <p className="rounded-lg bg-white/60 px-4 py-6 text-center text-sm text-slate-500">
            まだPDFが追加されていません。2件以上のPDFを追加すると結合できます。
          </p>
        )}

        <button
          type="button"
          onClick={handleMerge}
          disabled={!canMerge}
          className={[
            'flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-semibold shadow-sm transition-colors',
            canMerge
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800'
              : 'cursor-not-allowed bg-slate-200 text-slate-400',
          ].join(' ')}
        >
          {isMerging ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 animate-spin"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              結合中...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              結合してダウンロード
            </>
          )}
        </button>

        <footer className="pt-4 text-center text-xs text-slate-400">
          pdf-merge · すべて無料・登録不要・ブラウザ内処理
        </footer>
      </div>
    </div>
  );
}

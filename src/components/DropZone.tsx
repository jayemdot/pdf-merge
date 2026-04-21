import { useRef, useState } from 'react';
import type { DragEvent, ChangeEvent } from 'react';

type Props = {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
};

export function DropZone({ onFilesSelected, disabled = false }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) onFilesSelected(files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onFilesSelected(files);
    e.target.value = '';
  };

  return (
    <label
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[
        'group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors',
        disabled
          ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
          : isDragging
            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
            : 'border-slate-300 bg-white text-slate-600 hover:border-indigo-400 hover:bg-indigo-50/40',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-10 w-10 opacity-70"
      >
        <path d="M4 14.9V17a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2.1" />
        <path d="m8 9 4-4 4 4" />
        <path d="M12 5v10" />
      </svg>
      <div className="space-y-1">
        <p className="text-base font-medium">
          ここにPDFをドラッグ&ドロップ
        </p>
        <p className="text-sm opacity-80">
          または<span className="font-semibold underline decoration-dotted underline-offset-4"> クリックしてファイルを選択</span>（複数可）
        </p>
      </div>
    </label>
  );
}

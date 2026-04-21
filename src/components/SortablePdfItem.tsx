import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { PdfEntry } from '../types';
import { formatBytes } from '../lib/formatBytes';

type Props = {
  entry: PdfEntry;
  index: number;
  onRemove: (id: string) => void;
};

export function SortablePdfItem({ entry, index, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: entry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={[
        'flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm',
        isDragging
          ? 'z-10 border-indigo-400 shadow-lg ring-2 ring-indigo-300'
          : 'border-slate-200',
      ].join(' ')}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`ファイルを並び替え: ${entry.file.name}`}
        className="flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <circle cx="9" cy="5" r="1.4" />
          <circle cx="15" cy="5" r="1.4" />
          <circle cx="9" cy="12" r="1.4" />
          <circle cx="15" cy="12" r="1.4" />
          <circle cx="9" cy="19" r="1.4" />
          <circle cx="15" cy="19" r="1.4" />
        </svg>
      </button>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xs font-semibold text-indigo-700">
        {index + 1}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">
          {entry.file.name}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          {entry.pageCount} ページ ・ {formatBytes(entry.file.size)}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(entry.id)}
        aria-label={`削除: ${entry.file.name}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </li>
  );
}

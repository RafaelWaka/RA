import type { Source } from "@/lib/types";

export function SourceList({ sources }: { sources?: Source[] }) {
  if (!sources || sources.length === 0) return null;
  return (
    <div className="not-prose mt-10 rounded-md border border-ink-100 bg-ink-50 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
        Sources citées dans cet article
      </p>
      <ul className="space-y-1 text-sm">
        {sources.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-700 underline decoration-ink-300 underline-offset-2 hover:decoration-brand-600"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

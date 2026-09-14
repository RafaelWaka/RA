import type { AnyEntry } from "@/lib/content";
import { ArticleCard } from "./article-card";

export function RelatedContent({ entries }: { entries: AnyEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h2 className="mb-5 font-serif text-2xl font-bold text-ink-950">
        À lire aussi
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <ArticleCard key={`${entry.type}-${entry.slug}`} entry={entry} />
        ))}
      </div>
    </section>
  );
}

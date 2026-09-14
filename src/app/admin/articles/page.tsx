import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Articles publiés" };
export const dynamic = "force-dynamic";

export default function AdminArticlesPage() {
  const articles = getAllArticles();

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink-950">
        Articles publiés
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        {articles.length} article(s) en ligne.
      </p>

      <div className="mt-6 divide-y divide-ink-100 rounded-lg border border-ink-100 bg-white">
        {articles.map((entry) => (
          <div
            key={entry.slug}
            className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <Link
                href={`/articles/${entry.slug}`}
                className="font-medium text-ink-900 hover:text-brand-700"
              >
                {entry.frontmatter.title}
              </Link>
              <p className="text-xs text-ink-500">
                {entry.author.name} · {formatDate(entry.frontmatter.publishedAt)}
              </p>
            </div>
            <span className="text-xs text-ink-400">{entry.frontmatter.category}</span>
          </div>
        ))}
        {articles.length === 0 && (
          <p className="p-6 text-sm text-ink-500">Aucun article publié.</p>
        )}
      </div>
    </div>
  );
}

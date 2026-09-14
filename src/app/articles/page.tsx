import type { Metadata } from "next";
import { getAllArticles } from "@/lib/content";
import { ArticleCard } from "@/components/site/article-card";
import { Pagination } from "@/components/site/pagination";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { buildMetadata } from "@/lib/seo";

const PER_PAGE = 9;

export const metadata: Metadata = buildMetadata({
  title: "Articles",
  description:
    "Tous les articles du Recruteur de Demain : sourcing, IA, outils et méthodes de recrutement.",
  path: "/articles",
});

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const all = getAllArticles();
  const currentPage = Math.max(1, Number(page) || 1);
  const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const pageEntries = all.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ name: "Articles", path: "/articles" }]} />
      <h1 className="mt-3 font-serif text-3xl font-bold text-ink-950 sm:text-4xl">
        Articles
      </h1>
      <p className="mt-2 max-w-2xl text-ink-600">
        Sourcing, IA, outils, méthodes : l&apos;actualité et l&apos;analyse du
        recrutement, sourcées et vérifiées.
      </p>

      {pageEntries.length === 0 ? (
        <p className="mt-10 text-ink-500">Aucun article pour le moment.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageEntries.map((entry) => (
            <ArticleCard key={entry.slug} entry={entry} />
          ))}
        </div>
      )}

      <Pagination
        basePath="/articles"
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}

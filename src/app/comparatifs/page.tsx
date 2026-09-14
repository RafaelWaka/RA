import type { Metadata } from "next";
import { getAllComparatifs } from "@/lib/content";
import { ArticleCard } from "@/components/site/article-card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Comparatifs d'outils",
  description:
    "Comparatifs objectifs et sourcés des outils de sourcing, d'enrichissement et d'automatisation pour recruteurs.",
  path: "/comparatifs",
});

export default function ComparatifsPage() {
  const comparatifs = getAllComparatifs();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ name: "Comparatifs", path: "/comparatifs" }]} />
      <h1 className="mt-3 font-serif text-3xl font-bold text-ink-950 sm:text-4xl">
        Comparatifs d&apos;outils
      </h1>
      <p className="mt-2 max-w-2xl text-ink-600">
        Prix, fonctionnalités, API, sourcing, enrichissement : des comparatifs
        datés et sourcés, mis à jour régulièrement.
      </p>

      {comparatifs.length === 0 ? (
        <p className="mt-10 text-ink-500">Aucun comparatif pour le moment.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {comparatifs.map((entry) => (
            <ArticleCard key={entry.slug} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

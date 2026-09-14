import type { Metadata } from "next";
import { getAllEtudes } from "@/lib/content";
import { ArticleCard } from "@/components/site/article-card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Études",
  description:
    "Données et enquêtes originales sur le marché du recrutement, le sourcing et l'IA appliquée au RH.",
  path: "/etudes",
});

export default function EtudesPage() {
  const etudes = getAllEtudes();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ name: "Études", path: "/etudes" }]} />
      <h1 className="mt-3 font-serif text-3xl font-bold text-ink-950 sm:text-4xl">
        Études
      </h1>
      <p className="mt-2 max-w-2xl text-ink-600">
        Des données originales, une méthodologie transparente et des
        résultats sourcés sur les pratiques de recrutement.
      </p>

      {etudes.length === 0 ? (
        <p className="mt-10 text-ink-500">Aucune étude pour le moment.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {etudes.map((entry) => (
            <ArticleCard key={entry.slug} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

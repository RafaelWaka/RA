import type { Metadata } from "next";
import { getAllInterviews } from "@/lib/content";
import { ArticleCard } from "@/components/site/article-card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Interviews",
  description:
    "Rencontres avec des recruteurs, chasseurs de tête et experts RH qui font évoluer le métier.",
  path: "/interviews",
});

export default function InterviewsPage() {
  const interviews = getAllInterviews();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ name: "Interviews", path: "/interviews" }]} />
      <h1 className="mt-3 font-serif text-3xl font-bold text-ink-950 sm:text-4xl">
        Interviews
      </h1>
      <p className="mt-2 max-w-2xl text-ink-600">
        Des recruteurs et chasseurs de tête racontent leurs méthodes, leurs
        outils et ce qui a vraiment changé dans leur métier.
      </p>

      {interviews.length === 0 ? (
        <p className="mt-10 text-ink-500">Aucune interview pour le moment.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {interviews.map((entry) => (
            <ArticleCard key={entry.slug} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/categories";
import { getByCategory } from "@/lib/content";
import { ArticleCard } from "@/components/site/article-card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return buildMetadata({
    title: category.name,
    description: category.description,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const entries = getByCategory(category.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[{ name: category.name, path: `/categories/${category.slug}` }]}
      />
      <h1 className="mt-3 font-serif text-3xl font-bold text-ink-950 sm:text-4xl">
        {category.name}
      </h1>
      <p className="mt-2 max-w-2xl text-ink-600">{category.description}</p>

      {entries.length === 0 ? (
        <p className="mt-10 text-ink-500">
          Aucun contenu publié dans cette catégorie pour le moment.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <ArticleCard key={`${entry.type}-${entry.slug}`} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/lib/categories";
import { getByCategory } from "@/lib/content";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Catégories",
  description: "Toutes les catégories du Recruteur de Demain.",
  path: "/categories",
});

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ name: "Catégories", path: "/categories" }]} />
      <h1 className="mt-3 font-serif text-3xl font-bold text-ink-950 sm:text-4xl">
        Catégories
      </h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="rounded-lg border border-ink-100 bg-white p-5 transition hover:border-brand-400 hover:shadow-sm"
          >
            <h2 className="font-serif text-lg font-bold text-ink-950">
              {cat.name}
            </h2>
            <p className="mt-1 text-sm text-ink-600">{cat.description}</p>
            <p className="mt-3 text-xs font-medium text-brand-700">
              {getByCategory(cat.slug).length} contenu(s)
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

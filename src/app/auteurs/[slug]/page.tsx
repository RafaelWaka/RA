import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAuthors, getAuthor } from "@/lib/authors";
import { getAllContent } from "@/lib/content";
import { ArticleCard } from "@/components/site/article-card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { buildMetadata, JsonLd, personJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return getAuthors().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthors().find((a) => a.slug === slug);
  if (!author) return {};
  return buildMetadata({
    title: author.name,
    description: author.bio,
    path: `/auteurs/${author.slug}`,
  });
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let author;
  try {
    author = getAuthor(slug);
  } catch {
    notFound();
  }
  if (!author) notFound();

  const entries = getAllContent().filter(
    (e) => e.author.slug === author.slug
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JsonLd data={personJsonLd(author)} />
      <Breadcrumbs items={[{ name: author.name, path: `/auteurs/${author.slug}` }]} />

      <div className="mt-4 flex items-center gap-4">
        <Image
          src={author.avatar}
          alt={author.name}
          width={72}
          height={72}
          className="rounded-full"
        />
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink-950">
            {author.name}
          </h1>
          <p className="text-sm text-ink-600">{author.role}</p>
        </div>
      </div>
      <p className="mt-4 max-w-2xl text-ink-700">{author.bio}</p>
      {author.linkedin && (
        <a
          href={author.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-medium text-brand-700 hover:underline"
        >
          Profil LinkedIn
        </a>
      )}

      <h2 className="mb-5 mt-10 font-serif text-xl font-bold text-ink-950">
        Publications ({entries.length})
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <ArticleCard key={`${entry.type}-${entry.slug}`} entry={entry} />
        ))}
      </div>
    </div>
  );
}

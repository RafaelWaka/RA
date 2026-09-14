import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllComparatifs,
  getComparatif,
  getRelated,
  pathForEntry,
} from "@/lib/content";
import { ContentHeader } from "@/components/site/content-header";
import { MdxContent } from "@/components/mdx/mdx-content";
import { SourceList } from "@/components/site/source-list";
import { RelatedContent } from "@/components/site/related-content";
import { InlineNewsletter } from "@/components/site/inline-newsletter";
import { ShareLinkedIn } from "@/components/site/share-linkedin";
import { buildMetadata, JsonLd, articleJsonLd, personJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return getAllComparatifs().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getComparatif(slug);
  if (!entry) return {};
  const { frontmatter } = entry;
  return buildMetadata({
    title: frontmatter.seoTitle || frontmatter.title,
    description: frontmatter.seoDescription || frontmatter.excerpt,
    path: pathForEntry(entry),
    image: frontmatter.coverImage,
    type: "article",
    publishedTime: frontmatter.publishedAt,
    modifiedTime: frontmatter.updatedAt,
    authorName: entry.author.name,
  });
}

export default async function ComparatifPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getComparatif(slug);
  if (!entry) notFound();

  const related = getRelated(entry, 3);
  const url = `${siteConfig.url}${pathForEntry(entry)}`;
  const { toolsCompared, lastVerified } = entry.frontmatter;

  return (
    <article>
      <JsonLd data={articleJsonLd(entry)} />
      <JsonLd data={personJsonLd(entry.author)} />
      <ContentHeader entry={entry} />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="not-prose mb-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-clay-500/30 bg-orange-50 px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {toolsCompared.map((tool) => (
              <span
                key={tool}
                className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink-800 shadow-sm"
              >
                {tool}
              </span>
            ))}
          </div>
          <p className="text-xs font-semibold text-clay-600">
            Dernière vérification : {formatDate(lastVerified)}
          </p>
        </div>

        <div className="prose prose-lg prose-headings:font-serif max-w-none">
          <MdxContent source={entry.content} />
        </div>

        <InlineNewsletter />
        <SourceList sources={entry.frontmatter.sources} />

        <div className="mt-8 flex items-center justify-between border-t border-ink-100 pt-6">
          <p className="text-sm text-ink-500">
            Une info obsolète ou incorrecte ?{" "}
            <a href="/contact" className="text-brand-700 underline">
              Signalez-le à la rédaction
            </a>
            .
          </p>
          <ShareLinkedIn url={url} title={entry.frontmatter.title} />
        </div>
      </div>

      <RelatedContent entries={related} />
    </article>
  );
}

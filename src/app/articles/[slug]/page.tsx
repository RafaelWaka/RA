import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles, getArticle, getRelated, pathForEntry } from "@/lib/content";
import { ContentHeader } from "@/components/site/content-header";
import { MdxContent } from "@/components/mdx/mdx-content";
import { SourceList } from "@/components/site/source-list";
import { RelatedContent } from "@/components/site/related-content";
import { InlineNewsletter } from "@/components/site/inline-newsletter";
import { ShareLinkedIn } from "@/components/site/share-linkedin";
import { buildMetadata, JsonLd, articleJsonLd, personJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return getAllArticles().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getArticle(slug);
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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getArticle(slug);
  if (!entry) notFound();

  const related = getRelated(entry, 3);
  const url = `${siteConfig.url}${pathForEntry(entry)}`;

  return (
    <article>
      <JsonLd data={articleJsonLd(entry)} />
      <JsonLd data={personJsonLd(entry.author)} />
      <ContentHeader entry={entry} />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="prose prose-lg prose-headings:font-serif max-w-none">
          <MdxContent source={entry.content} />
        </div>

        <InlineNewsletter />
        <SourceList sources={entry.frontmatter.sources} />

        <div className="mt-8 flex items-center justify-between border-t border-ink-100 pt-6">
          <p className="text-sm text-ink-500">
            Une erreur, une précision à apporter ?{" "}
            <a href="/contact" className="text-brand-700 underline">
              Contactez la rédaction
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

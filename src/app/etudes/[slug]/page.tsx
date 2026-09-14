import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllEtudes, getEtude, getRelated, pathForEntry } from "@/lib/content";
import { ContentHeader } from "@/components/site/content-header";
import { MdxContent } from "@/components/mdx/mdx-content";
import { SourceList } from "@/components/site/source-list";
import { RelatedContent } from "@/components/site/related-content";
import { InlineNewsletter } from "@/components/site/inline-newsletter";
import { ShareLinkedIn } from "@/components/site/share-linkedin";
import { buildMetadata, JsonLd, articleJsonLd, personJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return getAllEtudes().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEtude(slug);
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

export default async function EtudePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEtude(slug);
  if (!entry) notFound();

  const related = getRelated(entry, 3);
  const url = `${siteConfig.url}${pathForEntry(entry)}`;
  const { methodology, respondents, period, downloadUrl } = entry.frontmatter;

  return (
    <article>
      <JsonLd data={articleJsonLd(entry)} />
      <JsonLd data={personJsonLd(entry.author)} />
      <ContentHeader entry={entry} />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="not-prose mb-8 grid gap-4 rounded-lg border border-ink-100 bg-ink-50 p-5 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Méthodologie
            </p>
            <p className="mt-1 text-sm text-ink-800">{methodology}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Répondants
            </p>
            <p className="mt-1 text-sm text-ink-800">{respondents}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Période
            </p>
            <p className="mt-1 text-sm text-ink-800">{period}</p>
          </div>
        </div>

        <div className="prose prose-lg prose-headings:font-serif max-w-none">
          <MdxContent source={entry.content} />
        </div>

        {downloadUrl && (
          <a
            href={downloadUrl}
            className="not-prose mt-8 inline-flex items-center gap-2 rounded-md bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-800"
          >
            Télécharger le rapport complet (PDF)
          </a>
        )}

        <InlineNewsletter />
        <SourceList sources={entry.frontmatter.sources} />

        <div className="mt-8 flex items-center justify-between border-t border-ink-100 pt-6">
          <p className="text-sm text-ink-500">
            Une donnée à challenger ?{" "}
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

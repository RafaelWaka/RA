import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAllInterviews,
  getInterview,
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

export function generateStaticParams() {
  return getAllInterviews().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getInterview(slug);
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

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getInterview(slug);
  if (!entry) notFound();

  const related = getRelated(entry, 3);
  const url = `${siteConfig.url}${pathForEntry(entry)}`;
  const {
    personName,
    personRole,
    personCompany,
    personPhoto,
    personLinkedin,
    youtubeUrl,
  } = entry.frontmatter;

  return (
    <article>
      <JsonLd data={articleJsonLd(entry)} />
      <JsonLd data={personJsonLd(entry.author)} />
      <ContentHeader entry={entry} />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="not-prose mb-8 flex items-center gap-4 rounded-lg border border-ink-100 bg-ink-50 p-5">
          <Image
            src={personPhoto}
            alt={personName}
            width={64}
            height={64}
            className="rounded-full object-cover"
          />
          <div>
            <p className="font-serif text-lg font-bold text-ink-950">
              {personName}
            </p>
            <p className="text-sm text-ink-600">
              {personRole} · {personCompany}
            </p>
            {personLinkedin && (
              <a
                href={personLinkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-xs font-medium text-brand-700 hover:underline"
              >
                Voir le profil LinkedIn
              </a>
            )}
          </div>
        </div>

        {youtubeUrl && (
          <div className="not-prose mb-8 aspect-video overflow-hidden rounded-lg">
            <iframe
              src={youtubeUrl}
              title={`Interview vidéo de ${personName}`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <div className="prose prose-lg prose-headings:font-serif max-w-none">
          <MdxContent source={entry.content} />
        </div>

        <InlineNewsletter />
        <SourceList sources={entry.frontmatter.sources} />

        <div className="mt-8 flex items-center justify-between border-t border-ink-100 pt-6">
          <p className="text-sm text-ink-500">
            Vous voulez témoigner ?{" "}
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

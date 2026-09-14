import type { Metadata } from "next";
import { siteConfig } from "./site";
import type { AnyEntry } from "./content";
import { pathForEntry } from "./content";

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authorName,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image ? `${siteConfig.url}${image}` : `${siteConfig.url}/images/og-default.svg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
      ...(type === "article" && authorName ? { authors: [authorName] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      site: siteConfig.twitter,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.organization.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.svg`,
    sameAs: siteConfig.organization.sameAs,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/articles?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function personJsonLd(author: {
  name: string;
  role: string;
  linkedin?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    ...(author.linkedin ? { sameAs: [author.linkedin] } : {}),
  };
}

export function articleJsonLd(entry: AnyEntry) {
  const url = `${siteConfig.url}${pathForEntry(entry)}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.frontmatter.title,
    description: entry.frontmatter.excerpt,
    image: [`${siteConfig.url}${entry.frontmatter.coverImage}`],
    datePublished: entry.frontmatter.publishedAt,
    dateModified: entry.frontmatter.updatedAt || entry.frontmatter.publishedAt,
    author: {
      "@type": "Person",
      name: entry.author.name,
      ...(entry.author.linkedin ? { sameAs: [entry.author.linkedin] } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.organization.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

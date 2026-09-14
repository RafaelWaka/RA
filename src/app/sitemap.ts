import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { categories } from "@/lib/categories";
import {
  getAllArticles,
  getAllEtudes,
  getAllComparatifs,
  getAllInterviews,
  pathForEntry,
} from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/articles`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/etudes`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/comparatifs`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/interviews`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteConfig.url}/outils`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteConfig.url}/newsletter`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/a-propos`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteConfig.url}/categories/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const contentEntries = [
    ...getAllArticles(),
    ...getAllEtudes(),
    ...getAllComparatifs(),
    ...getAllInterviews(),
  ];

  const contentPages: MetadataRoute.Sitemap = contentEntries.map((entry) => ({
    url: `${siteConfig.url}${pathForEntry(entry)}`,
    lastModified: entry.frontmatter.updatedAt || entry.frontmatter.publishedAt,
    changeFrequency: "monthly",
    priority: entry.frontmatter.featured ? 0.9 : 0.6,
  }));

  return [...staticPages, ...categoryPages, ...contentPages];
}

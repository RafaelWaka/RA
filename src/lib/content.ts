import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getAuthor } from "./authors";
import { estimateReadingTime } from "./reading-time";
import type {
  ComparatifFrontmatter,
  ContentEntry,
  ContentType,
  EtudeFrontmatter,
  InterviewFrontmatter,
  BaseFrontmatter,
} from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

const DIR_BY_TYPE: Record<ContentType, string> = {
  article: "articles",
  etude: "etudes",
  comparatif: "comparatifs",
  interview: "interviews",
};

function readDir(type: ContentType): string[] {
  const dir = path.join(CONTENT_ROOT, DIR_BY_TYPE[type]);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
}

function loadEntry<F extends BaseFrontmatter>(
  type: ContentType,
  filename: string
): ContentEntry<F> {
  const slug = filename.replace(/\.mdx$/, "");
  const fullPath = path.join(CONTENT_ROOT, DIR_BY_TYPE[type], filename);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as F;
  return {
    type,
    slug,
    frontmatter,
    content,
    readingTime: estimateReadingTime(content),
    author: getAuthor(frontmatter.authorSlug),
  };
}

function sortByDateDesc<F extends BaseFrontmatter>(
  entries: ContentEntry<F>[]
): ContentEntry<F>[] {
  return [...entries].sort(
    (a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime()
  );
}

// --- Articles ---
export function getAllArticles(): ContentEntry<BaseFrontmatter>[] {
  return sortByDateDesc(
    readDir("article").map((f) => loadEntry<BaseFrontmatter>("article", f))
  );
}

export function getArticle(slug: string): ContentEntry<BaseFrontmatter> | null {
  const filename = `${slug}.mdx`;
  if (!readDir("article").includes(filename)) return null;
  return loadEntry<BaseFrontmatter>("article", filename);
}

// --- Études ---
export function getAllEtudes(): ContentEntry<EtudeFrontmatter>[] {
  return sortByDateDesc(
    readDir("etude").map((f) => loadEntry<EtudeFrontmatter>("etude", f))
  );
}

export function getEtude(slug: string): ContentEntry<EtudeFrontmatter> | null {
  const filename = `${slug}.mdx`;
  if (!readDir("etude").includes(filename)) return null;
  return loadEntry<EtudeFrontmatter>("etude", filename);
}

// --- Comparatifs ---
export function getAllComparatifs(): ContentEntry<ComparatifFrontmatter>[] {
  return sortByDateDesc(
    readDir("comparatif").map((f) =>
      loadEntry<ComparatifFrontmatter>("comparatif", f)
    )
  );
}

export function getComparatif(
  slug: string
): ContentEntry<ComparatifFrontmatter> | null {
  const filename = `${slug}.mdx`;
  if (!readDir("comparatif").includes(filename)) return null;
  return loadEntry<ComparatifFrontmatter>("comparatif", filename);
}

// --- Interviews ---
export function getAllInterviews(): ContentEntry<InterviewFrontmatter>[] {
  return sortByDateDesc(
    readDir("interview").map((f) =>
      loadEntry<InterviewFrontmatter>("interview", f)
    )
  );
}

export function getInterview(
  slug: string
): ContentEntry<InterviewFrontmatter> | null {
  const filename = `${slug}.mdx`;
  if (!readDir("interview").includes(filename)) return null;
  return loadEntry<InterviewFrontmatter>("interview", filename);
}

// --- Cross-type helpers (homepage, catégories, maillage interne) ---
export type AnyEntry = ContentEntry<BaseFrontmatter>;

export function getAllContent(): AnyEntry[] {
  return sortByDateDesc([
    ...getAllArticles(),
    ...(getAllEtudes() as AnyEntry[]),
    ...(getAllComparatifs() as AnyEntry[]),
    ...(getAllInterviews() as AnyEntry[]),
  ]);
}

export function getFeatured(limit = 3): AnyEntry[] {
  return getAllContent()
    .filter((e) => e.frontmatter.featured)
    .slice(0, limit);
}

export function getByCategory(categorySlug: string): AnyEntry[] {
  return getAllContent().filter(
    (e) => e.frontmatter.category === categorySlug
  );
}

export function getRelated(entry: AnyEntry, limit = 3): AnyEntry[] {
  const pool = getAllContent().filter(
    (e) => !(e.type === entry.type && e.slug === entry.slug)
  );
  const scored = pool.map((candidate) => {
    let score = 0;
    if (candidate.frontmatter.category === entry.frontmatter.category) {
      score += 3;
    }
    const sharedTags = candidate.frontmatter.tags.filter((t) =>
      entry.frontmatter.tags.includes(t)
    );
    score += sharedTags.length;
    return { candidate, score };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.candidate);
}

export function pathForEntry(entry: { type: ContentType; slug: string }): string {
  const base: Record<ContentType, string> = {
    article: "/articles",
    etude: "/etudes",
    comparatif: "/comparatifs",
    interview: "/interviews",
  };
  return `${base[entry.type]}/${entry.slug}`;
}

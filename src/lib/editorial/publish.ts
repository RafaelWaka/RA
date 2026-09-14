import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { commitFile, isGithubConfigured } from "../github";
import type { Draft } from "./types";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

const COVER_POOL = [
  "/images/covers/cover-1.svg",
  "/images/covers/cover-2.svg",
  "/images/covers/cover-3.svg",
  "/images/covers/cover-4.svg",
];

function pickCover(seed: string): string {
  const index =
    Math.abs(seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) %
    COVER_POOL.length;
  return COVER_POOL[index];
}

function buildMdxFile(draft: Draft): string {
  const frontmatter = {
    title: draft.title,
    subtitle: draft.subtitle,
    excerpt: draft.excerpt,
    authorSlug: draft.authorSlug,
    category: draft.category,
    tags: draft.tags,
    publishedAt: new Date().toISOString().slice(0, 10),
    coverImage: pickCover(draft.slug),
    coverImageAlt: draft.title,
    featured: false,
    seoTitle: draft.seoTitle,
    seoDescription: draft.seoDescription,
    sources: draft.sources.filter((s) => s.url),
  };
  return matter.stringify(draft.content, frontmatter);
}

/**
 * Publication effective d'un brouillon validé.
 *
 * En production (GITHUB_TOKEN configuré) : commit le fichier .mdx sur le
 * dépôt GitHub via l'API Contents (voir src/lib/github.ts). Le push
 * déclenche le redéploiement Vercel habituel ; l'article devient visible
 * sur le site après le build suivant.
 *
 * En développement local (pas de GITHUB_TOKEN) : écrit directement le
 * fichier dans content/articles/, visible immédiatement.
 */
export async function publishDraft(draft: Draft): Promise<string> {
  const relativePath = `content/articles/${draft.slug}.mdx`;
  const file = buildMdxFile(draft);

  if (isGithubConfigured()) {
    await commitFile(relativePath, file, `Publier : ${draft.title}`);
  } else {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true });
    fs.writeFileSync(path.join(ARTICLES_DIR, `${draft.slug}.mdx`), file, "utf-8");
  }

  return `/articles/${draft.slug}`;
}

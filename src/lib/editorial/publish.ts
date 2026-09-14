import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
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
    Math.abs(
      seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
    ) % COVER_POOL.length;
  return COVER_POOL[index];
}

/**
 * Publication effective d'un brouillon validé : écrit un fichier .mdx dans
 * content/articles/ avec toutes les métadonnées SEO nécessaires (voir
 * src/lib/types.ts pour le schéma de frontmatter attendu par le site).
 *
 * Limite connue (voir src/lib/editorial/store.ts) : sur Vercel, le système
 * de fichiers des fonctions serverless est éphémère. Cette fonction est
 * idéale en local ou avec un filesystem persistant (self-host, Docker).
 * En production Vercel, remplacez-la par un commit Git (API GitHub) ou un
 * appel à un headless CMS / une base de données servant les pages.
 */
export function publishDraftAsMdx(draft: Draft): string {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  const filePath = path.join(ARTICLES_DIR, `${draft.slug}.mdx`);

  const frontmatter = {
    title: draft.title,
    subtitle: draft.subtitle,
    excerpt: draft.excerpt,
    authorSlug: "redaction",
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

  const file = matter.stringify(draft.content, frontmatter);
  fs.writeFileSync(filePath, file, "utf-8");
  return `/articles/${draft.slug}`;
}

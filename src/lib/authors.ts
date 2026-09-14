import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { Author } from "./types";

const AUTHORS_PATH = path.join(process.cwd(), "content", "authors.json");

let cache: Author[] | null = null;

export function getAuthors(): Author[] {
  if (!cache) {
    const raw = fs.readFileSync(AUTHORS_PATH, "utf-8");
    cache = JSON.parse(raw) as Author[];
  }
  return cache;
}

export function getAuthor(slug: string): Author {
  const author = getAuthors().find((a) => a.slug === slug);
  if (!author) {
    throw new Error(`Auteur inconnu: ${slug}`);
  }
  return author;
}

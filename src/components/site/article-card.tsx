import Image from "next/image";
import Link from "next/link";
import type { AnyEntry } from "@/lib/content";
import { pathForEntry } from "@/lib/content";
import { formatDateShort } from "@/lib/format";
import { CategoryPill } from "./category-pill";

const TYPE_LABEL: Record<AnyEntry["type"], string> = {
  article: "Article",
  etude: "Étude",
  comparatif: "Comparatif",
  interview: "Interview",
};

export function ArticleCard({
  entry,
  variant = "default",
}: {
  entry: AnyEntry;
  variant?: "default" | "featured" | "compact";
}) {
  const href = pathForEntry(entry);

  if (variant === "compact") {
    return (
      <Link href={href} className="group flex gap-3 py-3">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-ink-100">
          <Image
            src={entry.frontmatter.coverImage}
            alt={entry.frontmatter.coverImageAlt}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="96px"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">
            {TYPE_LABEL[entry.type]}
          </p>
          <h3 className="line-clamp-2 font-serif text-sm font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
            {entry.frontmatter.title}
          </h3>
        </div>
      </Link>
    );
  }

  const isFeatured = variant === "featured";

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-ink-100 bg-white transition hover:shadow-md">
      <Link
        href={href}
        className={`relative block overflow-hidden bg-ink-100 ${
          isFeatured ? "aspect-[16/9]" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={entry.frontmatter.coverImage}
          alt={entry.frontmatter.coverImageAlt}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes={isFeatured ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 1024px) 320px, 100vw"}
        />
        <span className="absolute left-3 top-3 rounded-full bg-ink-950/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          {TYPE_LABEL[entry.type]}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <CategoryPill slug={entry.frontmatter.category} />
        <Link href={href}>
          <h3
            className={`font-serif font-semibold leading-snug text-ink-900 group-hover:text-brand-700 ${
              isFeatured ? "text-2xl" : "text-lg"
            }`}
          >
            {entry.frontmatter.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-ink-600">
          {entry.frontmatter.excerpt}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-ink-500">
          <span>{entry.author.name}</span>
          <span aria-hidden>·</span>
          <time dateTime={entry.frontmatter.publishedAt}>
            {formatDateShort(entry.frontmatter.publishedAt)}
          </time>
          <span aria-hidden>·</span>
          <span>{entry.readingTime} min</span>
        </div>
      </div>
    </article>
  );
}

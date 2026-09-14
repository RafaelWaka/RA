import Image from "next/image";
import Link from "next/link";
import type { AnyEntry } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { CategoryPill } from "./category-pill";
import { Breadcrumbs } from "./breadcrumbs";
import { SeedBanner } from "./seed-banner";

const TYPE_LABEL: Record<AnyEntry["type"], string> = {
  article: "Article",
  etude: "Étude",
  comparatif: "Comparatif",
  interview: "Interview",
};

const TYPE_BASE: Record<AnyEntry["type"], { name: string; path: string }> = {
  article: { name: "Articles", path: "/articles" },
  etude: { name: "Études", path: "/etudes" },
  comparatif: { name: "Comparatifs", path: "/comparatifs" },
  interview: { name: "Interviews", path: "/interviews" },
};

export function ContentHeader({ entry }: { entry: AnyEntry }) {
  const { frontmatter, author, readingTime, type } = entry;
  const section = TYPE_BASE[type];

  return (
    <header className="border-b border-ink-100 bg-white">
      {frontmatter.seed && <SeedBanner />}
      <div className="mx-auto max-w-3xl px-4 pb-8 pt-8 sm:px-6">
        <Breadcrumbs
          items={[section, { name: frontmatter.title, path: "" }]}
        />
        <div className="mt-4 flex items-center gap-2">
          <span className="rounded-full bg-ink-950 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
            {TYPE_LABEL[type]}
          </span>
          <CategoryPill slug={frontmatter.category} />
        </div>
        <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-ink-950 sm:text-4xl">
          {frontmatter.title}
        </h1>
        <p className="mt-3 text-lg text-ink-600">{frontmatter.subtitle}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-ink-600">
          <Image
            src={author.avatar}
            alt={author.name}
            width={36}
            height={36}
            className="rounded-full"
          />
          <div>
            <Link
              href={`/auteurs/${author.slug}`}
              className="font-medium text-ink-900 hover:text-brand-700"
            >
              {author.name}
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-ink-500">
              <time dateTime={frontmatter.publishedAt}>
                {formatDate(frontmatter.publishedAt)}
              </time>
              <span aria-hidden>·</span>
              <span>{readingTime} min de lecture</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto aspect-[21/9] max-w-5xl overflow-hidden bg-ink-100 sm:rounded-lg">
        <Image
          src={frontmatter.coverImage}
          alt={frontmatter.coverImageAlt}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1024px) 960px, 100vw"
        />
      </div>
    </header>
  );
}

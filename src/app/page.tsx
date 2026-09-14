import Link from "next/link";
import {
  getAllArticles,
  getFeatured,
  getAllEtudes,
  getAllComparatifs,
  getAllInterviews,
} from "@/lib/content";
import { ArticleCard } from "@/components/site/article-card";
import { CategoryPill } from "@/components/site/category-pill";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { SaasCta } from "@/components/site/saas-cta";
import { categories } from "@/lib/categories";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  const featured = getFeatured(3);
  const latestArticles = getAllArticles().slice(0, 6);
  const latestEtudes = getAllEtudes().slice(0, 3);
  const latestComparatifs = getAllComparatifs().slice(0, 3);
  const latestInterviews = getAllInterviews().slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ink-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">
              Le média des recruteurs
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-ink-950 sm:text-5xl">
              {siteConfig.baseline}
            </h1>
            <p className="mt-4 text-lg text-ink-600">
              Sourcing, IA, outils, méthodes et données : {siteConfig.name} décrypte
              ce qui change vraiment le métier de recruteur, avec des sources
              vérifiées et des analyses sans jargon.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.slice(0, 5).map((c) => (
                <CategoryPill key={c.slug} slug={c.slug} size="md" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Articles mis en avant */}
        {featured.length > 0 && (
          <section aria-labelledby="featured-heading" className="mb-16">
            <SectionHeading id="featured-heading" title="À la une" />
            <div className="grid gap-6 lg:grid-cols-3">
              {featured.map((entry, i) => (
                <div key={`${entry.type}-${entry.slug}`} className={i === 0 ? "lg:col-span-2" : ""}>
                  <ArticleCard entry={entry} variant="featured" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Derniers articles */}
        <section aria-labelledby="latest-heading" className="mb-16">
          <SectionHeading
            id="latest-heading"
            title="Derniers articles"
            href="/articles"
            linkLabel="Tous les articles"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((entry) => (
              <ArticleCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </section>

        {/* CTA SaaS discret */}
        <section className="mb-16">
          <SaasCta />
        </section>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Études */}
          <section aria-labelledby="etudes-heading">
            <SectionHeading
              id="etudes-heading"
              title="Dernières études"
              href="/etudes"
              linkLabel="Toutes les études"
            />
            <div className="divide-y divide-ink-100 rounded-lg border border-ink-100 bg-white px-4">
              {latestEtudes.map((entry) => (
                <ArticleCard key={entry.slug} entry={entry} variant="compact" />
              ))}
            </div>
          </section>

          {/* Comparatifs */}
          <section aria-labelledby="comparatifs-heading">
            <SectionHeading
              id="comparatifs-heading"
              title="Comparatifs d'outils"
              href="/comparatifs"
              linkLabel="Tous les comparatifs"
            />
            <div className="divide-y divide-ink-100 rounded-lg border border-ink-100 bg-white px-4">
              {latestComparatifs.map((entry) => (
                <ArticleCard key={entry.slug} entry={entry} variant="compact" />
              ))}
            </div>
          </section>
        </div>

        {/* Interviews */}
        {latestInterviews.length > 0 && (
          <section aria-labelledby="interviews-heading" className="mt-16">
            <SectionHeading
              id="interviews-heading"
              title="Interviews"
              href="/interviews"
              linkLabel="Toutes les interviews"
            />
            <div className="grid gap-6 sm:grid-cols-2">
              {latestInterviews.map((entry) => (
                <ArticleCard key={entry.slug} entry={entry} />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="mt-16 rounded-xl bg-ink-950 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">
            Recevez la sélection de la semaine
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-300">
            Les meilleurs articles, études et outils du recrutement, chaque
            semaine dans votre boîte mail.
          </p>
          <div className="mx-auto mt-6 max-w-md">
            <NewsletterForm compact source="homepage" />
          </div>
        </section>
      </div>
    </>
  );
}

function SectionHeading({
  id,
  title,
  href,
  linkLabel,
}: {
  id: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <h2 id={id} className="font-serif text-2xl font-bold text-ink-950">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-sm font-medium text-brand-700 hover:text-brand-900"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

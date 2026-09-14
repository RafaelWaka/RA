import Link from "next/link";
import { categories } from "@/lib/categories";
import { siteConfig } from "@/lib/site";
import { NewsletterForm } from "./newsletter-form";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-100 bg-ink-950 text-ink-200">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <p className="font-serif text-xl font-bold text-white">
              {siteConfig.name}
            </p>
            <p className="mt-1 text-sm text-ink-400">{siteConfig.baseline}</p>
            <p className="mt-4 max-w-sm text-sm text-ink-400">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Catégories
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-ink-300 hover:text-white"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Le média
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/a-propos" className="text-ink-300 hover:text-white">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/etudes" className="text-ink-300 hover:text-white">
                  Études
                </Link>
              </li>
              <li>
                <Link href="/comparatifs" className="text-ink-300 hover:text-white">
                  Comparatifs
                </Link>
              </li>
              <li>
                <Link href="/interviews" className="text-ink-300 hover:text-white">
                  Interviews
                </Link>
              </li>
              <li>
                <Link href="/outils" className="text-ink-300 hover:text-white">
                  Outils
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-ink-300 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Newsletter
            </p>
            <p className="mt-3 text-sm text-ink-400">
              Une sélection chaque semaine, sans spam.
            </p>
            <div className="mt-3">
              <NewsletterForm source="footer" />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-ink-800 pt-6 text-xs text-ink-500 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Tous droits
            réservés.
          </p>
          <p>
            Conçu par l&apos;équipe de{" "}
            <a
              href={siteConfig.saas.url}
              className="underline decoration-ink-700 underline-offset-2 hover:text-white"
            >
              {siteConfig.saas.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

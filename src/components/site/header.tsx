import Link from "next/link";
import { categories } from "@/lib/categories";
import { siteConfig } from "@/lib/site";

const NAV = categories.slice(0, 6);

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg font-bold text-ink-950">
              {siteConfig.name}
            </span>
            <span className="hidden text-[11px] uppercase tracking-wide text-ink-500 sm:block">
              {siteConfig.baseline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-ink-700 lg:flex">
          {NAV.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="transition hover:text-brand-700"
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/interviews" className="transition hover:text-brand-700">
            Interviews
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/newsletter"
            className="hidden rounded-md bg-ink-950 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-ink-800 sm:block"
          >
            Newsletter
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <rect width="32" height="32" rx="7" fill="#20392f" />
      <path
        d="M9 22V10h6.2c2.9 0 4.8 1.7 4.8 4.3 0 1.9-1 3.2-2.6 3.8l3 3.9h-3l-2.6-3.5h-2.5V22H9Zm3.3-6.4h2.6c1.3 0 2-.6 2-1.7 0-1.1-.7-1.7-2-1.7h-2.6v3.4Z"
        fill="#f3f8f3"
      />
    </svg>
  );
}

function MobileNav() {
  return (
    <details className="relative lg:hidden">
      <summary className="list-none rounded-md border border-ink-200 p-2 [&::-webkit-details-marker]:hidden">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="sr-only">Ouvrir le menu</span>
      </summary>
      <div className="absolute right-0 top-12 w-56 rounded-lg border border-ink-100 bg-white p-3 shadow-lg">
        <ul className="flex flex-col gap-1 text-sm">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/categories/${cat.slug}`}
                className="block rounded px-2 py-1.5 hover:bg-ink-50"
              >
                {cat.name}
              </Link>
            </li>
          ))}
          <li className="mt-1 border-t border-ink-100 pt-1">
            <Link href="/newsletter" className="block rounded px-2 py-1.5 hover:bg-ink-50">
              Newsletter
            </Link>
          </li>
          <li>
            <Link href="/a-propos" className="block rounded px-2 py-1.5 hover:bg-ink-50">
              À propos
            </Link>
          </li>
          <li>
            <Link href="/contact" className="block rounded px-2 py-1.5 hover:bg-ink-50">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </details>
  );
}

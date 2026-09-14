import Link from "next/link";
import type { Metadata } from "next";
import { LogoutButton } from "./logout-button";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { default: "Dashboard éditorial", template: "%s · Dashboard" },
};

const NAV = [
  { href: "/admin", label: "Vue d'ensemble" },
  { href: "/admin/idees", label: "Idées à valider" },
  { href: "/admin/brouillons", label: "Brouillons à valider" },
  { href: "/admin/articles", label: "Publiés" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/contact", label: "Contact" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink-50">
      <div className="border-b border-ink-200 bg-ink-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-serif text-lg font-bold">
              Dashboard éditorial
            </Link>
            <nav className="hidden gap-4 text-sm text-ink-300 sm:flex">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-ink-400 hover:text-white">
              Voir le site →
            </Link>
            <LogoutButton />
          </div>
        </div>
        <nav className="flex gap-4 overflow-x-auto px-4 pb-3 text-sm text-ink-300 sm:hidden">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}

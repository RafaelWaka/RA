import Link from "next/link";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export function Breadcrumbs({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const full = [{ name: "Accueil", path: "/" }, ...items];
  return (
    <nav aria-label="Fil d'Ariane" className="text-xs text-ink-500">
      <JsonLd data={breadcrumbJsonLd(full)} />
      <ol className="flex flex-wrap items-center gap-1.5">
        {full.map((item, i) => (
          <li key={item.path} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {i === full.length - 1 ? (
              <span className="text-ink-700" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link href={item.path} className="hover:text-brand-700">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

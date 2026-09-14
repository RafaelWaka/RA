import type { Metadata } from "next";
import Link from "next/link";
import { getAllComparatifs } from "@/lib/content";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = buildMetadata({
  title: "Outils de recrutement",
  description:
    "Le panorama des outils de sourcing, d'enrichissement et d'automatisation pour recruteurs, avec nos comparatifs sourcés.",
  path: "/outils",
});

const TOOL_FAMILIES = [
  {
    name: "Sourcing & bases de talents",
    description: "Trouver et identifier des profils pertinents.",
  },
  {
    name: "Enrichissement de contacts",
    description: "Retrouver emails et téléphones professionnels vérifiés.",
  },
  {
    name: "Automatisation & séquences",
    description: "Automatiser la prise de contact et les relances.",
  },
  {
    name: "IA & copilotes recruteurs",
    description: "Assistants IA pour rédiger, qualifier et présélectionner.",
  },
];

export default function OutilsPage() {
  const comparatifs = getAllComparatifs();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ name: "Outils", path: "/outils" }]} />
      <h1 className="mt-3 font-serif text-3xl font-bold text-ink-950 sm:text-4xl">
        Outils de recrutement
      </h1>
      <p className="mt-2 max-w-2xl text-ink-600">
        Un panorama des familles d&apos;outils utilisés par les recruteurs,
        avec nos comparatifs sourcés et datés pour choisir en connaissance de
        cause.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {TOOL_FAMILIES.map((family) => (
          <div
            key={family.name}
            className="rounded-lg border border-ink-100 bg-white p-5"
          >
            <h2 className="font-serif text-lg font-bold text-ink-950">
              {family.name}
            </h2>
            <p className="mt-1 text-sm text-ink-600">{family.description}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-5 mt-12 font-serif text-2xl font-bold text-ink-950">
        Nos comparatifs
      </h2>
      {comparatifs.length === 0 ? (
        <p className="text-ink-500">Aucun comparatif pour le moment.</p>
      ) : (
        <div className="divide-y divide-ink-100 rounded-lg border border-ink-100 bg-white">
          {comparatifs.map((entry) => (
            <Link
              key={entry.slug}
              href={`/comparatifs/${entry.slug}`}
              className="flex flex-col justify-between gap-1 p-4 transition hover:bg-ink-50 sm:flex-row sm:items-center"
            >
              <span className="font-medium text-ink-900">
                {entry.frontmatter.title}
              </span>
              <span className="text-xs text-ink-500">
                Vérifié le {formatDate(entry.frontmatter.lastVerified)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

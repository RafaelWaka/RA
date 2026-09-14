import { siteConfig } from "@/lib/site";

export function SaasCta() {
  return (
    <div className="not-prose flex flex-col items-start gap-3 rounded-lg border border-brand-200 bg-brand-50 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-brand-900">
          Produit par l&apos;équipe du Recruteur de Demain
        </p>
        <p className="mt-1 text-sm text-brand-800">{siteConfig.saas.tagline}</p>
      </div>
      <a
        href={siteConfig.saas.url}
        target="_blank"
        rel="noopener noreferrer"
        className="whitespace-nowrap rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800"
      >
        Découvrir l&apos;outil
      </a>
    </div>
  );
}

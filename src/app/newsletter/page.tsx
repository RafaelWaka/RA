import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Newsletter",
  description:
    "Recevez chaque semaine la sélection du Recruteur de Demain : articles, études et outils pour recruteurs.",
  path: "/newsletter",
});

const BENEFITS = [
  "Les meilleurs articles de la semaine, résumés en 2 minutes",
  "Les nouveaux outils et fonctionnalités à connaître",
  "Les études et données publiées récemment",
  "Zéro spam, désinscription en un clic",
];

export default function NewsletterPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ name: "Newsletter", path: "/newsletter" }]} />
      <h1 className="mt-3 font-serif text-3xl font-bold text-ink-950 sm:text-4xl">
        La newsletter {siteConfig.name}
      </h1>
      <p className="mt-3 text-lg text-ink-600">
        Chaque semaine, l&apos;essentiel du recrutement dans votre boîte
        mail : articles, études, comparatifs et interviews sélectionnés par
        la rédaction.
      </p>

      <div className="mt-8 rounded-lg border border-ink-100 bg-white p-6">
        <NewsletterForm source="newsletter-page" />
      </div>

      <ul className="mt-8 space-y-3">
        {BENEFITS.map((b) => (
          <li key={b} className="flex items-start gap-2 text-ink-700">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

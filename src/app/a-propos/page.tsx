import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "À propos",
  description:
    "Le Recruteur de Demain est un média indépendant dédié aux recruteurs, chasseurs de tête et professionnels du sourcing.",
  path: "/a-propos",
});

export default function AProposPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ name: "À propos", path: "/a-propos" }]} />
      <h1 className="mt-3 font-serif text-3xl font-bold text-ink-950 sm:text-4xl">
        À propos du {siteConfig.name}
      </h1>

      <div className="prose prose-lg prose-headings:font-serif mt-8 max-w-none">
        <p>
          <strong>{siteConfig.name}</strong> est un média indépendant dédié
          aux recruteurs, chasseurs de tête, recruteurs indépendants et
          professionnels du sourcing. Notre mission : devenir la référence
          francophone sur le recrutement, le sourcing, les nouvelles méthodes
          de recrutement, l&apos;IA appliquée au RH et l&apos;automatisation
          du métier.
        </p>

        <h2>Notre ligne éditoriale</h2>
        <p>
          Nous refusons les articles génériques. Chaque contenu publié
          privilégie les données originales, les comparatifs sourcés, les
          interviews de recruteurs de terrain et les analyses argumentées
          plutôt que les listes de conseils déjà lues cent fois ailleurs.
        </p>
        <p>
          Toute donnée factuelle citée dans nos articles est sourcée. Les
          comparatifs d&apos;outils affichent une date de dernière
          vérification. Nous distinguons explicitement les faits vérifiés,
          l&apos;analyse éditoriale et l&apos;opinion.
        </p>

        <h2>Un média, pas une brochure produit</h2>
        <p>
          {siteConfig.name} est édité par l&apos;équipe derrière{" "}
          {siteConfig.saas.name}. Le produit peut être mentionné
          ponctuellement, mais notre contenu éditorial est pensé pour être
          utile à tout professionnel du recrutement, qu&apos;il utilise notre
          outil ou non.
        </p>

        <h2>Une équipe de recruteurs et de journalistes</h2>
        <p>
          Notre rédaction combine une expérience opérationnelle du
          recrutement et un vrai travail journalistique : recherche de
          sources, vérification des faits, mise à jour des contenus qui
          datent.
        </p>

        <h2>Nous contacter</h2>
        <p>
          Une question, une correction à proposer, une envie
          d&apos;interview ? Écrivez-nous depuis notre{" "}
          <a href="/contact">page de contact</a>.
        </p>
      </div>
    </div>
  );
}

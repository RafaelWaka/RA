import "server-only";
import type { Draft, Idea } from "./types";

/**
 * Étape 4 du workflow éditorial : génération de l'article à partir d'une
 * idée validée (brief, section 6).
 *
 * CECI EST UN STUB. Il compose un brouillon structuré à partir des champs
 * de l'idée (titre, angle, sources envisagées) SANS jamais inventer de
 * chiffre, de citation ou de fait : le corps généré contient des sections
 * à compléter par la rédaction, pas des affirmations factuelles fabriquées.
 * C'est un choix délibéré pour respecter la charte anti-hallucination
 * (section 14) tant qu'aucun modèle IA n'est branché.
 *
 * Pour brancher la vraie génération :
 * 1. Récupérer le contenu complet des sources listées dans `idea.sources`
 *    (scraping respectueux des CGU, ou API de recherche).
 * 2. Appeler un modèle Claude (Messages API) avec :
 *    - les sources récupérées comme UNIQUE base factuelle autorisée,
 *    - un system prompt exigeant : citation systématique de la source pour
 *      toute donnée chiffrée, refus explicite d'inventer prix, fonctionnalités,
 *      citations ou statistiques absents des sources, séparation claire
 *      faits / analyse / opinion (voir composant <Callout>).
 * 3. Faire proposer par le modèle : titre SEO, meta description, slug,
 *    prompt d'image de couverture, et le contenu Markdown (avec tableaux
 *    pour les comparatifs).
 * 4. Remplacer le corps de `generateDraft()` ci-dessous, en gardant la même
 *    signature (Idea) => Draft, pour que /admin/brouillons continue de
 *    fonctionner sans autre changement.
 *
 * Charte de style éditoriale (à inclure dans le system prompt du modèle) :
 * jamais de tiret cadratin/demi-cadratin ("—", "–") dans le texte rédigé,
 * ça sonne artificiel. Utiliser un point, une virgule ou deux-points pour
 * lier ou séparer une idée.
 */

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function randomId(): string {
  return `draft_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function generateDraft(idea: Idea): Draft {
  const content = `## Introduction

_[Rédaction : introduire le sujet en 2-3 phrases à partir de l'angle validé : "${idea.angle}"]_

<Callout type="analyse">
Cette section d'introduction doit être rédigée ou validée par un humain avant publication. Aucune donnée chiffrée n'a été générée automatiquement.
</Callout>

## Ce que disent les sources

${idea.sources.map((s) => `- [ ] Vérifier et intégrer : ${s}`).join("\n")}

_[Rédaction : pour chaque fait chiffré, ajouter la source correspondante dans le frontmatter \`sources\` et citer-la dans le texte.]_

## Analyse

<Callout type="analyse">
_[Rédaction : ajouter ici l'analyse éditoriale, ce que ces éléments signifient concrètement pour un recruteur.]_
</Callout>

## Ce qu'il faut retenir

_[Rédaction : synthétiser en 3-4 points clés.]_
`;

  return {
    id: randomId(),
    ideaId: idea.id,
    title: idea.title,
    subtitle: idea.angle,
    excerpt: idea.why,
    category: idea.category,
    tags: [idea.seoKeyword, ...idea.secondaryKeywords].slice(0, 5),
    seoTitle: idea.title.length <= 60 ? idea.title : idea.title.slice(0, 57) + "…",
    seoDescription: idea.why.length <= 155 ? idea.why : idea.why.slice(0, 152) + "…",
    slug: slugify(idea.title),
    coverImagePrompt: `Photographie éditoriale, style magazine professionnel RH, illustrant : ${idea.title}`,
    content,
    sources: idea.sources.map((label) => ({ label, url: "" })),
    status: "ready",
    createdAt: new Date().toISOString(),
  };
}

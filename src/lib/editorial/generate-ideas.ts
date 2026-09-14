import "server-only";
import type { Idea } from "./types";

/**
 * Étape 1 + 2 du workflow éditorial : recherche automatique puis génération
 * d'idées (voir brief, sections 5 et 6).
 *
 * CECI EST UN STUB. Il ne fait aucun appel réseau et ne peut donc jamais
 * halluciner de fait : il pioche dans un pool de sujets rédigés à la main,
 * pour que le workflow (recherche → idées → validation → rédaction →
 * validation → publication) soit démontrable de bout en bout sans clé API.
 *
 * Pour brancher la vraie automatisation :
 * 1. Recherche : interroger une API de recherche web / actualités fiable
 *    (ex. Tavily, Exa, Bing News) filtrée sur des sources RH reconnues,
 *    sur les dernières 24-48h. Stocker les résultats bruts (titre, url,
 *    extrait, date) — ce sont les seules sources autorisées à l'étape 2.
 * 2. Génération d'idées : appeler un modèle Claude (Messages API,
 *    voir ANTHROPIC_API_KEY dans .env.example) avec UNIQUEMENT les
 *    résultats de recherche en contexte, et lui demander de proposer
 *    3 à 5 angles differenciants (jamais de contenu générique type
 *    "10 conseils pour..."). Interdire explicitement d'inventer des faits
 *    non présents dans les sources fournies.
 * 3. Remplacer le corps de `generateIdeas()` ci-dessous par ce pipeline,
 *    en conservant la même signature de retour (Idea[]).
 */

const TOPIC_POOL: Omit<
  Idea,
  "id" | "status" | "createdAt"
>[] = [
  {
    title: "Ce que change vraiment l'IA générative dans la présélection de CV",
    angle:
      "Comparer les promesses marketing des outils d'IA de présélection avec des retours d'expérience concrets de recruteurs qui les utilisent depuis plus de 6 mois.",
    why: "Beaucoup d'articles vendent l'IA de tri de CV sans jamais interroger des utilisateurs réels ni discuter des biais introduits.",
    audience: "Recruteurs en entreprise et cabinets utilisant des ATS avec scoring IA",
    seoKeyword: "IA présélection CV",
    secondaryKeywords: ["tri CV intelligence artificielle", "biais IA recrutement", "ATS scoring"],
    sources: [
      "Témoignages de recruteurs (à collecter via interviews)",
      "Documentation produit des éditeurs d'ATS",
      "Études académiques sur les biais algorithmiques en recrutement",
    ],
    format: "analyse",
    category: "ia-recrutement",
  },
  {
    title: "Sourcing multicanal : ce que révèlent les données d'usage des recruteurs indépendants",
    angle:
      "Analyser, chiffres à l'appui, quels canaux de sourcing (LinkedIn, viviers internes, cooptation, job boards de niche) donnent le meilleur taux de réponse en 2026.",
    why: "Le sujet du sourcing multicanal est traité de façon anecdotique ailleurs ; une vraie étude de données manque sur le marché francophone.",
    audience: "Recruteurs indépendants et chasseurs de tête",
    seoKeyword: "sourcing multicanal recrutement",
    secondaryKeywords: ["taux de réponse sourcing", "canaux de sourcing 2026", "cooptation vs LinkedIn"],
    sources: [
      "Enquête à mener auprès de notre audience (formulaire)",
      "Données agrégées et anonymisées d'usage produit",
    ],
    format: "etude",
    category: "sourcing",
  },
  {
    title: "Outils d'enrichissement de contacts : comparatif prix / précision des emails trouvés",
    angle:
      "Tester en conditions réelles plusieurs outils d'enrichissement sur un même échantillon de profils et comparer taux de délivrabilité et prix au contact valide.",
    why: "Les comparatifs existants recopient les argumentaires commerciaux sans jamais tester la précision réelle des données.",
    audience: "Recruteurs et sourceurs utilisant des outils d'enrichissement",
    seoKeyword: "comparatif outils enrichissement email",
    secondaryKeywords: ["prix enrichissement contact", "précision email recruteur", "alternatives enrichissement B2B"],
    sources: [
      "Test interne sur échantillon de profils",
      "Pages tarifaires officielles des éditeurs",
      "Documentation API de chaque outil",
    ],
    format: "comparatif",
    category: "outils",
  },
  {
    title: "Automatiser sans déshumaniser : où les recruteurs indépendants placent la limite",
    angle:
      "Interviewer plusieurs recruteurs indépendants sur ce qu'ils acceptent d'automatiser (relances, prise de RDV) et ce qu'ils refusent (premier contact, entretiens).",
    why: "Le débat automatisation vs relation humaine est souvent caricatural ; les praticiens ont des positions plus nuancées et instructives.",
    audience: "Recruteurs indépendants, freelances du recrutement",
    seoKeyword: "automatisation recrutement relation humaine",
    secondaryKeywords: ["limites automatisation RH", "recruteur indépendant outils", "relance automatique candidat"],
    sources: ["Interviews à réaliser (3-4 recruteurs indépendants)"],
    format: "interview",
    category: "methodes",
  },
  {
    title: "Marché du recrutement en France : ce que disent les derniers chiffres publiés",
    angle:
      "Synthétiser et mettre en perspective les statistiques publiques les plus récentes sur les intentions d'embauche et les métiers en tension.",
    why: "Une synthèse claire et sourcée des données publiques manque pour un public de recruteurs pressés.",
    audience: "Recruteurs, responsables RH, dirigeants de cabinets",
    seoKeyword: "chiffres marché recrutement France",
    secondaryKeywords: ["métiers en tension 2026", "intentions embauche", "statistiques recrutement France"],
    sources: [
      "Publications statistiques publiques officielles (à vérifier et citer précisément)",
      "Communiqués des fédérations professionnelles du recrutement",
    ],
    format: "actualite",
    category: "actualites",
  },
];

function randomId(): string {
  return `idea_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function generateIdeas(count = 5): Idea[] {
  const shuffled = [...TOPIC_POOL].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, Math.min(count, shuffled.length));
  const now = new Date().toISOString();
  return picked.map((topic) => ({
    ...topic,
    id: randomId(),
    status: "pending",
    createdAt: now,
  }));
}

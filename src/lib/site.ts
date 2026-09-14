export const siteConfig = {
  name: "Le Recruteur de Demain",
  shortName: "LRDD",
  baseline: "Les nouvelles façons de recruter",
  description:
    "Le média francophone indépendant des recruteurs, chasseurs de tête et professionnels du sourcing : IA, outils, méthodes, études et retours d'expérience.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "fr_FR",
  twitter: "@recruteurdemain",
  linkedin: "https://www.linkedin.com/company/le-recruteur-de-demain",
  organization: {
    name: "Le Recruteur de Demain",
    legalName: "Le Recruteur de Demain",
    foundingDate: "2026",
    sameAs: [
      "https://www.linkedin.com/company/le-recruteur-de-demain",
    ],
  },
  saas: {
    name: "notre SaaS de sourcing",
    url: "https://example.com",
    tagline: "L'outil de sourcing conçu par l'équipe du Recruteur de Demain",
  },
} as const;

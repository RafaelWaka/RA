export type Category = {
  slug: string;
  name: string;
  description: string;
  color: string;
};

// Ajouter une catégorie ici suffit : elle apparaît automatiquement dans la
// navigation, les pages /categories/[slug] et le maillage interne, sans
// aucune autre modification de code.
export const categories: Category[] = [
  {
    slug: "sourcing",
    name: "Sourcing",
    description:
      "Techniques, canaux et outils pour trouver et approcher les bons candidats.",
    color: "brand",
  },
  {
    slug: "ia-recrutement",
    name: "IA & Recrutement",
    description:
      "Comment l'intelligence artificielle transforme concrètement le métier de recruteur.",
    color: "clay",
  },
  {
    slug: "outils",
    name: "Outils",
    description: "Tests, prises en main et analyses des outils du recruteur.",
    color: "ink",
  },
  {
    slug: "methodes",
    name: "Méthodes",
    description: "Process, organisation et bonnes pratiques de recrutement.",
    color: "brand",
  },
  {
    slug: "etudes",
    name: "Études",
    description: "Données et enquêtes originales sur le marché du recrutement.",
    color: "clay",
  },
  {
    slug: "comparatifs",
    name: "Comparatifs",
    description: "Comparatifs objectifs et sourcés entre outils de recrutement.",
    color: "ink",
  },
  {
    slug: "interviews",
    name: "Interviews",
    description: "Rencontres avec des recruteurs, chasseurs de tête et experts RH.",
    color: "brand",
  },
  {
    slug: "actualites",
    name: "Actualités",
    description: "L'actualité vérifiée du recrutement, du sourcing et des RH.",
    color: "clay",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

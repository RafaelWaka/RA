export type ContentType = "article" | "etude" | "comparatif" | "interview";

export type Source = {
  label: string;
  url: string;
};

export type Author = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  linkedin?: string;
};

export type BaseFrontmatter = {
  title: string;
  subtitle: string;
  excerpt: string;
  authorSlug: string;
  category: string;
  tags: string[];
  publishedAt: string; // ISO date
  updatedAt?: string; // ISO date
  coverImage: string;
  coverImageAlt: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  sources?: Source[];
  format?: "article" | "etude" | "comparatif" | "interview" | "actualite" | "guide" | "analyse";
  /**
   * Contenu d'exemple livré avec le MVP pour démontrer le gabarit éditorial
   * (mise en page, SEO, maillage...). Affiche un bandeau d'avertissement et
   * NE DOIT PAS être considéré comme une donnée vérifiée. À remplacer par
   * du contenu réel produit via le workflow /admin avant mise en production.
   */
  seed?: boolean;
};

export type EtudeFrontmatter = BaseFrontmatter & {
  methodology: string;
  respondents: number;
  period: string;
  downloadUrl?: string;
};

export type ComparatifFrontmatter = BaseFrontmatter & {
  toolsCompared: string[];
  lastVerified: string; // ISO date
};

export type InterviewFrontmatter = BaseFrontmatter & {
  personName: string;
  personRole: string;
  personCompany: string;
  personPhoto: string;
  personLinkedin?: string;
  youtubeUrl?: string;
};

export type Frontmatter =
  | BaseFrontmatter
  | EtudeFrontmatter
  | ComparatifFrontmatter
  | InterviewFrontmatter;

export type ContentEntry<F extends Frontmatter = BaseFrontmatter> = {
  type: ContentType;
  slug: string;
  frontmatter: F;
  content: string;
  readingTime: number; // minutes
  author: Author;
};

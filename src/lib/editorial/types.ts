export type IdeaFormat =
  | "article"
  | "etude"
  | "comparatif"
  | "interview"
  | "actualite"
  | "guide"
  | "analyse";

export type IdeaStatus = "pending" | "validated" | "rejected";

export type Idea = {
  id: string;
  title: string;
  angle: string;
  why: string;
  audience: string;
  seoKeyword: string;
  secondaryKeywords: string[];
  sources: string[];
  format: IdeaFormat;
  category: string;
  status: IdeaStatus;
  createdAt: string;
  customInstructions?: string;
};

export type DraftStatus = "generating" | "ready" | "published" | "rejected";

export type Draft = {
  id: string;
  ideaId: string;
  authorSlug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  slug: string;
  coverImagePrompt: string;
  content: string; // markdown body
  sources: { label: string; url: string }[];
  status: DraftStatus;
  createdAt: string;
  publishedAt?: string;
  publishError?: string;
};

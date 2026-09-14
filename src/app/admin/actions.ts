"use server";

import { revalidatePath } from "next/cache";
import { addIdeas, getIdea, updateIdea } from "@/lib/editorial/ideas";
import { generateIdeas } from "@/lib/editorial/generate-ideas";
import { generateDraft } from "@/lib/editorial/generate-draft";
import { addDraft, getDraft, updateDraft } from "@/lib/editorial/drafts";
import { publishDraftAsMdx } from "@/lib/editorial/publish";

// Étape 1 + 2 : lance la recherche du jour et propose de nouvelles idées.
export async function runResearchAction() {
  const ideas = generateIdeas(5);
  addIdeas(ideas);
  revalidatePath("/admin");
  revalidatePath("/admin/idees");
}

// Étape 3 : validation humaine d'une idée. "valider" déclenche la
// génération du brouillon (étape 4) ; "refuser" clôt le sujet.
export async function decideIdeaAction(formData: FormData) {
  const id = String(formData.get("id"));
  const decision = String(formData.get("decision"));

  if (decision === "refuser") {
    updateIdea(id, { status: "rejected" });
    revalidatePath("/admin/idees");
    return;
  }

  if (decision === "valider") {
    const idea = getIdea(id);
    if (!idea) return;
    updateIdea(id, { status: "validated" });
    const draft = generateDraft(idea);
    addDraft(draft);
    revalidatePath("/admin/idees");
    revalidatePath("/admin/brouillons");
  }
}

export async function editIdeaAction(formData: FormData) {
  const id = String(formData.get("id"));
  updateIdea(id, {
    title: String(formData.get("title") || ""),
    angle: String(formData.get("angle") || ""),
    category: String(formData.get("category") || ""),
    seoKeyword: String(formData.get("seoKeyword") || ""),
    customInstructions: String(formData.get("customInstructions") || ""),
  });
  revalidatePath("/admin/idees");
}

// Étape 7 (validation avant publication) : publier / régénérer / rejeter un
// brouillon.
export async function decideDraftAction(formData: FormData) {
  const id = String(formData.get("id"));
  const decision = String(formData.get("decision"));
  const draft = getDraft(id);
  if (!draft) return;

  if (decision === "rejeter") {
    updateDraft(id, { status: "rejected" });
  } else if (decision === "regenerer") {
    const idea = getIdea(draft.ideaId);
    if (idea) {
      const regenerated = generateDraft(idea);
      updateDraft(id, {
        content: regenerated.content,
        title: regenerated.title,
        subtitle: regenerated.subtitle,
        excerpt: regenerated.excerpt,
        seoTitle: regenerated.seoTitle,
        seoDescription: regenerated.seoDescription,
      });
    }
  } else if (decision === "publier") {
    publishDraftAsMdx(draft);
    updateDraft(id, { status: "published", publishedAt: new Date().toISOString() });
    revalidatePath("/");
    revalidatePath("/articles");
    revalidatePath("/sitemap.xml");
    revalidatePath("/admin/articles");
  }

  revalidatePath("/admin/brouillons");
}

export async function editDraftAction(formData: FormData) {
  const id = String(formData.get("id"));
  updateDraft(id, {
    title: String(formData.get("title") || ""),
    subtitle: String(formData.get("subtitle") || ""),
    excerpt: String(formData.get("excerpt") || ""),
    seoTitle: String(formData.get("seoTitle") || ""),
    seoDescription: String(formData.get("seoDescription") || ""),
    content: String(formData.get("content") || ""),
    authorSlug: String(formData.get("authorSlug") || ""),
  });
  revalidatePath("/admin/brouillons");
}

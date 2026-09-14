"use server";

import { revalidatePath } from "next/cache";
import { addIdeas, getIdea, updateIdea } from "@/lib/editorial/ideas";
import { generateIdeas } from "@/lib/editorial/generate-ideas";
import { generateDraft } from "@/lib/editorial/generate-draft";
import { addDraft, getDraft, updateDraft } from "@/lib/editorial/drafts";
import { publishDraft } from "@/lib/editorial/publish";
import { clearSystemError, setSystemError } from "@/lib/editorial/system-status";

// Étape 1 + 2 : lance la recherche du jour et propose de nouvelles idées.
export async function runResearchAction() {
  try {
    const ideas = generateIdeas(5);
    await addIdeas(ideas);
    await clearSystemError();
  } catch (e) {
    await setSystemError(e instanceof Error ? e.message : String(e));
  }
  revalidatePath("/admin");
  revalidatePath("/admin/idees");
}

export async function dismissSystemErrorAction() {
  await clearSystemError();
  revalidatePath("/admin");
}

// Étape 3 : validation humaine d'une idée. "valider" déclenche la
// génération du brouillon (étape 4) ; "refuser" clôt le sujet.
export async function decideIdeaAction(formData: FormData) {
  const id = String(formData.get("id"));
  const decision = String(formData.get("decision"));

  if (decision === "refuser") {
    await updateIdea(id, { status: "rejected" });
    revalidatePath("/admin/idees");
    return;
  }

  if (decision === "valider") {
    const idea = await getIdea(id);
    if (!idea) return;
    await updateIdea(id, { status: "validated" });
    const draft = generateDraft(idea);
    await addDraft(draft);
    revalidatePath("/admin/idees");
    revalidatePath("/admin/brouillons");
  }
}

export async function editIdeaAction(formData: FormData) {
  const id = String(formData.get("id"));
  await updateIdea(id, {
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
  const draft = await getDraft(id);
  if (!draft) return;

  if (decision === "rejeter") {
    await updateDraft(id, { status: "rejected" });
  } else if (decision === "regenerer") {
    const idea = await getIdea(draft.ideaId);
    if (idea) {
      const regenerated = generateDraft(idea);
      await updateDraft(id, {
        content: regenerated.content,
        title: regenerated.title,
        subtitle: regenerated.subtitle,
        excerpt: regenerated.excerpt,
        seoTitle: regenerated.seoTitle,
        seoDescription: regenerated.seoDescription,
      });
    }
  } else if (decision === "publier") {
    try {
      await publishDraft(draft);
      await updateDraft(id, {
        status: "published",
        publishedAt: new Date().toISOString(),
        publishError: undefined,
      });
      revalidatePath("/");
      revalidatePath("/articles");
      revalidatePath("/sitemap.xml");
      revalidatePath("/admin/articles");
    } catch (e) {
      await updateDraft(id, {
        publishError: e instanceof Error ? e.message : String(e),
      });
    }
  }

  revalidatePath("/admin/brouillons");
}

export async function editDraftAction(formData: FormData) {
  const id = String(formData.get("id"));
  await updateDraft(id, {
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

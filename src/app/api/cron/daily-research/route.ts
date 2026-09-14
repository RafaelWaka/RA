import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { generateIdeas } from "@/lib/editorial/generate-ideas";
import { addIdeas } from "@/lib/editorial/ideas";

/**
 * Déclenché par le cron Vercel configuré dans vercel.json (07:00 chaque
 * jour, voir section 12 du brief). Vercel ajoute automatiquement l'en-tête
 * `Authorization: Bearer <CRON_SECRET>` pour ses propres invocations dès
 * que la variable d'environnement CRON_SECRET est définie sur le projet.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ideas = generateIdeas(5);
  await addIdeas(ideas);
  revalidatePath("/admin");
  revalidatePath("/admin/idees");

  return NextResponse.json({
    ok: true,
    generated: ideas.length,
    message: `${ideas.length} nouveaux sujets sont prêts à être validés.`,
  });
}

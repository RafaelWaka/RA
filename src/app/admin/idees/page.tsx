import type { Metadata } from "next";
import { getIdeas } from "@/lib/editorial/ideas";
import { safeLoad } from "@/lib/editorial/safe";
import { categories } from "@/lib/categories";
import { AdminErrorBanner } from "@/components/admin/error-banner";
import { decideIdeaAction, editIdeaAction } from "../actions";

export const metadata: Metadata = { title: "Idées à valider" };
export const dynamic = "force-dynamic";

const FORMAT_LABEL: Record<string, string> = {
  article: "Article",
  etude: "Étude",
  comparatif: "Comparatif",
  interview: "Interview",
  actualite: "Actualité",
  guide: "Guide",
  analyse: "Analyse",
};

export default async function IdeesPage() {
  const { data: ideas, error } = await safeLoad(() => getIdeas(), []);
  const pending = ideas.filter((i) => i.status === "pending");
  const decided = ideas.filter((i) => i.status !== "pending");

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink-950">
        Idées à valider
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        Rien n&apos;est rédigé sans votre validation. Chaque idée peut être
        validée telle quelle, modifiée, ou refusée.
      </p>

      {error && <div className="mt-4"><AdminErrorBanner message={error} /></div>}

      {pending.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-ink-200 bg-white p-6 text-sm text-ink-500">
          Aucune idée en attente. Lancez la recherche du jour depuis la{" "}
          <a href="/admin" className="text-brand-700 hover:underline">
            vue d&apos;ensemble
          </a>
          .
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {pending.map((idea) => (
            <div
              key={idea.id}
              className="rounded-lg border border-ink-100 bg-white p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-ink-950 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                  {FORMAT_LABEL[idea.format]}
                </span>
                <span className="text-xs text-ink-500">{idea.category}</span>
              </div>
              <h2 className="mt-2 font-serif text-lg font-bold text-ink-950">
                {idea.title}
              </h2>
              <p className="mt-1 text-sm text-ink-700">{idea.angle}</p>

              <dl className="mt-3 grid gap-2 text-xs text-ink-600 sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-ink-500">
                    Pourquoi c&apos;est intéressant
                  </dt>
                  <dd>{idea.why}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink-500">Audience</dt>
                  <dd>{idea.audience}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink-500">
                    Mot-clé SEO principal
                  </dt>
                  <dd>{idea.seoKeyword}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink-500">
                    Mots-clés secondaires
                  </dt>
                  <dd>{idea.secondaryKeywords.join(", ")}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-semibold text-ink-500">
                    Sources envisagées
                  </dt>
                  <dd>{idea.sources.join(" · ")}</dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <form action={decideIdeaAction}>
                  <input type="hidden" name="id" value={idea.id} />
                  <input type="hidden" name="decision" value="valider" />
                  <button className="rounded-md bg-brand-700 px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-800">
                    Valider
                  </button>
                </form>
                <form action={decideIdeaAction}>
                  <input type="hidden" name="id" value={idea.id} />
                  <input type="hidden" name="decision" value="refuser" />
                  <button className="rounded-md border border-ink-200 px-3.5 py-2 text-sm font-medium text-ink-700 hover:border-clay-500 hover:text-clay-600">
                    Refuser
                  </button>
                </form>
                <details className="ml-auto">
                  <summary className="cursor-pointer rounded-md border border-ink-200 px-3.5 py-2 text-sm font-medium text-ink-700 [&::-webkit-details-marker]:hidden">
                    Modifier
                  </summary>
                  <form
                    action={editIdeaAction}
                    className="mt-3 space-y-2 rounded-md border border-ink-100 bg-ink-50 p-3"
                  >
                    <input type="hidden" name="id" value={idea.id} />
                    <input
                      name="title"
                      defaultValue={idea.title}
                      className="w-full rounded border border-ink-200 px-2 py-1.5 text-sm"
                      placeholder="Titre"
                    />
                    <textarea
                      name="angle"
                      defaultValue={idea.angle}
                      className="w-full rounded border border-ink-200 px-2 py-1.5 text-sm"
                      placeholder="Angle"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <select
                        name="category"
                        defaultValue={idea.category}
                        className="w-full rounded border border-ink-200 px-2 py-1.5 text-sm"
                      >
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <input
                        name="seoKeyword"
                        defaultValue={idea.seoKeyword}
                        className="w-full rounded border border-ink-200 px-2 py-1.5 text-sm"
                        placeholder="Mot-clé SEO"
                      />
                    </div>
                    <textarea
                      name="customInstructions"
                      defaultValue={idea.customInstructions}
                      className="w-full rounded border border-ink-200 px-2 py-1.5 text-sm"
                      placeholder="Instructions spécifiques pour la rédaction"
                      rows={2}
                    />
                    <button className="rounded-md bg-ink-950 px-3 py-1.5 text-sm font-semibold text-white hover:bg-ink-800">
                      Enregistrer
                    </button>
                  </form>
                </details>
              </div>
            </div>
          ))}
        </div>
      )}

      {decided.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 font-serif text-lg font-bold text-ink-900">
            Historique
          </h2>
          <div className="divide-y divide-ink-100 rounded-lg border border-ink-100 bg-white">
            {decided.map((idea) => (
              <div
                key={idea.id}
                className="flex items-center justify-between gap-3 p-3 text-sm"
              >
                <span className="truncate text-ink-700">{idea.title}</span>
                <span
                  className={
                    idea.status === "validated"
                      ? "text-brand-700"
                      : "text-clay-600"
                  }
                >
                  {idea.status === "validated" ? "Validée" : "Refusée"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

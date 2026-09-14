import type { Metadata } from "next";
import Link from "next/link";
import { getDrafts } from "@/lib/editorial/drafts";
import { safeLoad } from "@/lib/editorial/safe";
import { getAuthors } from "@/lib/authors";
import { AdminErrorBanner } from "@/components/admin/error-banner";
import { decideDraftAction, editDraftAction } from "../actions";

export const metadata: Metadata = { title: "Brouillons à valider" };
export const dynamic = "force-dynamic";

export default async function BrouillonsPage() {
  const { data: drafts, error } = await safeLoad(() => getDrafts(), []);
  const authors = getAuthors();
  const ready = drafts.filter((d) => d.status === "ready");
  const other = drafts.filter((d) => d.status !== "ready");

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink-950">
        Brouillons à valider
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        Aucun article n&apos;est publié sans validation explicite.
      </p>

      {error && <div className="mt-4"><AdminErrorBanner message={error} /></div>}

      {ready.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-ink-200 bg-white p-6 text-sm text-ink-500">
          Aucun brouillon prêt à relire. Validez une idée depuis{" "}
          <Link href="/admin/idees" className="text-brand-700 hover:underline">
            Idées à valider
          </Link>{" "}
          pour en générer un.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {ready.map((draft) => (
            <div
              key={draft.id}
              className="rounded-lg border border-ink-100 bg-white p-5"
            >
              <span className="rounded-full bg-clay-500 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                Brouillon
              </span>
              <h2 className="mt-2 font-serif text-lg font-bold text-ink-950">
                {draft.title}
              </h2>
              <p className="mt-1 text-sm text-ink-700">{draft.subtitle}</p>

              {draft.publishError && (
                <div className="mt-3 rounded-md border border-clay-500/40 bg-orange-50 p-3 text-xs text-clay-600">
                  <p className="font-semibold">
                    Échec de la dernière tentative de publication
                  </p>
                  <p className="mt-1 whitespace-pre-wrap font-mono">
                    {draft.publishError}
                  </p>
                </div>
              )}

              <dl className="mt-3 grid gap-2 text-xs text-ink-600 sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-ink-500">Titre SEO</dt>
                  <dd>{draft.seoTitle}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink-500">Meta description</dt>
                  <dd>{draft.seoDescription}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink-500">URL / slug</dt>
                  <dd>/articles/{draft.slug}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink-500">
                    Prompt image de couverture
                  </dt>
                  <dd>{draft.coverImagePrompt}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink-500">Signature</dt>
                  <dd>
                    {authors.find((a) => a.slug === draft.authorSlug)?.name ??
                      draft.authorSlug}
                  </dd>
                </div>
              </dl>

              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-medium text-brand-700">
                  Voir le contenu du brouillon
                </summary>
                <pre className="mt-2 whitespace-pre-wrap rounded-md bg-ink-50 p-3 text-xs text-ink-700">
                  {draft.content}
                </pre>
              </details>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <form action={decideDraftAction}>
                  <input type="hidden" name="id" value={draft.id} />
                  <input type="hidden" name="decision" value="publier" />
                  <button className="rounded-md bg-brand-700 px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-800">
                    Publier
                  </button>
                </form>
                <form action={decideDraftAction}>
                  <input type="hidden" name="id" value={draft.id} />
                  <input type="hidden" name="decision" value="regenerer" />
                  <button className="rounded-md border border-ink-200 px-3.5 py-2 text-sm font-medium text-ink-700 hover:border-brand-600">
                    Régénérer
                  </button>
                </form>
                <form action={decideDraftAction}>
                  <input type="hidden" name="id" value={draft.id} />
                  <input type="hidden" name="decision" value="rejeter" />
                  <button className="rounded-md border border-ink-200 px-3.5 py-2 text-sm font-medium text-ink-700 hover:border-clay-500 hover:text-clay-600">
                    Rejeter
                  </button>
                </form>
                <details className="ml-auto">
                  <summary className="cursor-pointer rounded-md border border-ink-200 px-3.5 py-2 text-sm font-medium text-ink-700 [&::-webkit-details-marker]:hidden">
                    Modifier
                  </summary>
                  <form
                    action={editDraftAction}
                    className="mt-3 space-y-2 rounded-md border border-ink-100 bg-ink-50 p-3"
                  >
                    <input type="hidden" name="id" value={draft.id} />
                    <input
                      name="title"
                      defaultValue={draft.title}
                      className="w-full rounded border border-ink-200 px-2 py-1.5 text-sm"
                      placeholder="Titre"
                    />
                    <input
                      name="subtitle"
                      defaultValue={draft.subtitle}
                      className="w-full rounded border border-ink-200 px-2 py-1.5 text-sm"
                      placeholder="Sous-titre"
                    />
                    <select
                      name="authorSlug"
                      defaultValue={draft.authorSlug}
                      className="w-full rounded border border-ink-200 px-2 py-1.5 text-sm"
                    >
                      {authors.map((a) => (
                        <option key={a.slug} value={a.slug}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                    <input
                      name="seoTitle"
                      defaultValue={draft.seoTitle}
                      className="w-full rounded border border-ink-200 px-2 py-1.5 text-sm"
                      placeholder="Titre SEO"
                    />
                    <textarea
                      name="seoDescription"
                      defaultValue={draft.seoDescription}
                      className="w-full rounded border border-ink-200 px-2 py-1.5 text-sm"
                      placeholder="Meta description"
                      rows={2}
                    />
                    <textarea
                      name="content"
                      defaultValue={draft.content}
                      className="w-full rounded border border-ink-200 px-2 py-1.5 font-mono text-xs"
                      rows={8}
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

      {other.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 font-serif text-lg font-bold text-ink-900">
            Historique
          </h2>
          <div className="divide-y divide-ink-100 rounded-lg border border-ink-100 bg-white">
            {other.map((draft) => (
              <div
                key={draft.id}
                className="flex items-center justify-between gap-3 p-3 text-sm"
              >
                <span className="truncate text-ink-700">{draft.title}</span>
                <span className="flex items-center gap-3">
                  {draft.status === "published" && (
                    <Link
                      href={`/articles/${draft.slug}`}
                      className="text-brand-700 hover:underline"
                    >
                      Voir l&apos;article
                    </Link>
                  )}
                  <span
                    className={
                      draft.status === "published"
                        ? "text-brand-700"
                        : "text-clay-600"
                    }
                  >
                    {draft.status === "published" ? "Publié" : "Rejeté"}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

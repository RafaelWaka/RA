import Link from "next/link";
import { getIdeas } from "@/lib/editorial/ideas";
import { getDrafts } from "@/lib/editorial/drafts";
import { getSubscribers } from "@/lib/newsletter";
import { getAllArticles } from "@/lib/content";
import { safeLoad } from "@/lib/editorial/safe";
import { getSystemError } from "@/lib/editorial/system-status";
import { AdminErrorBanner } from "@/components/admin/error-banner";
import { dismissSystemErrorAction, runResearchAction } from "./actions";

// Dashboard interne lisant un store mutable (cron, actions admin) :
// toujours rendu à la demande, jamais mis en cache statiquement.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { data: ideas, error: ideasError } = await safeLoad(() => getIdeas(), []);
  const { data: drafts, error: draftsError } = await safeLoad(() => getDrafts(), []);
  const { data: subscribers } = await safeLoad(() => getSubscribers(), []);
  const systemError = await getSystemError().catch(() => null);
  const articles = getAllArticles();

  const pendingIdeas = ideas.filter((i) => i.status === "pending");
  const readyDrafts = drafts.filter((d) => d.status === "ready");
  const publishedDrafts = drafts.filter((d) => d.status === "published");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink-950">
            Aujourd&apos;hui
          </h1>
          <p className="text-sm text-ink-500">
            Recherche → idées → validation → rédaction → validation → publication
          </p>
        </div>
        <form action={runResearchAction}>
          <button
            type="submit"
            className="rounded-md bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
          >
            Lancer la recherche du jour
          </button>
        </form>
      </div>

      {systemError && (
        <div className="mt-4 flex items-start justify-between gap-3 rounded-lg border border-clay-500/40 bg-orange-50 p-4 text-sm text-clay-600">
          <div>
            <p className="font-semibold">La dernière action a échoué</p>
            <p className="mt-1 whitespace-pre-wrap font-mono text-xs text-clay-600/90">
              {systemError.message}
            </p>
          </div>
          <form action={dismissSystemErrorAction}>
            <button className="whitespace-nowrap text-xs font-medium underline">
              Masquer
            </button>
          </form>
        </div>
      )}
      {(ideasError || draftsError) && (
        <div className="mt-4">
          <AdminErrorBanner message={(ideasError || draftsError)!} />
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Nouvelles idées"
          value={pendingIdeas.length}
          href="/admin/idees"
          tone="brand"
        />
        <StatCard
          label="Brouillons à valider"
          value={readyDrafts.length}
          href="/admin/brouillons"
          tone="clay"
        />
        <StatCard
          label="Articles publiés"
          value={articles.length}
          href="/admin/articles"
          tone="ink"
        />
        <StatCard
          label="Idées traitées (total)"
          value={ideas.length}
          tone="ink"
        />
      </div>

      {pendingIdeas.length === 0 && readyDrafts.length === 0 && (
        <div className="mt-8 rounded-lg border border-dashed border-ink-200 bg-white p-8 text-center">
          <p className="font-medium text-ink-800">
            Rien à valider pour le moment.
          </p>
          <p className="mt-1 text-sm text-ink-500">
            Lancez la recherche du jour pour générer de nouvelles propositions
            de sujets. Rappel : mieux vaut &laquo;&nbsp;aucun sujet
            suffisamment intéressant aujourd&apos;hui&nbsp;&raquo; qu&apos;un
            article médiocre publié pour la cadence.
          </p>
        </div>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Panel title="Idées en attente de validation" href="/admin/idees">
          {pendingIdeas.slice(0, 5).map((idea) => (
            <li key={idea.id} className="truncate">
              {idea.title}
            </li>
          ))}
          {pendingIdeas.length === 0 && <EmptyRow />}
        </Panel>
        <Panel title="Brouillons prêts à relire" href="/admin/brouillons">
          {readyDrafts.slice(0, 5).map((draft) => (
            <li key={draft.id} className="truncate">
              {draft.title}
            </li>
          ))}
          {readyDrafts.length === 0 && <EmptyRow />}
        </Panel>
      </div>

      <div className="mt-10">
        <h2 className="mb-3 font-serif text-xl font-bold text-ink-950">
          Statistiques (aperçu)
        </h2>
        <p className="mb-4 max-w-2xl text-sm text-ink-500">
          Branchez Google Search Console et un outil d&apos;analytics
          (Plausible, GA4…) pour remplir ces indicateurs avec des données
          réelles. Voir <code className="rounded bg-ink-100 px-1">README.md</code>.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricPlaceholder label="Vues (30j)" />
          <SummaryLink
            label="Inscrits newsletter"
            count={subscribers.length}
            href="/admin/newsletter"
          />
          <MetricPlaceholder label="Top article" />
          <MetricPlaceholder label="Trafic organique" />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-3 font-serif text-xl font-bold text-ink-950">
          Gestion éditoriale
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryLink label="Brouillons" count={drafts.length} href="/admin/brouillons" />
          <SummaryLink
            label="Publiés"
            count={publishedDrafts.length + articles.length}
            href="/admin/articles"
          />
          <SummaryLink
            label="Rejetés"
            count={
              ideas.filter((i) => i.status === "rejected").length +
              drafts.filter((d) => d.status === "rejected").length
            }
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  tone,
}: {
  label: string;
  value: number;
  href?: string;
  tone: "brand" | "clay" | "ink";
}) {
  const toneClasses = {
    brand: "text-brand-700",
    clay: "text-clay-600",
    ink: "text-ink-800",
  }[tone];

  const content = (
    <div className="rounded-lg border border-ink-100 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
        {label}
      </p>
      <p className={`mt-2 font-serif text-3xl font-bold ${toneClasses}`}>
        {value}
      </p>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function Panel({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-ink-100 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-ink-900">{title}</h3>
        <Link href={href} className="text-sm text-brand-700 hover:underline">
          Tout voir →
        </Link>
      </div>
      <ul className="space-y-2 text-sm text-ink-700">{children}</ul>
    </div>
  );
}

function EmptyRow() {
  return <li className="text-ink-400">Rien pour le moment.</li>;
}

function MetricPlaceholder({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-ink-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-ink-300">N/A</p>
    </div>
  );
}

function SummaryLink({
  label,
  count,
  href,
}: {
  label: string;
  count: number;
  href?: string;
}) {
  const inner = (
    <div className="rounded-lg border border-ink-100 bg-white p-4">
      <p className="text-sm text-ink-500">{label}</p>
      <p className="mt-1 font-serif text-2xl font-bold text-ink-900">{count}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

import type { Metadata } from "next";
import { getSubscribers } from "@/lib/newsletter";
import { safeLoad } from "@/lib/editorial/safe";
import { AdminErrorBanner } from "@/components/admin/error-banner";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Newsletter" };
export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const { data: subscribers, error } = await safeLoad(() => getSubscribers(), []);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink-950">
        Inscrits à la newsletter
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        {subscribers.length} inscrit(s) au total. Ces adresses ne sont pas
        encore reliées à un outil d&apos;emailing : voir la section
        Newsletter du README pour brancher Resend, Brevo ou Mailchimp.
      </p>

      {error && <div className="mt-4"><AdminErrorBanner message={error} /></div>}

      {subscribers.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-ink-200 bg-white p-6 text-sm text-ink-500">
          Aucune inscription pour le moment.
        </p>
      ) : (
        <div className="mt-6 divide-y divide-ink-100 rounded-lg border border-ink-100 bg-white">
          <div className="grid grid-cols-3 gap-3 bg-ink-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
            <span>Email</span>
            <span>Source</span>
            <span>Date</span>
          </div>
          {subscribers.map((s) => (
            <div
              key={s.email}
              className="grid grid-cols-3 gap-3 px-4 py-3 text-sm text-ink-700"
            >
              <span className="truncate">{s.email}</span>
              <span className="text-ink-500">{s.source}</span>
              <span className="text-ink-500">{formatDate(s.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

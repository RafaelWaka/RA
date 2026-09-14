import type { Metadata } from "next";
import { getContactMessages } from "@/lib/contact";
import { safeLoad } from "@/lib/editorial/safe";
import { AdminErrorBanner } from "@/components/admin/error-banner";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Messages de contact" };
export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const { data: messages, error } = await safeLoad(() => getContactMessages(), []);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink-950">
        Messages de contact
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        {messages.length} message(s) reçu(s) via le formulaire /contact.
      </p>

      {error && <div className="mt-4"><AdminErrorBanner message={error} /></div>}

      {messages.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-ink-200 bg-white p-6 text-sm text-ink-500">
          Aucun message pour le moment.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {messages.map((m, i) => (
            <div
              key={`${m.email}-${i}`}
              className="rounded-lg border border-ink-100 bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-semibold text-ink-900">{m.name}</span>
                <span className="text-xs text-ink-500">
                  {formatDate(m.createdAt)}
                </span>
              </div>
              <p className="text-xs text-ink-500">
                {m.email} · {m.subject}
              </p>
              <p className="mt-2 text-sm text-ink-700">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

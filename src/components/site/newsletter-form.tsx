"use client";

import { FormEvent, useState } from "react";

export function NewsletterForm({
  compact = false,
  source = "unknown",
}: {
  compact?: boolean;
  source?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [email, setEmail] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="text-sm font-medium text-brand-700">
        Merci ! Vérifiez votre boîte mail pour confirmer votre inscription.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex ${compact ? "flex-col sm:flex-row" : "flex-col"} gap-2`}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="vous@entreprise.com"
        className="w-full rounded-md border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="whitespace-nowrap rounded-md bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60"
      >
        {status === "loading" ? "Inscription…" : "S'inscrire"}
      </button>
      {status === "error" && (
        <p className="text-xs text-clay-600">
          Une erreur est survenue, réessayez.
        </p>
      )}
    </form>
  );
}

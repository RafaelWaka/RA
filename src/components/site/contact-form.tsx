"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="rounded-md bg-brand-50 p-4 text-sm font-medium text-brand-800">
        Merci, votre message a bien été envoyé. Nous répondons sous 48h.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom" name="name" type="text" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink-800">
          Sujet
        </label>
        <select
          name="subject"
          className="w-full rounded-md border border-ink-200 bg-white px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option>Suggestion de sujet</option>
          <option>Correction / précision</option>
          <option>Proposition d&apos;interview</option>
          <option>Partenariat</option>
          <option>Autre</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink-800">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-md border border-ink-200 bg-white px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-md bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60"
      >
        {status === "loading" ? "Envoi…" : "Envoyer"}
      </button>
      {status === "error" && (
        <p className="text-sm text-clay-600">
          Une erreur est survenue, réessayez.
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type,
  required,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink-800">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-md border border-ink-200 bg-white px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
    </div>
  );
}

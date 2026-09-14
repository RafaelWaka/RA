"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { siteConfig } from "@/lib/site";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur de connexion.");
        setLoading(false);
        return;
      }
      router.push(searchParams.get("next") || "/admin");
      router.refresh();
    } catch {
      setError("Erreur de connexion.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-lg border border-ink-100 bg-white p-6 shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
        Espace privé
      </p>
      <h1 className="mt-1 font-serif text-2xl font-bold text-ink-950">
        Dashboard éditorial
      </h1>
      <p className="mt-1 text-sm text-ink-500">{siteConfig.name}</p>

      <label className="mt-6 block text-sm font-medium text-ink-800">
        Mot de passe
      </label>
      <input
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-1 w-full rounded-md border border-ink-200 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />

      {error && <p className="mt-2 text-sm text-clay-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-md bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60"
      >
        {loading ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ink-50 px-4 py-16">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-clay-600">
        Erreur du dashboard
      </p>
      <h1 className="mt-2 font-serif text-2xl font-bold text-ink-950">
        Quelque chose s&apos;est mal passé
      </h1>
      <p className="mt-3 text-sm text-ink-600">
        {error.digest
          ? `Référence d'erreur : ${error.digest}. Consultez les logs de la fonction sur Vercel pour le détail.`
          : error.message}
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-md bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-800"
      >
        Réessayer
      </button>
    </div>
  );
}

export function AdminErrorBanner({ message }: { message: string }) {
  return (
    <div className="mb-6 rounded-lg border border-clay-500/40 bg-orange-50 p-4 text-sm text-clay-600">
      <p className="font-semibold">Le stockage n&apos;a pas pu être lu.</p>
      <p className="mt-1 whitespace-pre-wrap font-mono text-xs text-clay-600/90">
        {message}
      </p>
      <p className="mt-2 text-ink-600">
        Vérifiez la configuration Redis (KV_REST_API_URL /
        KV_REST_API_TOKEN) dans les variables d&apos;environnement Vercel.
      </p>
    </div>
  );
}

import "server-only";

/**
 * Enveloppe un chargement de données du dashboard admin pour ne jamais
 * laisser une erreur de stockage (Redis mal configuré, API GitHub
 * indisponible...) faire planter toute la page avec l'écran générique
 * "Application error" de Next.js. En production, Next masque le message
 * d'erreur réel au client ; ici on le capture nous-mêmes pour l'afficher
 * lisiblement dans le dashboard (accès admin uniquement, donc sans risque
 * à montrer le détail technique).
 */
export async function safeLoad<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<{ data: T; error: string | null }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (e) {
    return { data: fallback, error: e instanceof Error ? e.message : String(e) };
  }
}

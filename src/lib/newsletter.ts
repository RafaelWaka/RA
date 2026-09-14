import "server-only";
import { readCollection, writeCollection } from "./editorial/store";

export type Subscriber = {
  email: string;
  source: string;
  createdAt: string;
};

const KEY = "newsletter.json";

/**
 * Stockage des inscrits (voir src/lib/editorial/store.ts pour le choix du
 * backend Redis/fichier). Pour brancher un vrai outil d'emailing (Resend,
 * Brevo, Mailchimp, ConvertKit...), appelez son API en plus de (ou à la
 * place de) l'écriture ci-dessous, en utilisant NEWSLETTER_API_KEY /
 * NEWSLETTER_LIST_ID (voir .env.example).
 */
export async function subscribe(email: string, source: string): Promise<void> {
  const subscribers = await readCollection<Subscriber>(KEY);
  if (subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
    return;
  }
  subscribers.push({ email, source, createdAt: new Date().toISOString() });
  await writeCollection(KEY, subscribers);
}

export async function getSubscribers(): Promise<Subscriber[]> {
  const subscribers = await readCollection<Subscriber>(KEY);
  return subscribers.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

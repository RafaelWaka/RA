import "server-only";
import { readCollection, writeCollection } from "./editorial/store";

export type Subscriber = {
  email: string;
  source: string;
  createdAt: string;
};

const FILE = "newsletter.json";

/**
 * Stockage MVP des inscrits (voir src/lib/editorial/store.ts pour les
 * limites en production serverless). Pour brancher un vrai outil
 * d'emailing (Resend, Brevo, Mailchimp, ConvertKit...), remplacez le corps
 * de `subscribe()` par un appel à son API en utilisant
 * NEWSLETTER_API_KEY / NEWSLETTER_LIST_ID (voir .env.example).
 */
export function subscribe(email: string, source: string): void {
  const subscribers = readCollection<Subscriber>(FILE);
  if (subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
    return;
  }
  subscribers.push({ email, source, createdAt: new Date().toISOString() });
  writeCollection(FILE, subscribers);
}

export function countSubscribers(): number {
  return readCollection<Subscriber>(FILE).length;
}

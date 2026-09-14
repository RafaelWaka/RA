import "server-only";
import { readCollection, writeCollection } from "./store";

type StatusEntry = { message: string; at: string };

const KEY = "system-status.json";

// Dernière erreur survenue dans une action admin qui n'est pas rattachée à
// une idée ou un brouillon précis (ex : échec de la recherche du jour).
// Stocké comme un tableau à un élément pour réutiliser readCollection /
// writeCollection tel quel.
export async function setSystemError(message: string): Promise<void> {
  await writeCollection<StatusEntry>(KEY, [
    { message, at: new Date().toISOString() },
  ]);
}

export async function clearSystemError(): Promise<void> {
  await writeCollection<StatusEntry>(KEY, []);
}

export async function getSystemError(): Promise<StatusEntry | null> {
  const all = await readCollection<StatusEntry>(KEY);
  return all[0] ?? null;
}

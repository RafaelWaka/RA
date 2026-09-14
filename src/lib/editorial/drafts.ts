import "server-only";
import { readCollection, writeCollection } from "./store";
import type { Draft } from "./types";

const KEY = "drafts.json";

export async function getDrafts(): Promise<Draft[]> {
  const all = await readCollection<Draft>(KEY);
  return all.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getDraft(id: string): Promise<Draft | undefined> {
  const all = await getDrafts();
  return all.find((d) => d.id === id);
}

export async function addDraft(draft: Draft): Promise<void> {
  const all = await readCollection<Draft>(KEY);
  await writeCollection(KEY, [draft, ...all]);
}

export async function updateDraft(
  id: string,
  patch: Partial<Draft>
): Promise<Draft | null> {
  const all = await readCollection<Draft>(KEY);
  const index = all.findIndex((d) => d.id === id);
  if (index === -1) return null;
  all[index] = { ...all[index], ...patch };
  await writeCollection(KEY, all);
  return all[index];
}

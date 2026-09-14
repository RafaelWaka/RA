import "server-only";
import { readCollection, writeCollection } from "./store";
import type { Draft } from "./types";

const FILE = "drafts.json";

export function getDrafts(): Draft[] {
  return readCollection<Draft>(FILE).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getDraft(id: string): Draft | undefined {
  return getDrafts().find((d) => d.id === id);
}

export function addDraft(draft: Draft): void {
  const all = readCollection<Draft>(FILE);
  writeCollection(FILE, [draft, ...all]);
}

export function updateDraft(id: string, patch: Partial<Draft>): Draft | null {
  const all = readCollection<Draft>(FILE);
  const index = all.findIndex((d) => d.id === id);
  if (index === -1) return null;
  all[index] = { ...all[index], ...patch };
  writeCollection(FILE, all);
  return all[index];
}

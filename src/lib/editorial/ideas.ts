import "server-only";
import { readCollection, writeCollection } from "./store";
import type { Idea } from "./types";

const FILE = "ideas.json";

export function getIdeas(): Idea[] {
  return readCollection<Idea>(FILE).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getIdea(id: string): Idea | undefined {
  return getIdeas().find((i) => i.id === id);
}

export function addIdeas(newIdeas: Idea[]): void {
  const all = readCollection<Idea>(FILE);
  writeCollection(FILE, [...newIdeas, ...all]);
}

export function updateIdea(id: string, patch: Partial<Idea>): Idea | null {
  const all = readCollection<Idea>(FILE);
  const index = all.findIndex((i) => i.id === id);
  if (index === -1) return null;
  all[index] = { ...all[index], ...patch };
  writeCollection(FILE, all);
  return all[index];
}

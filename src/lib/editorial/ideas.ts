import "server-only";
import { readCollection, writeCollection } from "./store";
import type { Idea } from "./types";

const KEY = "ideas.json";

export async function getIdeas(): Promise<Idea[]> {
  const all = await readCollection<Idea>(KEY);
  return all.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getIdea(id: string): Promise<Idea | undefined> {
  const all = await getIdeas();
  return all.find((i) => i.id === id);
}

export async function addIdeas(newIdeas: Idea[]): Promise<void> {
  const all = await readCollection<Idea>(KEY);
  await writeCollection(KEY, [...newIdeas, ...all]);
}

export async function updateIdea(
  id: string,
  patch: Partial<Idea>
): Promise<Idea | null> {
  const all = await readCollection<Idea>(KEY);
  const index = all.findIndex((i) => i.id === id);
  if (index === -1) return null;
  all[index] = { ...all[index], ...patch };
  await writeCollection(KEY, all);
  return all[index];
}

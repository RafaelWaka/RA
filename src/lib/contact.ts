import "server-only";
import { readCollection, writeCollection } from "./editorial/store";

export type ContactMessage = {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

const KEY = "contact-messages.json";

export async function addContactMessage(
  msg: Omit<ContactMessage, "createdAt">
): Promise<void> {
  const messages = await readCollection<ContactMessage>(KEY);
  messages.push({ ...msg, createdAt: new Date().toISOString() });
  await writeCollection(KEY, messages);
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const messages = await readCollection<ContactMessage>(KEY);
  return messages.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

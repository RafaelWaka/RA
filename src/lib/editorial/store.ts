import "server-only";
import fs from "node:fs";
import path from "node:path";

/**
 * Store fichier JSON pour le MVP.
 *
 * Ceci est volontairement la brique la plus simple possible pour démarrer
 * gratuitement (section 18 du brief). Elle fonctionne parfaitement en
 * développement local. En production sur Vercel, le système de fichiers des
 * fonctions serverless est éphémère : les écritures ne persistent PAS de
 * façon fiable entre deux invocations.
 *
 * Pour passer en production, remplacez les fonctions ci-dessous par des
 * appels à une vraie base (Vercel Postgres, Supabase, Neon...) en gardant
 * exactement la même signature — aucun autre fichier n'a besoin de changer.
 */

const DATA_DIR = path.join(process.cwd(), "data");

function readJson<T>(filename: string, fallback: T): T {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return fallback;
  const raw = fs.readFileSync(filePath, "utf-8");
  if (!raw.trim()) return fallback;
  return JSON.parse(raw) as T;
}

function writeJson<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

export function readCollection<T>(filename: string): T[] {
  return readJson<T[]>(filename, []);
}

export function writeCollection<T>(filename: string, items: T[]): void {
  writeJson(filename, items);
}

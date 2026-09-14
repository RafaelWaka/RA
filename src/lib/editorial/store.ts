import "server-only";
import fs from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";

/**
 * Store du workflow éditorial (idées, brouillons, newsletter, contact).
 *
 * Deux backends, choisis automatiquement :
 * - Redis (Upstash, via l'intégration Vercel Marketplace) si les variables
 *   KV_REST_API_URL / KV_REST_API_TOKEN sont présentes. C'est le mode
 *   attendu en production sur Vercel, dont le système de fichiers des
 *   fonctions serverless est en lecture seule (une écriture fichier y
 *   échoue avec une exception).
 * - Fichier JSON local dans data/ sinon. Pratique pour développer sans
 *   dépendance externe, mais à ne jamais utiliser en production.
 *
 * Ajouter la base Redis : dans le dashboard Vercel du projet, onglet
 * Storage, ajouter l'intégration "Upstash for Redis" (Marketplace). Vercel
 * injecte automatiquement KV_REST_API_URL et KV_REST_API_TOKEN, sans
 * autre configuration nécessaire.
 */

const DATA_DIR = path.join(process.cwd(), "data");

function redisClient(): Redis | null {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return null;
  }
  return Redis.fromEnv();
}

function readJsonFile<T>(filename: string, fallback: T): T {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return fallback;
  const raw = fs.readFileSync(filePath, "utf-8");
  if (!raw.trim()) return fallback;
  return JSON.parse(raw) as T;
}

function writeJsonFile<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

export async function readCollection<T>(key: string): Promise<T[]> {
  const redis = redisClient();
  if (redis) {
    const data = await redis.get<T[]>(key);
    return data ?? [];
  }
  return readJsonFile<T[]>(key, []);
}

export async function writeCollection<T>(key: string, items: T[]): Promise<void> {
  const redis = redisClient();
  if (redis) {
    await redis.set(key, items);
    return;
  }
  writeJsonFile(key, items);
}

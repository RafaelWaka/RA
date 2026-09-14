# Données locales (développement)

Ce dossier contient le repli fichier JSON du store du workflow éditorial
et des formulaires publics (voir `src/lib/editorial/store.ts`), utilisé
uniquement quand `KV_REST_API_URL` / `KV_REST_API_TOKEN` ne sont pas
définies (développement local sans Redis).

- `ideas.json` — idées proposées par la recherche automatique, en attente
  de validation (`/admin/idees`).
- `drafts.json` — brouillons générés après validation d'une idée
  (`/admin/brouillons`).
- `newsletter.json` — inscrits à la newsletter (créé automatiquement).
- `contact-messages.json` — messages du formulaire de contact (créé
  automatiquement).
- `system-status.json` — dernière erreur d'une action admin non rattachée
  à une idée/un brouillon précis (créé automatiquement).

**Important** : sur Vercel, le système de fichiers des fonctions serverless
est en lecture seule. En production, configurez l'intégration Redis
(Upstash, via Vercel Marketplace) — voir la section « Configuration
requise en production » du README principal. Sans elle, `/admin` affiche
un message d'erreur explicite plutôt que d'écrire silencieusement dans ce
dossier (qui ne persisterait de toute façon pas).

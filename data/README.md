# Données locales (MVP)

Ce dossier contient le store fichier JSON utilisé par le workflow éditorial
et les formulaires publics (voir `src/lib/editorial/store.ts`).

- `ideas.json` — idées proposées par la recherche automatique, en attente
  de validation (`/admin/idees`).
- `drafts.json` — brouillons générés après validation d'une idée
  (`/admin/brouillons`).
- `newsletter.json` — inscrits à la newsletter (créé automatiquement).
- `contact-messages.json` — messages du formulaire de contact (créé
  automatiquement).

**Important** : sur Vercel, le système de fichiers des fonctions serverless
est éphémère. Ce store fonctionne parfaitement en local (`npm run dev`)
mais ne doit pas être considéré comme fiable en production tant qu'il n'a
pas été remplacé par une vraie base de données (voir le README principal,
section "Faire évoluer le projet").

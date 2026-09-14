# Le Recruteur de Demain

Média indépendant dédié aux recruteurs, chasseurs de tête et professionnels
du sourcing — « Les nouvelles façons de recruter ».

MVP fonctionnel : site éditorial (accueil, catégories, articles, études,
comparatifs, interviews, newsletter) + dashboard admin avec workflow
éditorial semi-automatisé (recherche → idées → validation → rédaction →
validation → publication), SEO technique complet, prêt pour Vercel.

## Stack

- **Next.js 15** (App Router) + **TypeScript**, React 19
- **Tailwind CSS** pour le design system
- Contenu en **MDX** (fichiers dans `content/`), lu au build/à la demande —
  pas de CMS externe requis pour démarrer, mais l'architecture est prête à
  en accueillir un (voir plus bas)
- Store JSON fichier pour le workflow éditorial (`data/`) — à remplacer par
  une vraie base de données avant une mise en production sérieuse (voir
  plus bas)
- Déploiement cible : **Vercel** (plan gratuit compatible)

## Démarrer en local

```bash
npm install
cp .env.example .env.local   # puis éditez ADMIN_PASSWORD et CRON_SECRET
npm run dev
```

- Site public : http://localhost:3000
- Dashboard admin : http://localhost:3000/admin (login sur `/admin-login`,
  mot de passe = `ADMIN_PASSWORD` défini dans `.env.local`)

## Structure du projet

```
content/            Contenu éditorial (MDX + frontmatter)
  articles/          Articles
  etudes/            Études (méthodologie, répondants, téléchargement)
  comparatifs/        Comparatifs d'outils (tableaux, dernière vérification)
  interviews/         Interviews (personne interviewée, vidéo optionnelle)
  authors.json         Auteurs du média

data/                Store JSON du workflow éditorial (voir data/README.md)
  ideas.json           Idées proposées, en attente de validation
  drafts.json          Brouillons générés après validation

src/
  app/                 Routes (App Router)
    (site public)       /, /articles, /etudes, /comparatifs, /interviews,
                         /categories, /a-propos, /newsletter, /outils,
                         /contact, /auteurs/[slug]
    admin-login/         Connexion au dashboard
    admin/               Dashboard privé (protégé par middleware)
    api/                 Routes API (newsletter, contact, cron, admin)
  components/          Composants UI (site, mdx, admin)
  lib/                 Logique métier (contenu, SEO, éditorial, store)
  middleware.ts         Protection de /admin/*
```

## Le workflow éditorial (section centrale du projet)

Le principe non négociable : **aucun contenu n'est publié sans validation
humaine explicite**, à deux étapes distinctes.

```
Recherche → Idées → [Validation humaine] → Rédaction → [Validation humaine] → Publication → SEO
```

1. **Recherche + idées** (`src/lib/editorial/generate-ideas.ts`) — dans ce
   MVP, un générateur *stub* propose 3 à 5 idées à partir d'un pool de
   sujets rédigés à la main (aucun appel réseau, donc aucune hallucination
   possible). Déclenchable manuellement depuis `/admin` (bouton « Lancer la
   recherche du jour ») ou automatiquement via le cron Vercel configuré
   dans `vercel.json` (tous les jours à 7h).
2. **Validation des idées** (`/admin/idees`) — chaque idée peut être
   **validée**, **modifiée** (titre, angle, catégorie, mots-clés,
   instructions spécifiques) ou **refusée**. Valider une idée déclenche
   automatiquement la génération d'un brouillon.
3. **Génération du brouillon** (`src/lib/editorial/generate-draft.ts`) —
   stub qui structure un brouillon (titre, sous-titre, meta SEO, slug,
   sections à compléter) **sans jamais inventer de fait, de chiffre ou de
   citation** : le contenu généré contient des sections marquées à
   compléter par la rédaction, pas des affirmations fabriquées.
4. **Validation du brouillon** (`/admin/brouillons`) — **Publier**,
   **Modifier**, **Régénérer** ou **Rejeter**. Publier écrit un vrai
   fichier `.mdx` dans `content/articles/` : l'article apparaît
   immédiatement sur le site, dans le sitemap, avec toutes les métadonnées
   SEO.

### Brancher la vraie automatisation (recherche web + IA)

Les deux fichiers stub ci-dessus documentent, en commentaire, exactement
où brancher :
- une API de recherche web / actualités fiable (Tavily, Exa, Bing News…)
  pour l'étape 1, filtrée sur des sources RH reconnues ;
- un modèle Claude (Messages API, voir `ANTHROPIC_API_KEY` dans
  `.env.example`) pour les étapes 2 et 4, avec pour consigne système
  explicite de ne jamais affirmer un fait absent des sources fournies.

Aucune autre partie du code n'a besoin de changer : les deux fonctions
`generateIdeas()` et `generateDraft()` gardent la même signature.

## Charte anti-hallucination

- Le composant `<Callout type="fait" | "analyse" | "opinion">` (utilisable
  dans le contenu MDX) distingue explicitement fait vérifié, analyse
  éditoriale et opinion.
- Chaque article peut afficher ses sources (`frontmatter.sources`), rendues
  en bas de page.
- Les comparatifs affichent une date **« Dernière vérification »**
  (`frontmatter.lastVerified`).
- Le contenu d'exemple livré avec ce MVP (`frontmatter.seed: true`) affiche
  un bandeau d'avertissement en haut de page et ne doit jamais être traité
  comme une donnée réelle — voir la section suivante.

## À propos du contenu livré avec ce MVP

12 contenus d'exemple sont fournis (6 articles, 2 études, 2 comparatifs, 2
interviews) pour démontrer chaque gabarit (mise en page, SEO, maillage
interne, tableaux, citations…). Ils sont marqués `seed: true` dans leur
frontmatter et affichent un bandeau « Contenu d'exemple ». **Remplacez-les
progressivement par du contenu réel** produit via le workflow `/admin` (ou
rédigé manuellement) avant toute mise en production publique — en
particulier les études (gabarits d'enquêtes non encore menées) et les
comparatifs (prix marqués « À vérifier » plutôt qu'inventés).

## SEO technique — ce qui est déjà en place

- `sitemap.xml` et `robots.txt` générés dynamiquement
  (`src/app/sitemap.ts`, `src/app/robots.ts`), incluant tout le contenu
  publié
- `metadata` dynamique (title, description, canonical) sur chaque page via
  `generateMetadata`
- Open Graph + Twitter/X Cards sur chaque page
- Données structurées Schema.org : `Organization`, `WebSite`, `Article`,
  `BreadcrumbList`, `Person` (auteur)
- URLs propres (`/articles/mon-slug`), fil d'Ariane sur chaque page de
  contenu
- Pagination propre sur `/articles` (`?page=n`)
- Maillage interne (« À lire aussi », liens contextuels dans les articles,
  pages auteurs)
- Images servies via `next/image` (formats optimisés, lazy loading)

### À faire après déploiement

1. Renseigner `NEXT_PUBLIC_SITE_URL` avec le domaine définitif.
2. Ajouter le site à **Google Search Console** et soumettre le sitemap.
3. Brancher un outil d'analytics (Plausible ou GA4 — variables
   `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` / `NEXT_PUBLIC_GA_ID` prévues dans
   `.env.example`, à câbler dans `src/app/layout.tsx`).
4. Remplacer les images de couverture SVG (`public/images/covers/`) par de
   vraies photos/illustrations éditoriales.

## Déploiement sur Vercel

1. Poussez le repo sur GitHub et importez-le dans Vercel.
2. Renseignez les variables d'environnement du `.env.example` dans les
   réglages du projet Vercel (au minimum `ADMIN_PASSWORD`, `CRON_SECRET`,
   `NEXT_PUBLIC_SITE_URL`).
3. Le cron quotidien (`vercel.json`) est automatiquement pris en compte
   par Vercel (compatible plan gratuit : 1 exécution/jour maximum).
4. Une fois prêt, ajoutez votre nom de domaine personnalisé dans les
   réglages du projet Vercel — aucune modification de code nécessaire.

## Faire évoluer le projet (sans sur-ingénierie au départ)

Le projet démarre volontairement simple. Voici où brancher chaque brique
quand le besoin se présente :

| Besoin | Où intervenir |
| --- | --- |
| Base de données réelle | `src/lib/editorial/store.ts` — remplacer les fonctions `readCollection`/`writeCollection` par des appels à Postgres/Supabase/Neon, en gardant la même signature |
| Vraie recherche web + IA | `src/lib/editorial/generate-ideas.ts` et `generate-draft.ts` (voir commentaires dans chaque fichier) |
| CMS headless (si la rédaction préfère une interface dédiée plutôt que des fichiers MDX) | Remplacer les lecteurs de `src/lib/content.ts` par des appels à l'API du CMS choisi (Sanity, Contentful, Payload…), en gardant les mêmes types (`ContentEntry`) |
| Emailing newsletter | `src/lib/newsletter.ts` — remplacer `subscribe()` par un appel à l'API du prestataire choisi (Resend, Brevo, Mailchimp…) |
| Génération d'images de couverture | Le brouillon propose déjà un `coverImagePrompt` (voir `/admin/brouillons`) — brancher une API de génération d'images et stocker le résultat dans `content/<type>/images/` |
| Comptes utilisateurs / abonnement premium | Ajouter un provider d'auth (NextAuth, Clerk...) et un contrôle d'accès sur les pages concernées ; l'auth admin actuelle (`src/middleware.ts`) est volontairement minimaliste (mot de passe unique) et devra être remplacée en premier |
| Publication effective en production sur Vercel | `src/lib/editorial/publish.ts` écrit un fichier localement, ce qui ne persiste pas de façon fiable sur le filesystem éphémère des fonctions serverless Vercel — brancher un commit Git via l'API GitHub, ou migrer vers la base de données / CMS choisi |

## Limite connue : le store fichier en production Vercel

Le workflow éditorial (`data/*.json`) et les formulaires publics
(newsletter, contact) utilisent un store JSON fichier pour rester simple
au démarrage (section « commencer gratuitement » du brief). **Ce store
fonctionne parfaitement en local**, mais le système de fichiers des
fonctions serverless Vercel est éphémère : ne comptez pas dessus pour un
usage en production réelle sans l'avoir remplacé par une vraie base de
données (voir tableau ci-dessus). C'est un choix assumé pour livrer un
MVP fonctionnel immédiatement testable, pas un oubli.

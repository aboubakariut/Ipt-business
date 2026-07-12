# IPT Business

Le bureau numérique des entrepreneurs africains — PWA de gestion pour commerçants, artisans, freelances, étudiants et PME.

## Stack

- **Framework** : Next.js 14 (Pages Router — structure la plus simple à créer à la main)
- **Style** : Tailwind CSS (design system dans `tailwind.config.ts`)
- **Base de données** : TiDB Cloud Serverless (MySQL) via Prisma
- **Auth** : NextAuth.js (email/mot de passe)
- **Hébergement** : Vercel (plan gratuit Hobby)

## Structure du projet (5 dossiers racine, tous à plat)

```
ipt-business/
├── pages/                 # Une page = un fichier (sauf pages/api/auth/)
│   ├── _app.tsx             # Point d'entrée global (polices, session)
│   ├── globals.css          # Styles globaux
│   ├── index.tsx            # Redirection selon connexion
│   ├── login.tsx
│   ├── register.tsx
│   ├── dashboard.tsx
│   └── api/auth/
│       ├── [...nextauth].ts   # Authentification (fichier, pas un dossier)
│       └── register.ts
├── components/            # Tous les composants, à plat, aucun sous-dossier
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── StatCard.tsx
│   ├── BottomNav.tsx
│   └── DashboardShell.tsx
├── lib/                   # Toute la logique, à plat
│   ├── prisma.ts
│   ├── auth.ts
│   ├── utils.ts
│   ├── plan-limits.ts
│   └── require-auth.ts
├── prisma/
│   └── schema.prisma      # Imposé par Prisma
├── public/
│   └── manifest.json      # Imposé par Next.js
├── auth-types.d.ts        # Types NextAuth, fichier unique à la racine
└── (fichiers de config à la racine : package.json, tsconfig.json, etc.)
```

Aucun fichier n'est enterré à plus de 3 niveaux, sauf `pages/api/auth/[...nextauth].ts` qui est une convention obligatoire de NextAuth.

## Uploader ce projet à la main sur GitHub (sans terminal, sans zip)

Sur **github.com** (mobile ou desktop), pour chaque fichier :

1. Ouvre ton repo → bouton **Add file** → **Create new file**
2. Dans le champ du nom de fichier, tape le **chemin complet**, par exemple :
   `components/Button.tsx` ou `pages/api/auth/register.ts`
   → GitHub crée automatiquement tous les dossiers nécessaires, aucune étape "créer un dossier" séparée
3. Colle le contenu du fichier dans la zone de texte
4. Clique **Commit changes**
5. Répète pour chaque fichier

C'est plus long que l'upload en un coup (zip + terminal), mais zéro création de dossier manuelle, à n'importe quelle profondeur.

## Installation en local (si tu as un ordinateur à disposition)

### 1. Prérequis
- Node.js 18+
- Un compte [TiDB Cloud](https://tidbcloud.com) (gratuit)
- Un compte [Vercel](https://vercel.com) (gratuit)

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer TiDB Cloud
1. Crée un cluster **Serverless** (gratuit)
2. Onglet **Connect** → choisis "Prisma" → copie l'URL de connexion

### 4. Variables d'environnement
```bash
cp .env.example .env
```
Remplis `DATABASE_URL`, `NEXTAUTH_SECRET` (génère avec `openssl rand -base64 32`), `NEXTAUTH_URL`.

### 5. Créer les tables
```bash
npx prisma db push
```

### 6. Lancer en local
```bash
npm run dev
```

## Déploiement sur Vercel

1. Pousse le repo sur GitHub (via l'une des méthodes ci-dessus)
2. Sur vercel.com → **Add New Project** → importe le repo
3. Ajoute les mêmes variables d'environnement que ton `.env`
4. **Root Directory** : laisse vide (racine) si tu as uploadé les fichiers directement à la racine du repo
5. **Deploy**

## Ce qui est déjà construit (Phase 1 — Fondations)

- ✅ Authentification complète (inscription, connexion, session sécurisée)
- ✅ Schéma de base de données complet (toutes les tables du MVP)
- ✅ Design system (couleurs, typographies, composants Button/Input/StatCard)
- ✅ Navigation basse avec bouton d'action rapide
- ✅ Tableau de bord connecté aux vraies données
- ✅ Structure PWA (manifest.json)

## Ce qu'il reste à construire (prochaines phases, une par une)

- Gestion clients, produits, factures, dépenses
- Agenda, CV, créateur de flyers
- Mini boutique publique + soumission de preuve de paiement
- Dashboard administrateur

## Règle de cohérence à respecter pour la suite

- **Toute couleur/typo** vient de `tailwind.config.ts` — jamais de valeur en dur
- **Toute limite Gratuit/Premium** vient de `lib/plan-limits.ts`
- **Toute page protégée** utilise `lib/require-auth.ts` (`exigerConnexion`) dans son `getServerSideProps`
- **Tout composant réutilisable** va dans `components/`, jamais recopié

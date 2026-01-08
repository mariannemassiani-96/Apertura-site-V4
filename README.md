# Apertura di Corsica — Site V4

Site statique premium (Next.js 14 App Router) pour Apertura di Corsica.

## Prérequis
- Node.js 18+
- npm

## Installation
```bash
npm install
```

## Développement local
```bash
npm run dev
```

## Build production
```bash
npm run build
npm run start
```

## Remplacement des médias
Les médias sont centralisés dans `public/media/`.
- Vidéo hero : `public/media/hero-video.mp4`
- Poster hero : `public/media/hero-poster.jpg`
- Image OpenGraph : `public/media/og-cover.jpg`
- Images storytelling & sections :
  - `story-1.jpg` à `story-4.jpg`
  - `shrink-hero.jpg`
  - `floating-1.jpg` à `floating-5.jpg`
- Images gammes :
  - `gammes-hero.jpg`
  - `gamme-essentielle.jpg`
  - `gamme-harmoniosa.jpg`
  - `gamme-vista.jpg`
  - `gamme-seconda-vita.jpg`
- Menuiserie intérieure :
  - `menuiserie-interieure-hero.jpg`
  - `interieur-a.jpg` à `interieur-f.jpg`

## Contenus
Tous les textes sont centralisés dans `lib/content.ts`.

## Déploiement Vercel
1. Poussez le dépôt sur GitHub.
2. Importez le projet dans Vercel.
3. Assurez-vous que la commande de build est `npm run build`.
4. Le site est prêt en SSG avec App Router.

## Portail Pro (V0)
- Auth mock via `localStorage` (clé : `apertura_pro_token`).
- Données locales :
  - `apertura_pro_quotes`
  - `apertura_pro_cart`
  - `apertura_pro_requests`


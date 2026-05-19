# Prompt Claude Code — Vague 1 SEO Studio Kova

## Contexte

Le mapping SEO complet est dans `seo-mapping.md` (à la racine du repo) et est en cours de validation côté volumes de recherche (relevés Ubersuggest sur 5 jours).

En attendant cette validation, on attaque les **chantiers techniques** qui ne dépendent pas du contenu final : ils servent dans tous les cas et débloquent l'indexation propre du site.

**Stack** : Next.js 16 (App Router), déployé sur Vercel, domaine `www.studiokova.fr`.

**Prix offre analyse : 49€** (et non 69€ comme indiqué par erreur dans `CONTEXTE-SEO.md`).

---

## Périmètre

Implémenter les **5 chantiers prioritaires** ci-dessous. Ne touche PAS au contenu textuel des pages existantes ni à la création de nouvelles pages — uniquement le technique et les metadata.

---

## Chantier 1 — Sitemap XML dynamique

Créer `app/sitemap.ts` (mécanisme natif Next.js App Router).

**Inclure (indexables) :**
- `/`
- `/quiz`
- `/analyse`
- `/surmesure`
- `/blog` (si la route existe)
- Tous les `/blog/[slug]` si une fonction `getAllPosts()` existe — sinon laisser vide pour l'instant et ajouter un TODO dans le code

**Exclure explicitement :**
- `/admin/*`
- `/api/*`
- `/analyse/merci`
- `/premium/brief`
- `/premium/merci`
- `/offre-premium/*` (si la route existe)

**Priorités à appliquer :**
- 1.0 pour `/`
- 0.8 pour les pages d'offre (`/quiz`, `/analyse`, `/surmesure`)
- 0.6 pour `/blog` et les articles

**Change frequency :**
- `monthly` pour la homepage et les pages d'offre
- `weekly` pour `/blog`
- `yearly` pour les articles individuels

---

## Chantier 2 — robots.txt

Créer `app/robots.ts` (mécanisme natif Next.js, plutôt qu'un fichier statique pour rester cohérent avec le sitemap). Le robots doit produire ce contenu :

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /analyse/merci
Disallow: /premium/brief
Disallow: /premium/merci
Disallow: /offre-premium/

Sitemap: https://www.studiokova.fr/sitemap.xml
```

Si un ancien `public/robots.txt` existe, le supprimer.

---

## Chantier 3 — noindex sur les pages post-conversion

Ajouter `export const metadata = { robots: { index: false, follow: false } }` sur :

- `/analyse/merci`
- `/premium/brief`
- `/premium/merci`

Si ces pages ont déjà une metadata, fusionner avec l'existante (ne pas écraser).

Vérifie aussi si `/admin/*` a déjà du noindex au niveau du layout. Sinon, l'ajouter dans le layout admin pour couvrir toutes les sous-pages d'un coup.

---

## Chantier 4 — Schema.org Organization global

### Étape 1 — Composant réutilisable

Créer un composant `<JsonLd />` dans `components/seo/JsonLd.tsx` (ou équivalent selon la convention du projet). Il doit accepter un objet JSON-LD en prop et le rendre via `<script type="application/ld+json">`.

Implémentation type :

```tsx
type JsonLdProps = { data: Record<string, unknown> };

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### Étape 2 — Injection dans le layout racine

Dans `app/layout.js` (ou `.tsx`), injecter le schema Organization suivant via le composant `<JsonLd />`, placé dans le `<body>` (Next.js gère le `<head>` automatiquement, le script peut être en début de body) :

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Studio Kova",
  "url": "https://www.studiokova.fr",
  "logo": "https://www.studiokova.fr/logo-fond-vert.svg",
  "email": "hello@studiokova.fr",
  "description": "Conseil en décoration intérieure personnalisé et accessible en ligne. Quiz gratuit, analyse photo 49€, sur-mesure dès 230€/pièce.",
  "serviceArea": {
    "@type": "Country",
    "name": "France"
  },
  "sameAs": [
    "https://instagram.com/studiokova.fr"
  ]
}
```

---

## Chantier 5 — Metadata + canonical sur les pages d'offre

### `/` (homepage)

Ajouter le canonical à la metadata existante :

```js
alternates: { canonical: "https://www.studiokova.fr" }
```

Ne pas modifier le title ni la description existants à ce stade.

### `/quiz`

```js
export const metadata = {
  title: "Quiz style déco — Trouvez votre profil en 2 minutes",
  description: "6 questions, 12 profils de style. Recevez votre palette de couleurs et vos premières actions déco par email. Entièrement gratuit.",
  alternates: { canonical: "https://www.studiokova.fr/quiz" },
  openGraph: {
    title: "Quiz style déco — Trouvez votre profil en 2 minutes",
    description: "6 questions, 12 profils de style. Recevez votre palette de couleurs et vos premières actions déco par email.",
    url: "https://www.studiokova.fr/quiz",
    type: "website",
  }
}
```

### `/analyse`

```js
export const metadata = {
  title: "Analyse déco de votre pièce — 49€, livré en 48h",
  description: "Uploadez une photo de votre pièce. Recevez un PDF complet : palette, aménagement et liens d'achat. Réponse personnalisée en 48h.",
  alternates: { canonical: "https://www.studiokova.fr/analyse" },
  openGraph: {
    title: "Analyse déco de votre pièce — 49€, livré en 48h",
    description: "Uploadez une photo. Recevez un PDF complet : palette, aménagement, liens d'achat. 48h.",
    url: "https://www.studiokova.fr/analyse",
    type: "website",
  }
}
```

### `/surmesure`

```js
export const metadata = {
  title: "Décoration sur mesure en ligne — Sélection meubles",
  description: "Confiez votre intérieur à Studio Kova : sélection meubles, planche produits et liens d'achat livrés en 5 jours. À partir de 230€/pièce.",
  alternates: { canonical: "https://www.studiokova.fr/surmesure" },
  openGraph: {
    title: "Décoration sur mesure en ligne — Studio Kova",
    description: "Sélection meubles, planche produits et liens d'achat. À partir de 230€/pièce.",
    url: "https://www.studiokova.fr/surmesure",
    type: "website",
  }
}
```

**Important sur le prix : c'est 49€ pour l'analyse (pas 69€). Vérifier la cohérence partout — title, meta, et contenu de page si du texte affiche un prix erroné.**

---

## Ce que tu NE fais PAS dans cette PR

- ❌ Pas de Schema Product/Service sur `/analyse` et `/surmesure` (vague suivante, on attend la finalisation des volumes)
- ❌ Pas d'OG images dédiées (création des visuels d'abord côté design)
- ❌ Pas de nouvelles pages (`/styles/`, `/idees/`, blog) — on attend la validation du mapping
- ❌ Pas de modification de contenu textuel des pages existantes au-delà des metadata (sauf correction prix erroné si tu en trouves)

---

## Livrables attendus

Une PR avec :

- ✅ `app/sitemap.ts` créé
- ✅ `app/robots.ts` créé (et ancien `public/robots.txt` supprimé si présent)
- ✅ Metadata `noindex` ajoutée sur les 3 pages post-conversion (+ couverture `/admin/*` vérifiée)
- ✅ Composant `<JsonLd />` créé
- ✅ Schema Organization injecté dans `app/layout.js`
- ✅ Metadata + canonical mis à jour sur `/`, `/quiz`, `/analyse`, `/surmesure`

## Tests de vérification après déploiement Vercel

À vérifier manuellement après le merge :

1. `https://www.studiokova.fr/sitemap.xml` retourne du XML valide listant les bonnes URLs
2. `https://www.studiokova.fr/robots.txt` retourne le contenu attendu et pointe vers le sitemap
3. View source de `/` montre bien le `<script type="application/ld+json">` avec le schema Organization
4. View source de `/analyse/merci` montre bien `<meta name="robots" content="noindex, nofollow">`
5. View source de `/quiz`, `/analyse`, `/surmesure` montre bien le canonical tag et les nouveaux titles
6. Tester l'aperçu Open Graph via https://www.opengraph.xyz/ ou https://metatags.io/ sur les 3 pages d'offre

## Estimation

4-6h de travail au total.

## Approche recommandée

1. Lire d'abord la structure du repo, identifier le layout racine et la convention TS/JS utilisée
2. Faire les 5 chantiers dans l'ordre listé (sitemap → robots → noindex → schema → metadata)
3. Tester en local avec `npm run dev` avant de pusher
4. Créer la PR avec un titre clair : `feat(seo): foundations — sitemap, robots, schema Organization, canonical & metadata`
5. Décrire dans la PR description chaque chantier réalisé avec les checkboxes ci-dessus

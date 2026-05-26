# SEO Quick Wins — Studio Kova
## Les 7 chantiers des 30 prochains jours

_Prérequis : valider le mapping `seo-mapping.md` avant d'implémenter_

---

### Chantier 1 — noindex sur les pages post-conversion

**Effort : S (< 2h) · Impact : Moyen (évite dilution du crawl budget et contenu dupliqué)**

**Pages à passer en noindex :**
- `/analyse/merci`
- `/premium/merci`
- `/premium/brief`
- `/admin/*` (déjà dans robots.txt, à confirmer en metadata aussi)
- `/offre-premium/*`

**Comment :** Ajouter `export const metadata = { robots: { index: false, follow: false } }` dans chaque `page.jsx` concernée, **ou** gérer globalement via un middleware Next.js.

**Résultat attendu :** Google ne crawle plus ces pages, le crawl budget est concentré sur les pages qui ont de la valeur.

---

### Chantier 2 — robots.txt amélioré

**Effort : S (30 min) · Impact : Moyen**

Le `robots.txt` actuel (`Allow: /, Disallow: /admin/`) est insuffisant. Il laisse Google crawler les routes `/api/`, `/premium/brief`, `/analyse/merci`, etc.

**robots.txt cible :**
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

**Résultat attendu :** Focaliser Googlebot sur les 8-10 pages utiles aujourd'hui.

---

### Chantier 3 — Sitemap XML dynamique

**Effort : S (2-3h) · Impact : Fort**

Next.js App Router gère le sitemap nativement via `app/sitemap.ts`. À créer pour lister :
- Pages existantes indexables : `/`, `/quiz`, `/analyse`, `/surmesure`, `/blog`, `/blog/[slug]`
- Pages à venir : `/styles/[slug]`, `/idees/[slug]`, etc. (à ajouter au fur et à mesure)

**Exemple de structure :**
```ts
// app/sitemap.ts
import { getAllPosts } from '@/lib/blog'

export default function sitemap() {
  const posts = getAllPosts()
  const baseUrl = 'https://www.studiokova.fr'

  const staticRoutes = ['/', '/quiz', '/analyse', '/surmesure', '/blog'].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }))

  const blogRoutes = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...blogRoutes]
}
```

**Résultat attendu :** Googlebot découvre toutes les URLs utiles, indexation accélérée.

---

### Chantier 4 — Schema.org Organization dans `layout.js`

**Effort : S (1h) · Impact : Moyen (crédibilité + Knowledge Panel potentiel)**

Ajouter un JSON-LD `Organization` dans le `<head>` du `layout.js`. Ne pas utiliser `dangerouslySetInnerHTML` directement — passer par le mécanisme `<Script>` de Next.js ou via la fonction `generateMetadata`.

**JSON-LD à injecter (dans un composant `JsonLd`) :**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Studio Kova",
  "url": "https://www.studiokova.fr",
  "logo": "https://www.studiokova.fr/logo-fond-vert.svg",
  "email": "hello@studiokova.fr",
  "description": "Conseil en décoration intérieure personnalisé et accessible en ligne. Quiz gratuit, analyse photo 69€, sur-mesure dès 230€/pièce.",
  "serviceArea": {
    "@type": "Country",
    "name": "France"
  },
  "sameAs": []
}
```

**Résultat attendu :** Google peut construire le Knowledge Panel de Studio Kova, crédibilité de la marque renforcée.

---

### Chantier 5 — Optimiser les metadata des 3 pages d'offre

**Effort : S (2h) · Impact : Fort (améliore CTR depuis les SERPs dès l'indexation)**

Remplacer les metadata actuelles sur `/quiz`, `/analyse` et `/surmesure` par les versions optimisées du mapping.

**État actuel :**
- `/quiz` : title `"Je trouve mon style — Studio Kova"` — trop branded, mot-clé absent
- `/analyse` : pas de metadata dédiée (hérite du layout global)
- `/surmesure` : title `"Je vous confie mon intérieur — Studio Kova"` — pas de mot-clé

**Cibles :**

```js
// /quiz/page.js
export const metadata = {
  title: "Quiz style déco — Trouvez votre profil en 2 minutes",
  description: "6 questions, 12 profils de style. Recevez votre palette de couleurs et vos premières actions déco par email. Entièrement gratuit.",
  openGraph: { /* ... */ }
}
```

```js
// /analyse/page.jsx
export const metadata = {
  title: "Analyse déco de votre pièce — 69€, livré en 48h",
  description: "Uploadez une photo de votre pièce. Recevez un PDF complet : palette, aménagement et liens d'achat. Réponse personnalisée en 48h.",
  openGraph: { /* ... */ }
}
```

```js
// /surmesure/page.js
export const metadata = {
  title: "Décoration sur mesure en ligne — Sélection meubles",
  description: "Confiez votre intérieur à Studio Kova : sélection meubles, planche produits et liens d'achat livrés en 5 jours. À partir de 230€/pièce.",
  openGraph: { /* ... */ }
}
```

**Résultat attendu :** Amélioration du CTR organique, meilleur ancrage sémantique des pages.

---

### Chantier 6 — Schema Product sur `/analyse` et `/surmesure`

**Effort : M (3-4h) · Impact : Fort (éligibilité aux rich results Google Shopping/Knowledge)**

Ajouter un JSON-LD `Product` sur les deux pages produit pour être éligible aux rich results (étoiles, prix, disponibilité dans les SERPs).

**`/analyse` :**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Analyse déco de votre pièce",
  "description": "Analyse personnalisée de votre pièce par Studio Kova, livrée en 48h en PDF.",
  "brand": { "@type": "Brand", "name": "Studio Kova" },
  "offers": {
    "@type": "Offer",
    "price": "69",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "url": "https://www.studiokova.fr/analyse"
  }
}
```

**`/surmesure` :**
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Décoration d'intérieur sur-mesure en ligne",
  "provider": { "@type": "Organization", "name": "Studio Kova" },
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "230",
    "priceCurrency": "EUR"
  }
}
```

**Résultat attendu :** Eligibilité aux rich results Google → CTR potentiellement +20-30%.

---

### Chantier 7 — OG image + meta OG sur toutes les pages clés

**Effort : M (4-6h) · Impact : Moyen (partage social, CTR depuis les liens partagés)**

**Ce qui manque :**
- `/og-image.webp` référencé dans `layout.js` n'existe pas encore
- `/quiz`, `/analyse`, `/surmesure` n'ont pas d'image OG dédiée

**À créer (1200×630px, format WebP, <200ko chacune) :**
- `og-home.webp` — pour la homepage et le fallback global
- `og-quiz.webp` — avec tagline "Quel est votre style déco ?"
- `og-analyse.webp` — avec prix 69€ visible
- `og-surmesure.webp` — avec "Sur-mesure dès 230€/pièce"

**À mettre à jour dans chaque page :**
```js
openGraph: {
  images: [{ url: '/og-analyse.webp', width: 1200, height: 630, alt: '...' }]
}
```

**Résultat attendu :** Meilleur taux de clic sur les partages Messenger, WhatsApp, Pinterest — canal d'acquisition non négligeable pour cette cible.

---

## Récapitulatif

| # | Chantier | Effort | Impact | Délai suggéré |
|---|---------|--------|--------|---------------|
| 1 | noindex pages post-conversion | S | Moyen | J+1 |
| 2 | robots.txt amélioré | S | Moyen | J+1 |
| 3 | Sitemap XML dynamique | S | Fort | J+3 |
| 4 | Schema Organization (layout.js) | S | Moyen | J+3 |
| 5 | Metadata optimisées sur /quiz, /analyse, /surmesure | S | Fort | J+5 |
| 6 | Schema Product (/analyse, /surmesure) | M | Fort | J+7 |
| 7 | OG images + meta OG | M | Moyen | J+14 |

**Total : ~16h de travail · Résultats visibles dans Googlebot : 2-4 semaines après déploiement**

---

## Après les 30 jours

Une fois ces fondations posées, lancer la **vague 1 de contenu** (voir `seo-mapping.md`, Niveau 3, Vague 1) :
- Créer les 4 premières pages `/styles/` (scandinave, wabi-sabi, terracotta, jungle)
- Publier le pilier "Faire appel à un décorateur d'intérieur"
- Publier 2 satellites à fort volume (`/blog/cout-decorateur-interieur`, `/blog/couleurs-agrandissent-piece`)

Ces contenus seront la première vraie source de trafic organique — les quick wins ci-dessus préparent le terrain mais ne génèrent pas de trafic seuls.

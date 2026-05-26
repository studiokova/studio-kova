# Spécification fonctionnelle — Studio Kova

## Vue d'ensemble

Studio Kova est une plateforme de conseil en décoration intérieure avec 3 offres étagées, construite en Next.js 16 (App Router). Les intégrations principales : **Stripe** (paiements), **Supabase** (base de données), **Brevo** (emails), **Claude AI** (analyse design), **Vercel Blob** (stockage fichiers), **Notion** (suivi admin).

**Stack technique :** Next.js 16.2.6, React 19, Tailwind CSS 4, déployé sur Vercel. Domaine : `www.studiokova.fr`.

---

## Carte des routes

| Route | Description | Indexable |
|-------|-------------|-----------|
| `/` | Homepage | ✅ |
| `/quiz` | Quiz gratuit style déco | ✅ |
| `/analyse` | Formulaire analyse photo 69€ | ✅ |
| `/analyse/merci` | Confirmation analyse | ❌ noindex |
| `/je-transforme-ma-piece` | Point d'entrée → redirige vers `/analyse` | — |
| `/offre-premium` | Offre sur-mesure 299€+ | ✅ (alias `/surmesure`) |
| `/offre-premium/confirmation` | Confirmation sur-mesure | ❌ noindex |
| `/premium/brief` | Formulaire brief post-achat | ❌ noindex |
| `/premium/merci` | Confirmation brief envoyé | ❌ noindex |
| `/blog` | Index du blog | ✅ |
| `/blog/[slug]` | Article individuel | ✅ |
| `/piece/[type]` | Pages pièce (salon, chambre…) | ✅ |
| `/confidentialite` | Politique de confidentialité | ✅ |
| `/mentions-legales` | Mentions légales | ✅ |
| `/admin/envoyer-analyse` | Admin livraison analyses | ❌ noindex (layout admin) |
| `/api/*` | Routes API | ❌ disallow robots |

---

## Flow 1 — Quiz gratuit « Je trouve mon style »

### Entrée
Page `/` → CTA "Je trouve mon style" → `/quiz`

### Étapes du quiz (`/quiz`, composant `Quiz.js`)

| Step | Question | Type | Usage |
|------|----------|------|-------|
| Q1 | Qu'est-ce qui vous attire ? | Radio | Scoring couleur (chaud/froid/neutre) |
| Q2 | Quelle ambiance vous parle ? (max 2) | Multi-image | Scoring ×2 (poids double) |
| Q3 | Votre palette idéale ? | Radio | Scoring saturé/désaturé/épuré |
| Q4 | Pièce problématique ? | Radio | Données pour les 3 actions |
| Q5 | Ce qui vous bloque ? | Radio | Diagnostic, données marketing |
| Q6 | Budget pour cette pièce ? | Radio | Routing vers Analyse (<1500€) ou Sur-mesure |

**Scoring** : 7 axes calculés → mapping vers 1 des 12 profils archétypes :

| Profil | Palette | Description courte |
|--------|---------|-------------------|
| Scandinave chaleureux | #E8E0D5, #A89880, #6B5D4F | Aéré, bois chaud, lins naturels |
| Naturel affirmé | #C4A882, #8B6F47, #E8D5B7 | Rotin, bois brut, textures épaisses |
| Japonais minimaliste | #E8E4DC, #C4B8A0, #4A4A48 | Le vide comme composition |
| Contemporain sobre | #E2E2E0, #9B9B97, #3D3D3A | Béton, métal brossé, gris |
| Terracotta vivant | #C4623A, #E8A87C, #F5EFE4 | Ocre, argile, ambiance solaire |
| Vintage cuivré | #B8612A, #E8C97A, #2E4A3A | Laiton, velours, miroirs vieillis |
| Vert nature | #3D6B52, #6B9E7A, #E8D5B7 | Vert sauge, plantes, lin |
| Bleu nuit doux | #2C4A6E, #E8D5B7, #8BA5C4 | Bleu profond, enveloppant |
| Rétro pop 70s | #D4622A, #E8C440, #8B3A2A | Moutarde, orange brûlé, formes rondes |
| Jungle urbaine | #2E4A3A, #8B6F47, #C4623A | Les plantes structurent l'espace |
| Coloré assumé | #4A7CB5, #E8C440, #C4623A | La couleur comme point de départ |
| Maximalist dopamine | #C44B8A, #4A7CB5, #E8C440 | Dense, saturé, couches de sens |

### Écran résultat

- Affiche : nom du profil, 3 axes (tags), palette 3 couleurs, description, 3 actions concrètes pour la pièce choisie (Q4)
- Capture email + case consentement marketing
- Soumission → `POST /api/subscribe` :
  - Crée contact Brevo (liste 5)
  - Envoie email transactionnel (template 2) avec profil, palette, actions
  - `POST /api/profile` → upsert `style_profiles` Supabase (non-bloquant)
- CTA final route vers `/analyse` (si Q6 < 1500€) ou `/offre-premium`

---

## Flow 2 — Analyse photo 69€ « Je transforme ma pièce »

### Entrée
Page `/` → CTA "Je transforme ma pièce" **ou** CTA quiz (budget < 1500€) → `/analyse`

**Prix : 69€** (affiché partout : title, description, récap paiement, metadata SEO).

### Step 1 — Upload & email

- Upload 1–3 photos (JPG/PNG/WebP, max 5 Mo chacune), drag-drop ou clic
- Saisie email → `GET /api/profile?email=X` : vérifie si un profil quiz existe (utilisé en step 3 uniquement pour affichage, sans pré-remplissage automatique des champs)
- Fichiers uploadés via `POST /api/upload` → Vercel Blob
- Bouton "Suivant" désactivé tant que : aucune photo **ou** email invalide

### Step 2 — Contexte pièce

- Type de pièce (radio) : Salon, Chambre, Bureau, Salle à manger, Entrée, Autre
- Approche (radio) : "Tout transformer" | "Améliorer l'existant" → affiche champ conditionnel "Qu'est-ce que vous gardez ?"
- Ce qui vous dérange (textarea)
- Budget (radio) : <300€ | 300–800€ | 800–1500€ | >1500€
- Motivation (radio) : Emménagement | Rafraîchissement | Achat important | Perdu | Autre
- Bouton désactivé tant que type_piece + budget non remplis

### Step 3 — Préférences style

**Si profil quiz trouvé :**
- Affiche nom, axes, palette (informatif seulement)
- Formulaire standard proposé sans pré-remplissage

**Dans tous les cas :**
- Ambiances (chips, max 2) : Cosy | Lumineux | Élégant | Vivant | Zen
- Couleur préférée (texte)
- Couleur à éviter (texte)
- Matières (chips multi) : Bois naturel, Rotin, Lin, Velours, Laiton, Pierre, Céramique, Cuir

### Step 4 — Récap & paiement

- Récap pièce : type, budget, motivation
- Liste des livrables : analyse photo, recommandations couleurs/aménagement, PDF complet
- Prix : **69€**
- CTA "Passer la commande" → `POST /api/checkout` → session Stripe → redirect Stripe Checkout
  - URL succès : `/analyse/merci?session_id={CHECKOUT_SESSION_ID}`
  - URL annulation : retour `/analyse`

### Webhook Stripe (`POST /api/webhook`)

Événement `checkout.session.completed` :
1. Insère enregistrement `room_analyses` (status : `paid`)
2. Ajoute contact Brevo liste analyse
3. Retire de la liste quiz marketing (si applicable)
4. Lance `POST /api/analyze` en fire-and-forget

### Analyse IA (`POST /api/analyze`)

1. Fetch `room_analyses` → status `processing`
2. Appel Claude Sonnet avec photos + contexte pièce + préférences style
3. Réponse JSON structurée :
   ```
   diagnostic / palette (3 couleurs + usage) / priorités (action + pourquoi + coût estimé) /
   matières conseillées / matières à éviter / phrase clé
   ```
4. Status → `done`, résultat stocké en DB
5. `POST /api/pdf` → génération PDF → stocké Vercel Blob, `pdf_url` en DB
6. Email interne à hello@studiokova.fr avec résumé + lien PDF
7. Suppression photos Vercel Blob (hors environnement dev)

### Page confirmation (`/analyse/merci`)

- Metadata noindex/nofollow
- Message de confirmation
- Délai annoncé : 48h
- Instructions : surveiller l'email

---

## Flow 3 — Sur-mesure 299€+ « Je vous confie mon intérieur »

### Entrée
Page `/` → CTA "Je vous confie mon intérieur" **ou** CTA quiz (budget ≥ 1500€) → `/offre-premium`

### Page produit (`/offre-premium`)

- Présentation de l'offre : sélection de meubles, liens d'achat, planche complète, délai 5 jours, 1 révision
- **Calculateur de prix (`PriceCalculator.js`) :**
  - Sélection nombre de pièces (1–10)
  - Formule : 299€ + (n−1) × 230€
  - Prix recalculé en temps réel
- CTA "Commander" → `POST /api/create-checkout-session` avec `{ rooms: N }` → redirect Stripe
  - URL succès : `/premium/brief?session_id={CHECKOUT_SESSION_ID}`

### Brief premium (`/premium/brief?session_id=X`)

- `GET /api/premium/session?session_id=X` → récupère email + rooms_count
- `GET /api/profile?email=X` → profil quiz éventuel

**Step 1 — Informations client**
- Prénom (requis)
- Téléphone (optionnel)
- Phrase de projet (textarea, requis)

**Step 2 — Style**

*Si profil quiz trouvé :*
- "Oui, c'est ça" | "Partiellement" (+ textarea corrections) | "Non, je veux autre chose" (+ textarea)

*Si pas de profil :*
- Ambiances (chips multi) : Cosy | Lumineux | Apaisant | Élégant | Vivant | Minimaliste | Chaleureux | Bohème
- Couleurs (texte)
- URL Pinterest **ou** upload photos d'inspiration

**Steps 3 à N — Pour chaque pièce achetée**

- Type de pièce (multi-sélection, 9 options)
- Approche : Transformer | Améliorer (+ "qu'est-ce que vous gardez ?") | Aménager sur mesure
- Ce qui dérange (textarea)
- Ce que vous voulez ressentir (textarea)
- Budget (radio) : <500€ | 500–1000€ | 1000–2000€ | 2000–3500€ | >3500€
- Contraintes (textarea, optionnel)
- **Minimum 3 photos** de la pièce (requis)

**Step final — Envoi**

`POST /api/premium/brief` :
1. Insère `premium_briefs` dans Supabase
2. Email client (template Brevo 12) : confirmation de lancement
3. Email interne à hello@studiokova.fr : récap complet du brief (client, style, pièces, photos, lien admin)
4. Sauvegarde non-bloquante dans Notion
5. Redirect → `/premium/merci`

Pages `/premium/brief` et `/premium/merci` : metadata noindex/nofollow.

---

## Flow 4 — Admin : livraison analyse

### Accès
`/admin/envoyer-analyse` — protégé par mot de passe (`ADMIN_SECRET`), stocké en localStorage. Le layout admin (`/admin/layout.jsx`) porte le noindex pour couvrir toutes les sous-pages.

### Fonctionnement

1. `GET /api/admin/pending-analyses` → liste les `room_analyses` où status=`done` ET `delivered_at` IS NULL
2. Affiche : email client, type de pièce, date de création
3. Actions par entrée :
   - **"Voir le PDF"** → lien vers `pdf_url`
   - **"Envoyer à la cliente"** → `POST /api/admin/send-analysis`
     - Envoie email Brevo (template 7) avec lien PDF
     - Met à jour `delivered_at` en DB
     - Retire de la liste avec notification toast (5s)

---

## Flow 5 — Blog (`/blog` et `/blog/[slug]`)

### Fonctionnement

- Articles stockés en MDX dans `src/content/blog/`
- Frontmatter : `title`, `excerpt`, `date`, `image`, `pieces` (array de slugs de pièces associées)
- Parsing : `gray-matter` + `next-mdx-remote`
- Typographie française : plugin `rehypeFrenchTypo` (espaces insécables avant ponctuation)

### Page index (`/blog`)

- Liste toutes les publications triées par date (décroissant)
- Composant `KovaArticleCard` par article

### Page article (`/blog/[slug]`)

- Rendu MDX complet
- Table des matières (`KovaToc`)
- CTA en bas d'article (`KovaArticleCta`)
- Schema.org `Article` injecté via `<JsonLd />` (auteur, dates, image)
- Articles générés en statique (`generateStaticParams`)

### Redirect actif
`/blog/decorer-appartement-guide-complet` → `/blog/decorer-appartement` (301)

---

## Flow 6 — Pages pièces (`/piece/[type]`)

Pages de destination SEO pour chaque type de pièce :

| Slug | Pièce |
|------|-------|
| `salon` | Salon / Séjour |
| `chambre` | Chambre |
| `salle-de-bain` | Salle de bain |
| `cuisine` | Cuisine |
| `bureau` | Bureau |
| `entree` | Entrée |

- Données dans `src/data/pieces/[type].js` : title, description, OG image, FAQ, CTA
- Composant `PieceTemplate.js` partagé
- Articles de blog liés affichés si `pieces` frontmatter correspond
- Générées en statique (`generateStaticParams`)

---

## Infrastructure SEO

### Sitemap dynamique (`/sitemap.xml`)

Généré par `src/app/sitemap.js` — mécanisme natif Next.js App Router.

| URL | Priorité | Fréquence |
|-----|----------|-----------|
| `/` | 1.0 | monthly |
| `/quiz`, `/analyse`, `/offre-premium` | 0.9 | monthly |
| `/blog` | 0.8 | weekly |
| `/piece/[type]` | 0.7 | monthly |
| `/blog/[slug]` | 0.7 | monthly |
| `/confidentialite`, `/mentions-legales` | 0.3 | yearly |

**Exclues :** `/admin/*`, `/api/*`, `/analyse/merci`, `/offre-premium/confirmation`, `/premium/*`

### Robots.txt (`/robots.txt`)

Généré par `src/app/robots.js`.

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /analyse/merci
Disallow: /offre-premium/confirmation
Disallow: /premium/

Sitemap: https://www.studiokova.fr/sitemap.xml
```

### Schema.org

**Organization** (global, injecté dans `app/layout.js`) :
```json
{
  "@type": "Organization",
  "name": "Studio Kova",
  "url": "https://www.studiokova.fr",
  "logo": "https://www.studiokova.fr/logo-fond-vert.svg",
  "email": "hello@studiokova.fr",
  "description": "Conseil en décoration intérieure personnalisé et accessible en ligne. Quiz gratuit, analyse photo 69€, sur-mesure dès 230€/pièce.",
  "serviceArea": { "@type": "Country", "name": "France" },
  "sameAs": ["https://instagram.com/studiokova.fr"]
}
```

**Article** (par article de blog, via `<JsonLd />` dans `/blog/[slug]`).

Composant réutilisable : `src/components/seo/JsonLd.jsx` — accepte un objet JSON-LD et le rend via `<script type="application/ld+json" dangerouslySetInnerHTML>`.

### Canonical & metadata pages d'offre

| Page | Canonical |
|------|-----------|
| `/` | `https://www.studiokova.fr` |
| `/quiz` | `https://www.studiokova.fr/quiz` |
| `/analyse` | `https://www.studiokova.fr/analyse` |
| `/offre-premium` | `https://www.studiokova.fr/offre-premium` |

Chaque page d'offre a title, description et openGraph définis dans son fichier de page.

---

## RGPD & consentement (`ConsentContext.js`)

### Architecture

- `ConsentProvider` wrappé dans `app/layout.js` — expose `useConsent()`
- État stocké en `localStorage` (clé `kova_consent`)
- Valeurs : `accepted` | `rejected` | `null` (non-décidé)

### Composants

| Composant | Rôle |
|-----------|------|
| `ConsentBanner.js` | Bandeau affiché si consentement non décidé |
| `ConsentPreferences.js` | Modal de gestion fine des cookies |
| `CookieManageButton.js` | Bouton dans le footer pour rouvrir la modale |

### Pixels (conditionnels au consentement)

- **Meta Pixel** (`MetaPixel.js`) — chargé uniquement si consentement accepté
- **Pinterest Pixel** (`PinterestPixel.js`) — même condition

### Tracking UTM

`UtmCapture.js` — lit les paramètres UTM à l'arrivée et les stocke en `localStorage`. Inclus dans les métadonnées Stripe et Brevo pour attribution marketing.

---

## Analytics

### Plausible (privacy-first, toujours actif)

| Événement | Déclencheur |
|-----------|-------------|
| "Clic offre gratuite" | CTA quiz sur homepage |
| "Clic offre 69" | CTA analyse sur homepage |
| "Clic offre 299" | CTA sur-mesure sur homepage |

Intégration : `src/lib/plausible.js` — `track(event, props)` + `getSource()` pour détection referrer.

### Meta Pixel (soumis au consentement)

Suivi des conversions Facebook via `metaCapi.js` (Conversions API côté serveur) + `MetaPixel.js` (pixel côté client).

### Pinterest Pixel (soumis au consentement)

`PinterestPixel.js` — chargé conditionnellement après acceptation.

---

## Base de données Supabase

### `style_profiles`

| Champ | Type | Description |
|-------|------|-------------|
| email | TEXT UNIQUE | Identifiant principal |
| style_name | TEXT | Nom du profil archétype |
| ambiance_cible | TEXT[] | Ex. ["Doux", "Épuré", "Naturel"] |
| couleurs_aimees | TEXT[] | Noms des couleurs |
| couleurs_evitees | TEXT[] | |
| matieres_preferees | TEXT[] | |
| references_visuelles | TEXT[] | Sélections photos quiz (["A", "B"]) |
| marketing_consent | BOOLEAN | |
| consent_date | TIMESTAMP | Date du premier consentement |

### `room_analyses`

| Champ | Type | Description |
|-------|------|-------------|
| email | TEXT | |
| stripe_payment_id | TEXT | |
| photo_url | TEXT/JSON | URLs des photos uploadées |
| room_context | JSONB | type_piece, approche, garder, probleme, budget, motivation |
| style_context | JSONB | ambiance[], couleur_aimee, couleur_evitee, matieres[] |
| style_profile_snap | JSONB | Copie du profil au moment de l'achat |
| status | ENUM | paid → processing → done \| error |
| ai_result | JSONB | diagnostic, palette[], priorites[], matieres[], a_eviter[], phrase_cle |
| pdf_url | TEXT | |
| delivered_at | TIMESTAMP | Date d'envoi à la cliente (null si non encore livré) |

### `premium_briefs`

| Champ | Type | Description |
|-------|------|-------------|
| email | TEXT | |
| stripe_payment_id | TEXT | |
| rooms_count | INTEGER | |
| prenom | TEXT | |
| telephone | TEXT | Optionnel |
| projet_phrase | TEXT | Phrase de description du projet |
| style_validation | ENUM | confirmed \| partial \| none |
| style_profile_snap | JSONB | Copie du profil quiz si existant |
| style_corrections | TEXT | Si validation = partial |
| style_inputs | JSONB | ambiance[], couleurs, pinterest_url, photos[] |
| rooms | JSONB[] | [{type, approche, garder, derange, sentir, budget, contraintes, photos[]}] |
| submitted_at | TIMESTAMP | |

---

## Emails Brevo — récapitulatif

| Template | Déclencheur | Destinataire | Contenu |
|----------|-------------|--------------|---------|
| 2 | Résultat quiz soumis | Utilisatrice | Profil, palette 3 couleurs, 3 actions |
| 7 | Admin clique "Envoyer à la cliente" | Utilisatrice | Lien PDF analyse |
| 12 | Brief premium soumis | Utilisatrice | Confirmation lancement projet |
| Libre | Brief premium soumis | hello@studiokova.fr | Récap complet : client, style, pièces, lien admin |
| Libre | Analyse IA terminée | hello@studiokova.fr | Résumé résultat + lien PDF |
| Libre | Analyse IA échouée | hello@studiokova.fr | Alerte erreur avec ID analyse |

---

## Listes Brevo

| Variable env | Usage |
|---|---|
| Liste 5 (hardcodée) | Abonnés quiz |
| `BREVO_LIST_ANALYSIS` | Transactionnel analyses |
| `BREVO_LIST_ANALYSIS_MARKETING` | Marketing opt-in acheteuses analyse |
| `BREVO_LIST_QUIZZ_MARKETING` | Marketing opt-in quiz (consentement coché) |
| `BREVO_LIST_PREMIUM` | Clientes sur-mesure |

---

## Variables d'environnement requises

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY

# Stripe
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_ID_ANALYSIS       # 69€ analyse
STRIPE_PRICE_ID_SURMESURE      # Sur-mesure (premier tarif 299€)
STRIPE_PRODUCT_PREMIUM         # ID produit sur-mesure (optionnel)

# Anthropic
ANTHROPIC_API_KEY

# Brevo
BREVO_API_KEY
BREVO_LIST_ID
BREVO_LIST_ANALYSIS
BREVO_LIST_ANALYSIS_MARKETING
BREVO_LIST_QUIZZ_MARKETING
BREVO_LIST_PREMIUM
BREVO_TEMPLATE_ID_LIVRAISON_PDF

# Notion
NOTION_API_KEY
NOTION_DATABASE_ID
NOTION_DATABASE_ID_TEST

# Admin
ADMIN_SECRET
NOTIFICATION_EMAIL             # hello@studiokova.fr

# App
NEXT_PUBLIC_SITE_URL           # https://www.studiokova.fr
NEXT_PUBLIC_BASE_URL
NEXT_PUBLIC_APP_URL
NODE_ENV
```

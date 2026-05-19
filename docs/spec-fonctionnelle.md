# Spécification fonctionnelle — Studio Kova

## Vue d'ensemble

Studio Kova est une plateforme de conseil en décoration intérieure avec 3 offres étagées, construite en Next.js (App Router). Les intégrations principales : **Stripe** (paiements), **Supabase** (base de données), **Brevo** (emails), **Claude AI** (analyse design), **Vercel Blob** (stockage fichiers), **Notion** (suivi admin).

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
- CTA final route vers `/analyse` (si Q6 < 1500€) ou `/surmesure`

---

## Flow 2 — Analyse photo 49€ « Je transforme ma pièce »

### Entrée
Page `/` → CTA "Je transforme ma pièce" **ou** CTA quiz (budget < 1500€) → `/analyse`

### Step 1 — Upload & email

- Upload 1–3 photos (JPG/PNG/WebP, max 5 Mo chacune), drag-drop ou clic
- Saisie email → `GET /api/profile?email=X` : si profil quiz existant, pré-remplit les préférences style à l'étape 3
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
- Affiche nom, axes, palette
- Options : "Oui, garder ce profil" | "Non, ajuster" → textarea corrections

**Si pas de profil :**
- Ambiances (chips, max 2) : Cosy | Lumineux | Élégant | Vivant | Zen
- Couleur préférée (texte)
- Couleur à éviter (texte)
- Matières (chips multi) : Bois naturel, Rotin, Lin, Velours, Laiton, Pierre, Céramique, Cuir

### Step 4 — Récap & paiement

- Récap pièce : type, budget, motivation
- Liste des livrables : analyse photo, recommandations couleurs/aménagement, PDF complet
- Prix : **49€**
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

- Message de confirmation
- Délai annoncé : 48h
- Instructions : surveiller l'email

---

## Flow 3 — Sur-mesure 299€+ « Je vous confie mon intérieur »

### Entrée
Page `/` → CTA "Je vous confie mon intérieur" **ou** CTA quiz (budget ≥ 1500€) → `/surmesure`

### Page produit (`/surmesure`)

- Présentation de l'offre : sélection de meubles, liens d'achat, planche complète, délai 5 jours, 1 révision
- **Calculateur de prix :**
  - Slider nombre de pièces (1–10)
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

---

## Flow 4 — Admin : livraison analyse

### Accès
`/admin/envoyer-analyse` — protégé par mot de passe (`ADMIN_SECRET`), stocké en localStorage

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

## Analytics (Plausible)

| Événement | Déclencheur |
|-----------|-------------|
| "Clic offre gratuite" | CTA quiz sur homepage |
| "Clic offre 69" | CTA analyse sur homepage |
| "Clic offre 299" | CTA sur-mesure sur homepage |

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
STRIPE_PRICE_ID_ANALYSIS       # 49€ analyse
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
NEXT_PUBLIC_BASE_URL
NODE_ENV
```

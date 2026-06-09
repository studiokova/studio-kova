# Analytics — Studio Kova

Tracking Plausible pour les 3 funnels du site (Quiz gratuit, Analysis 97€, Premium 299€+).

## Changelog

| Date | Changement |
|---|---|
| 2026-06-09 | Refonte funnel Analysis : 4 étapes → 3, photos + email déplacés en étape 3 |
| 2026-06-09 | `Analysis Step 1/2/3 Completed` → renommés `Analysis Room Completed`, `Analysis Style Completed`, `Analysis Photos Uploaded` |
| 2026-06-09 | `Quiz Result Shown` supprimé, remplacé par `Quiz Email Submitted` (plus précis) |
| 2026-06-09 | Ajout `Analysis Photo Added`, `Analysis Email Entered`, `Analysis Upload Error` (intermédiaires step 3) |
| 2026-06-09 | Ajout `Piece Engaged` (30s) sur les pages pièce |
| 2026-06-09 | Ajout `PlausiblePageview` : pageview SPA sur chaque changement de route (corrige time on page = "-") |

---

## Setup technique

### Script Plausible

```html
<script
  defer
  data-domain="studiokova.fr"
  src="https://plausible.io/js/script.manual.revenue.tagged-events.js"
></script>
```

Le mode `manual` désactive le tracking automatique des pageviews. Le composant `PlausiblePageview` (`app/components/PlausiblePageview.js`) prend en charge l'envoi d'un `pageview` à chaque changement de route Next.js via `usePathname`.

### Helper centralisé

```js
import { track } from '@/lib/plausible';

track('Event Name', { prop1: 'value' });
track('Analysis Purchased', { room_type: 'salon' }, 97);
```

Le helper gère :
- Le no-op en SSR (`typeof window === 'undefined'`)
- Le no-op si Plausible bloqué (adblock)
- Le formatage revenue `{ currency: 'EUR', amount: N }`

## Convention de nommage

- Verbe au passé en anglais : `Started`, `Completed`, `Purchased`, `Submitted`
- Préfixé par le funnel ou la zone : `Quiz`, `Analysis`, `Premium`, `Piece`
- Sensible à la casse, espaces compris : `Analysis Purchased` ≠ `analysis purchased`

Les noms ci-dessous correspondent exactement aux goals déclarés dans Plausible. Ne pas les modifier sans mettre à jour le dashboard.

---

## Funnel 1 — Quiz gratuit

| Event | Props | Déclencheur | Fichier |
|---|---|---|---|
| `Quiz Started` | `source: 'homepage' \| 'direct' \| 'other'` | Mount du quiz | `components/Quiz.js` |
| `Quiz Step Completed` | `step: 1-6`, `answer: string` | Validation de chaque question | `components/Quiz.js` |
| `Quiz Gate Shown` | `profile: string`, `budget_range: string`, `room: string` | Fin du dernier step, gate email affichée | `components/Quiz.js` |
| `Quiz Email Submitted` | `profile: string`, `budget_range: string`, `room: string` | Phase passe à "result" (email validé dans la gate) | `components/Quiz.js` |
| `Quiz CTA Clicked` | `destination: 'analysis' \| 'premium'` | Clic CTA final selon routing budget Q6 | `components/Quiz.js` |

> `Quiz Result Shown` est supprimé depuis le 2026-06-09. Il était déclenché au même moment que `Quiz Email Submitted` (même changement de phase). `Quiz Email Submitted` le remplace avec les mêmes props.

---

## Funnel 2 — Analysis 97€

### Flow (3 étapes depuis 2026-06-09)

```
/piece/[type]  →  /analyse (step 1 : pièce)  →  step 2 : style  →  step 3 : photos + email + paiement
```

### Events principaux

| Event | Props | Revenue | Déclencheur | Fichier |
|---|---|---|---|---|
| `Vue page piece` | `piece: string` | — | Mount de la page pièce | `components/PieceTemplate.js` |
| `Clic CTA piece` | `piece: string`, `cta: 'hero-primary' \| 'hero-secondary' \| 'analyse' \| 'final-primary' \| 'final-secondary'` | — | Clic sur un CTA de la page pièce | `components/PieceTemplate.js` |
| `Piece Engaged` | `piece: string` | — | 30s de présence sur la page pièce | `components/PieceTemplate.js` |
| `Analysis Page Viewed` | `source: 'quiz' \| 'homepage' \| 'direct'`, `piece?: string` | — | Mount `/analyse` | `app/analyse/page.jsx` |
| `Analysis Room Completed` | `room_type: string`, `budget_range: string`, `cas_usage: string` | — | Validation step 1 (contexte pièce) | `app/analyse/page.jsx` |
| `Analysis Style Completed` | `style_source: 'quiz_kept' \| 'quiz_adjusted' \| 'manual'` | — | Validation step 2 (style) | `app/analyse/page.jsx` |
| `Analysis Photo Added` | `count: number` | — | Premier fichier ajouté (step 3) | `app/analyse/page.jsx` |
| `Analysis Email Entered` | `has_photos: boolean` | — | Blur sur le champ email avec valeur valide (step 3) | `app/analyse/page.jsx` |
| `Analysis Photos Uploaded` | `photo_count: number`, `has_quiz_profile: boolean` | — | Upload Vercel Blob réussi (step 3, avant redirect Stripe) | `app/analyse/page.jsx` |
| `Analysis Upload Error` | `photo_count: number` | — | Échec upload ou checkout (step 3) | `app/analyse/page.jsx` |
| `Analysis Checkout Started` | — | **97 EUR** | Juste avant redirect Stripe (après upload réussi) | `app/analyse/page.jsx` |
| `Analysis Purchased` | `room_type: string` | **97 EUR** | Mount `/analyse/merci` avec `session_id` valide | `app/analyse/merci/MerciTracker.jsx` |

### Events obsolètes (ne plus utiliser, à supprimer dans Plausible)

| Event | Remplacé par | Date |
|---|---|---|
| `Analysis Step 1 Completed` | `Analysis Photos Uploaded` | 2026-06-09 |
| `Analysis Step 2 Completed` | `Analysis Room Completed` | 2026-06-09 |
| `Analysis Step 3 Completed` | `Analysis Style Completed` | 2026-06-09 |

---

## Funnel 3 — Premium 299€+

Prix : `299 + (rooms - 1) × 230`. Donc 1 pièce = 299€, 2 = 529€, 3 = 759€, etc.

| Event | Props | Revenue | Déclencheur | Fichier |
|---|---|---|---|---|
| `Premium Page Viewed` | `source: 'quiz' \| 'homepage' \| 'direct'` | — | Mount page offre premium | `components/kova/PriceCalculator.js` |
| `Premium Slider Used` | `rooms_count: 1-10` | — | Slider calculateur (debounce 800ms) | — |
| `Premium Checkout Started` | `rooms_count: number` | **calculé EUR** | Clic "Commander" | — |
| `Premium Purchased` | `rooms_count: number` | **calculé EUR** | Mount `/premium/brief` avec `session_id` valide | — |
| `Premium Brief Step Completed` | `step_name: 'info' \| 'style' \| 'room_1' \| ...` | — | Validation step du brief | — |
| `Premium Brief Submitted` | `rooms_count: number` | — | Réponse OK de `/api/premium/brief` | `app/premium/brief/page.jsx` |

---

## CTAs transverses

| Event | Props | Déclencheur | Fichier |
|---|---|---|---|
| `Clic pièce home` | `piece: string` | Clic sur une carte pièce (homepage) | `app/page.js` |
| `Clic blog header` | — | Clic sur le lien Blog dans la nav | `components/kova/KovaNav.js` |

---

## Funnels configurés dans Plausible

### Room analysis (7 étapes)

```
Vue page piece
→ Clic CTA piece
→ Analysis Page Viewed
→ Analysis Room Completed
→ Analysis Style Completed
→ Analysis Photos Uploaded
→ Analysis Checkout Started
→ Analysis Purchased
```

### Quiz

```
Quiz Started
→ Quiz Gate Shown
→ Quiz Email Submitted
```

---

## Règles

### Anti-doublon sur les events `Purchased`

`Analysis Purchased` et `Premium Purchased` se tirent au mount de la page de retour Stripe. L'utilisateur peut refresh → l'event partirait deux fois.

Solution : guard via `sessionStorage` avec la clé `session_id` Stripe.

```js
useEffect(() => {
  const key = `tracked_${sessionId}`;
  if (sessionStorage.getItem(key)) return;
  track('Analysis Purchased', { room_type: ... }, 97);
  sessionStorage.setItem(key, '1');
}, [sessionId]);
```

### Détection de la source

Pour la prop `source` sur les Page Viewed et `Quiz Started`, parser `document.referrer` via `getSource()` dans `lib/plausible.js` :

- contient `/quiz` → `'quiz'`
- contient `studiokova.fr` (sans `/quiz`) → `'homepage'`
- vide ou externe → `'direct'`

### Revenue tracking : client uniquement

Les events de revenue sont déclenchés côté front au retour Stripe, **pas** dans le webhook serveur. Le webhook gère la DB et les emails ; le front gère l'analytics.

### Pas d'events en SSR

`window.plausible` n'existe que côté client. Le helper `track()` retourne silencieusement si `typeof window === 'undefined'`.

---

## Mapping fichiers → events

| Fichier | Events |
|---|---|
| `app/components/PlausiblePageview.js` | `pageview` (SPA route change) |
| `app/layout.js` | Script Plausible + mount `PlausiblePageview` |
| `app/page.js` | `Clic pièce home` |
| `components/kova/KovaNav.js` | `Clic blog header` |
| `components/PieceTemplate.js` | `Vue page piece`, `Clic CTA piece`, `Piece Engaged` |
| `components/kova/PriceCalculator.js` | `Premium Page Viewed` |
| `components/Quiz.js` | `Quiz Started`, `Quiz Step Completed`, `Quiz Gate Shown`, `Quiz Email Submitted` |
| `app/analyse/page.jsx` | `Analysis Page Viewed`, `Analysis Room Completed`, `Analysis Style Completed`, `Analysis Photo Added`, `Analysis Email Entered`, `Analysis Photos Uploaded`, `Analysis Upload Error`, `Analysis Checkout Started` |
| `app/analyse/merci/MerciTracker.jsx` | `Analysis Purchased` |
| `app/premium/brief/page.jsx` | `Premium Brief Submitted` |

---

## Dashboard Plausible — goals à configurer

### Goals actifs (à créer si absents)

| Goal | Type | Revenue |
|---|---|---|
| `Vue page piece` | Custom event | — |
| `Clic CTA piece` | Custom event | — |
| `Piece Engaged` | Custom event | — |
| `Quiz Started` | Custom event | — |
| `Quiz Step Completed` | Custom event | — |
| `Quiz Gate Shown` | Custom event | — |
| `Quiz Email Submitted` | Custom event | — |
| `Analysis Page Viewed` | Custom event | — |
| `Analysis Room Completed` | Custom event | — |
| `Analysis Style Completed` | Custom event | — |
| `Analysis Photo Added` | Custom event | — |
| `Analysis Email Entered` | Custom event | — |
| `Analysis Photos Uploaded` | Custom event | — |
| `Analysis Upload Error` | Custom event | — |
| `Analysis Checkout Started` | Custom event | **97 EUR** |
| `Analysis Purchased` | Custom event | **97 EUR** |
| `Premium Page Viewed` | Custom event | — |
| `Clic pièce home` | Custom event | — |
| `Clic blog header` | Custom event | — |
| `Premium Brief Submitted` | Custom event | — |

### Goals obsolètes (supprimer dans Plausible)

| Goal | Raison |
|---|---|
| `Quiz Result Shown` | Remplacé par `Quiz Email Submitted` (2026-06-09) |
| `Analysis Step 1 Completed` | Remplacé par `Analysis Photos Uploaded` (2026-06-09) |
| `Analysis Step 2 Completed` | Remplacé par `Analysis Room Completed` (2026-06-09) |
| `Analysis Step 3 Completed` | Remplacé par `Analysis Style Completed` (2026-06-09) |

---

## Ajouter ou modifier un event

1. Créer le goal dans Plausible (Settings → Goals → Add Goal → Custom event)
2. Ajouter une ligne dans ce fichier + une entrée dans le changelog
3. Implémenter l'appel `track()` dans le fichier concerné
4. Tester en console : `window.plausible('Event Name', { props: { ... } })`
5. Vérifier dans Plausible → Goals que l'event remonte

# Analytics — Studio Kova

Tracking Plausible pour les 3 funnels du site (Quiz gratuit, Analysis 69€, Premium 299€+).

## Setup technique

### Script Plausible

Le script Plausible doit charger les extensions `manual` (events custom déclenchés depuis le code) et `revenue` (montants associés aux paiements).

```html
<script
  defer
  data-domain="studiokova.fr"
  src="https://plausible.io/js/script.manual.revenue.tagged-events.js"
></script>
```

À placer dans `app/layout.js`.

### Helper centralisé

Tous les appels passent par `lib/plausible.js` :

```js
import { track } from '@/lib/plausible';

track('Event Name', { prop1: 'value' });
track('Analysis Purchased', { room_type: 'salon' }, 69);
```

Le helper gère :
- Le no-op en SSR (pas de `window`)
- Le no-op si Plausible bloqué (adblock)
- Le formatage revenue `{ currency: 'EUR', amount: N }`

## Convention de nommage

- Verbe au passé en anglais : `Started`, `Completed`, `Purchased`, `Submitted`
- Préfixé par le funnel : `Quiz`, `Analysis`, `Premium`
- Sensible à la casse, espaces compris : `Analysis Purchased` ≠ `analysis purchased`

Les noms ci-dessous correspondent exactement aux goals déclarés dans Plausible. Ne pas les modifier sans mettre à jour le dashboard.

## Funnel 1 — Quiz gratuit

| Event | Props | Déclencheur |
|---|---|---|
| `Quiz Started` | `source: 'homepage' \| 'direct' \| 'other'` | Mount Q1 dans `Quiz.js` |
| `Quiz Step Completed` | `step: 1-6`, `answer: string` | Validation de chaque question |
| `Quiz Result Shown` | `profile: string`, `budget_range: string`, `room: string` | Affichage écran résultat |
| `Quiz Email Submitted` | `profile: string`, `marketing_consent: boolean` | Réponse OK de `/api/subscribe` |
| `Quiz CTA Clicked` | `destination: 'analysis' \| 'premium'` | Clic CTA final selon routing budget Q6 |

## Funnel 2 — Analysis 69€

| Event | Props | Revenue | Déclencheur |
|---|---|---|---|
| `Analysis Page Viewed` | `source: 'quiz' \| 'homepage' \| 'direct'` | — | Mount `/analyse` |
| `Analysis Step 1 Completed` | `photo_count: 1-3`, `has_quiz_profile: boolean` | — | Validation step 1 (photos + email) |
| `Analysis Step 2 Completed` | `room_type: string`, `budget_range: string`, `approche: string` | — | Validation step 2 (contexte pièce) |
| `Analysis Step 3 Completed` | `style_source: 'quiz_kept' \| 'quiz_adjusted' \| 'manual'` | — | Validation step 3 (style) |
| `Analysis Checkout Started` | — | **69 EUR** | Clic "Passer la commande", avant redirect Stripe |
| `Analysis Purchased` | `room_type: string` | **69 EUR** | Mount `/analyse/merci` avec `session_id` valide |

## Funnel 3 — Premium 299€+

Prix : `299 + (rooms - 1) × 230`. Donc 1 pièce = 299€, 2 = 529€, 3 = 759€, etc.

| Event | Props | Revenue | Déclencheur |
|---|---|---|---|
| `Premium Page Viewed` | `source: 'quiz' \| 'homepage' \| 'direct'` | — | Mount `/surmesure` |
| `Premium Slider Used` | `rooms_count: 1-10` | — | Slider calculateur (debounce 800ms) |
| `Premium Checkout Started` | `rooms_count: number` | **calculé EUR** | Clic "Commander" |
| `Premium Purchased` | `rooms_count: number` | **calculé EUR** | Mount `/premium/brief` avec `session_id` valide |
| `Premium Brief Step Completed` | `step_name: 'info' \| 'style' \| 'room_1' \| ...` | — | Validation step du brief |
| `Premium Brief Submitted` | `rooms_count: number` | — | Réponse OK de `/api/premium/brief` |

## CTAs transverses (homepage)

| Event | Props | Déclencheur |
|---|---|---|
| `Hero CTA Clicked` | `offer: 'free' \| 'analysis' \| 'premium'` | Clic CTA du hero |
| `Offers Section CTA Clicked` | `offer: 'free' \| 'analysis' \| 'premium'` | Clic "C'est parti →" section offres |
| `Final CTA Clicked` | `offer: 'free' \| 'analysis' \| 'premium'` | Clic CTA bandeau final |

Note : actuellement tous les CTAs hero/final pointent vers `/quiz` donc `offer: 'free'`. La prop est conservée pour évolutivité.

## Règles à respecter

### Anti-doublon sur les events `Purchased`

`Analysis Purchased` et `Premium Purchased` se tirent au mount de la page de retour Stripe. L'utilisateur peut refresh → l'event partirait deux fois.

Solution : guard via `sessionStorage` avec la clé `session_id` Stripe.

```js
useEffect(() => {
  const key = `tracked_${sessionId}`;
  if (sessionStorage.getItem(key)) return;
  track('Analysis Purchased', { room_type: ... }, 69);
  sessionStorage.setItem(key, '1');
}, [sessionId]);
```

### Détection de la source

Pour la prop `source` sur les Page Viewed et `Quiz Started`, parser `document.referrer` :

- contient `/quiz` → `'quiz'`
- contient `studiokova.fr` (sans `/quiz`) → `'homepage'`
- vide ou externe → `'direct'`

### Revenue tracking : client uniquement

Les events de revenue sont déclenchés côté front au retour Stripe, **pas** dans le webhook serveur. Le webhook gère la DB et les emails ; le front gère l'analytics. C'est volontaire — Plausible n'a pas besoin d'être appelé depuis le serveur pour ces events.

### Pas d'événements en SSR

`window.plausible` n'existe que côté client. Le helper `track()` doit retourner silencieusement si `typeof window === 'undefined'`.

## Mapping fichiers → events

| Fichier | Events à instrumenter |
|---|---|
| `app/layout.js` | Vérifier extensions du script Plausible |
| `lib/plausible.js` | Créer le helper `track()` |
| `app/page.js` | `Hero CTA Clicked`, `Offers Section CTA Clicked`, `Final CTA Clicked` |
| `app/quiz/Quiz.js` | `Quiz Started`, `Quiz Step Completed`, `Quiz Result Shown`, `Quiz Email Submitted`, `Quiz CTA Clicked` |
| `app/analyse/page.js` (+ composants steps) | `Analysis Page Viewed`, `Analysis Step 1/2/3 Completed`, `Analysis Checkout Started` |
| `app/analyse/merci/page.js` | `Analysis Purchased` |
| `app/surmesure/page.js` | `Premium Page Viewed`, `Premium Slider Used`, `Premium Checkout Started` |
| `app/premium/brief/page.js` | `Premium Purchased`, `Premium Brief Step Completed`, `Premium Brief Submitted` |

## Dashboard Plausible

Les 20 goals sont déjà créés. 4 d'entre eux sont configurés en Revenue Goal (EUR) :

- `Analysis Checkout Started`
- `Analysis Purchased`
- `Premium Checkout Started`
- `Premium Purchased`

Les 4 goals Plausible par défaut (`Form: Submission`, `File Download`, `Outbound Link: Click`, `404`) sont conservés — ils fonctionnent automatiquement via les extensions du script et ne nécessitent pas d'instrumentation.

## Modifier ou ajouter un event

1. Créer le goal dans Plausible (Settings → Goals → Add Goal → Custom event)
2. Ajouter une ligne dans ce fichier (funnel concerné)
3. Implémenter l'appel `track()` dans le fichier concerné
4. Tester en local avec la console : `window.plausible('Event Name', { props: { ... } })`

# Studio Kova — Règles du projet

## Design system
- Tous les composants sont dans `/components/kova/`
- Aucune couleur, typo ou espacement en dur dans les pages
- Uniquement des `var(--...)` et des composants Kova
- Si un composant n'existe pas, le créer en respectant la charte
- La homepage ne doit pas être modifiée sans instruction explicite

## Palette
--craie: #F5EFE4
--cuivre: #B8612A
--sauge-med: #3D6B52
--sauge-fonce: #2E4A3A
--vert-sauge: #6B9E7A
--ocre: #E8C97A
--sauge-mid: #A8CCB8
--gris: #888780
--gris-clair: #D3D1C7

## Typographies
- Titres : Playfair Display
- Corps / UI : DM Sans

## Design
- Mobile first : toujours designer à 390px avant le desktop
- Jamais deux sections de même couleur côte à côte
- Espacement vertical entre sections : 48px minimum
- Border-radius cohérent : 8px inputs, 10px boutons, 14px cards
- Pas de shadow sauf exception justifiée
- Contraste minimum 4.5:1 sur tous les textes

## Images
- Toute image ajoutée doit être convertie en WebP avant intégration
- Taille max : 200ko décorative, 400ko hero
- Toujours spécifier width et height pour éviter le layout shift
- Utiliser next/image pour le lazy loading automatique
- Nommage : kebab-case descriptif (ex. salon-fauteuils-verts.webp)
- Jamais de base64 en production — uniquement en prototype

## Tests
- Tout nouveau composant doit avoir un fichier `__tests__/NomComposant.test.jsx`
- Tout nouveau tunnel ou page doit avoir un test d'intégration
- Lancer `npm run test` avant chaque PR
- Objectif couverture > 80%
- Toujours mocker Stripe et les appels mail en test

## Stripe
- Toutes les clés depuis `process.env`, jamais en dur
- Environnement test : clés `sk_test_` / `pk_test_`
- Environnement prod : clés `sk_live_` / `pk_live_`
- Ne jamais committer `.env`, `.env.local`, `.env.production`

## Code
- Pas de composant de plus de 150 lignes — découper si nécessaire
- Pas de props drilling au-delà de 2 niveaux — utiliser un context
- Toujours typer les props (PropTypes ou TypeScript)
- Les appels API dans des hooks dédiés (`/hooks/useStripe.js`, etc.)
- Pas de logique métier dans les composants UI
- Toujours un état `loading` et un état `error` sur les formulaires
- Pas de `console.log` en production
- Langue : français dans l'UI, anglais dans le code
- Composants : PascalCase
- Fichiers pages : kebab-case

## Performance
- Pas de bibliothèque externe si faisable en CSS natif
- Fonts chargées avec `font-display: swap`
- Pas d'import de toute une lib pour une seule fonction
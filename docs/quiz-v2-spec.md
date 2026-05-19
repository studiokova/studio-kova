# Quiz Studio Kova — Spécifications V2

Document de référence pour les modifications à apporter au composant `app/quiz/page.tsx`.

---

## 1. Structure des questions

### Ce qui change

Le quiz passe de 7 questions à 6, organisées en deux temps distincts.

**Q7 actuelle ("En une phrase, l'ambiance que vous voulez créer") est supprimée.**

### Nouveau mapping des questions

| Nouveau index | Ancien index | Question | Rôle |
|---|---|---|---|
| Q1 | Q2 | Ce qui vous attire en premier dans un beau salon | Scoring |
| Q2 | Q3 | Ambiances en photos (max 2) | Scoring |
| Q3 | Q4 | Palette idéale | Scoring |
| Q4 | Q1 | Quelle pièce vous pose problème | Personnalisation output |
| Q5 | Q5 | Ce qui vous bloque le plus | Personnalisation output |
| Q6 | Q6 | Votre budget | Orientation CTA |

### Scoring : aucun changement

La matrice de scoring (SCORING) et les profils (PROFILES) sont identiques. Seuls les index changent dans le code :
- `answers[2]` → `answers[1]`
- `answers[3]` → `answers[2]`
- `answers[4]` → `answers[3]`
- `answers[1]` (pièce) → `answers[4]`
- `answers[5]` (blocage) → `answers[5]` (inchangé)
- `answers[6]` (budget) → `answers[6]` (inchangé)

Mettre à jour `SCORING` en conséquence :
```js
const SCORING = {
  1: { /* ex Q2 */ },
  2: { /* ex Q3 */ },
  3: { /* ex Q4 */ },
};
```

Et dans `computeProfile` :
```js
const q1 = answers[1]; // ex answers[2]
const q2 = answers[2] || []; // ex answers[3]
const q3 = answers[3]; // ex answers[4]
```

---

## 2. Barre de progression et sous-titre

### Ce qui change

Remplacer le label `"Question X / 7"` par un label contextuel en deux parties :

- Q1 à Q3 : `Votre style · Question 1/6`, `Votre style · Question 2/6`, `Votre style · Question 3/6`
- Q4 à Q6 : `Votre situation · Question 4/6`, `Votre situation · Question 5/6`, `Votre situation · Question 6/6`

### Implémentation suggérée

```js
const getStepLabel = (step) => {
  const category = step <= 3 ? "Votre style" : "Votre situation";
  return `${category} · Question ${step}/6`;
};
```

Remplacer dans le JSX :
```jsx
// Avant
<div className="qz-qlabel">Question {step} / 7</div>

// Après
<div className="qz-qlabel">{getStepLabel(step)}</div>
```

La barre de progression passe de `TOTAL = 7` à `TOTAL = 6` :
```js
const TOTAL = 6;
```

---

## 3. Textes des 12 profils

Remplacer intégralement le champ `text` de chaque profil dans l'objet `PROFILES`.
Supprimer toutes les interpolations `[Q5]` et `[Q7]`. Les textes sont désormais fixes.

### Scandinave chaleureux
```
Les intérieurs qui vous attirent ont toujours quelque chose en commun : du bois clair, du lin, de la lumière naturelle, peu d'objets mais bien choisis. Pas froid, pas clinique. Juste aéré et chaleureux en même temps. C'est un équilibre qui semble simple et qui ne l'est pas. Un élément de trop et la pièce perd ce souffle qui la rendait belle.
```

### Naturel affirmé
```
Vous aimez les matières qu'on a envie de toucher. Le rotin un peu rugueux, le bois qu'on n'a pas trop poncé, le lin épais qui tombe bien. Vos intérieurs de référence ont une texture, une densité, quelque chose qui ressemble à une vie installée. Rien ne sort d'un catalogue et pourtant tout va ensemble.
```

### Japonais minimaliste
```
Vous êtes attirée par les intérieurs où le vide fait partie de la composition. Peu de meubles, peu de couleurs, peu d'objets, mais chacun parfaitement à sa place. Ce style demande une discipline que la plupart des gens trouvent difficile à tenir : savoir quoi enlever est toujours plus dur que savoir quoi ajouter.
```

### Contemporain sobre
```
Vos références sont nettes, maîtrisées, sans fioriture. Béton, métal brossé, bois foncé, palette de gris et de blancs cassés. Rien ne déborde, rien ne crie. C'est un style qui donne une impression d'évidence alors qu'il repose sur des proportions très précises. Un mauvais choix de matière et tout semble froid plutôt que sobre.
```

### Terracotta vivant
```
Ocre, terracotta, argile, sable chaud : vous revenez toujours à ces couleurs sans forcément savoir les nommer. Ce sont des teintes qui réchauffent une pièce dès qu'on les pose, qui s'associent naturellement avec le bois brut et la céramique non émaillée. Un intérieur solaire, ancré, qui sent le voyage sans chercher à le citer.
```

### Vintage cuivré
```
Laiton, velours côtelé, bois foncé qui a vécu, miroirs avec un peu d'usure aux bords : vous reconnaissez ces détails partout où vous allez. Vos intérieurs de référence ont du caractère, parfois même un peu d'excès assumé. Ce ne sont pas des pièces décorées, ce sont des pièces habitées depuis longtemps.
```

### Vert nature
```
Le vert est votre couleur de fond, celle vers laquelle vous revenez sans vous poser la question. Sauge, forêt, olive, eucalyptus : ces teintes vous apaisent et vous ancrent en même temps. Vos intérieurs idéaux ont des plantes, du lin, du bois clair, et cette impression qu'on respire différemment dès qu'on entre.
```

### Bleu nuit doux
```
Vous aimez les intérieurs enveloppants, ceux où les murs semblent se rapprocher doucement pour créer quelque chose de protégé. Bleu nuit, vert bouteille, prune, ardoise : ces couleurs profondes vous attirent même si elles vous font un peu peur. Elles donnent à une pièce une présence que les tons clairs n'ont pas.
```

### Rétro pop 70s
```
Moutarde, brique, orange brûlé, formes rondes et pieds fuselés : vous avez un oeil pour les pièces des années 70 et leurs héritiers contemporains. Vos intérieurs de référence sont chaleureux, un peu chargés, avec des couleurs qui s'assument. Il y a toujours un objet inattendu qui donne le ton, et c'est souvent ce que vous repérez en premier.
```

### Jungle urbaine
```
Vos plantes ne sont pas un accessoire, elles structurent la pièce. Pothos qui débordent, figuiers au sol, étagères entièrement dédiées au vert : vous visualisez votre appartement comme un espace vivant, qui change avec les saisons, qui demande de l'attention. Les matières qui vont avec ce style sont brutes et organiques : terre cuite, osier, bois non traité.
```

### Coloré assumé
```
Un mur bleu Klein, un canapé jaune soleil, des coussins qui clashent et qui fonctionnent quand même : vous êtes attirée par les intérieurs qui font un choix de couleur fort et qui l'assument jusqu'au bout. Pas de neutralité par défaut. La couleur comme point de départ, pas comme touche finale.
```

### Maximalist dopamine
```
Trop n'est pas un mot qui vous fait peur. Vous aimez les intérieurs denses, saturés, où chaque surface raconte quelque chose et où les couleurs se répondent d'un bout à l'autre de la pièce. Ce n'est pas du désordre, c'est une composition qui demande de la cohérence justement parce qu'elle prend des risques.
```

---

## 4. Suppression des interpolations dans le rendu résultat

Dans le JSX de la section résultat, remplacer :

```jsx
// Avant
<p className="qz-result-text">
  {profile.text.replace("[Q5]", q5Text).replace("[Q7]", `"${q7Text}"`).replace(/ — /g, " : ")}
</p>

// Après
<p className="qz-result-text">{profile.text}</p>
```

Supprimer aussi les variables devenues inutiles :
```js
// Supprimer ces deux lignes
const q5Text = answers[5] || "je ne sais pas par où commencer";
const q7Text = answers[7] || "un intérieur qui vous ressemble";
```

---

## 5. Mise à jour de submitEmail

Dans `submitEmail`, mettre à jour les attributs Brevo avec les nouveaux index :

```js
attributes: {
  PROFIL: profile?.name || "",
  PIECE: answers[4] || "",   // ex answers[1]
  ATTRAIT: answers[1] || "", // ex answers[2]
  PHOTOS: (answers[2] || []).join(", "), // ex answers[3]
  PALETTE: answers[3] || "", // ex answers[4]
  BLOCAGE: answers[5] || "",
  BUDGET: answers[6] || "",
},
```

Supprimer l'attribut `AMBIANCE` (ex Q7, supprimée).

Supprimer aussi dans le traitement `processedText` et `processedActions` les `.replace("[Q5]", ...)` et `.replace("[Q7]", ...)` devenus inutiles.

---

## 6. Mise à jour de isStepReady

```js
const isStepReady = () => {
  if (step === 2) return (answers[2] || []).length > 0; // ex step === 3
  return answers[step] != null;
};
```

---

## 7. Mise à jour du CTA final (ctaLabel / ctaHref)

Aucun changement — answers[6] est toujours le budget.

---

## 8. Résumé des fichiers à modifier

| Fichier | Modifications |
|---|---|
| `app/quiz/page.tsx` | Tout ce qui précède |

Aucun autre fichier n'est impacté. Le scoring, les 12 profils, le design et le flow de paiement restent identiques.

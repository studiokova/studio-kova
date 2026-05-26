# Prompt Claude — Rédaction d'un article de blog Studio Kova

## Contexte

Tu rédiges un article de blog pour Studio Kova, un studio de décoration intérieure en ligne. Le livrable est un fichier MDX à déposer directement dans `src/content/blog/[slug].mdx`, prêt à l'intégration sans retouche.

**Ton et posture éditoriale :** expert accessible. Pas de vouvoiement précieux ni de tutoiement familier — un intermédiaire professionnel, direct. On ne vend pas, on explique. La vente vient du fond, pas du ton.

**Offres à connaître :**
- Quiz déco gratuit → `/quiz`
- Analyse photo déco 69€, livré en 48h → `/analyse`
- Sur-mesure à partir de 230€/pièce → `/surmesure`

---

## Format du fichier MDX

Le fichier doit respecter exactement cette structure :

```
src/content/blog/[slug].mdx
```

### Frontmatter obligatoire

```yaml
---
title: "[Titre exact de l'article — 55-65 caractères idéalement]"
date: "YYYY-MM-DD"
excerpt: "[Description 150-160 caractères — premier paragraph de l'article résumé pour le snippet Google et l'email]"
keywords: ["mot-clé principal", "variante 1", "variante 2", "variante 3", "variante 4", "variante 5", "variante 6"]
pieces: ["salon", "chambre", "bureau", "entree", "cuisine", "salle-de-bain"]
image: "/blog/[slug-de-l-article].webp"
---
```

**Règles frontmatter :**
- `title` : identique à l'H1 de l'article (pas de duplication H1/titre différents)
- `date` : date réelle de rédaction au format ISO
- `excerpt` : auto-suffisant hors contexte (affiché dans les cards et les aperçus OG)
- `keywords` : 6 à 8 mots-clés, le premier est le mot-clé cible principal, les suivants sont des variantes longue traîne et semantiques
- `pieces` : types de pièces concernées parmi `salon`, `chambre`, `bureau`, `entree`, `cuisine`, `salle-de-bain` — utilisés pour les liens croisés automatiques entre articles et pages pièce
- `image` : chemin vers le visuel principal (format WebP, nommage kebab-case, à fournir séparément)

### Frontmatter optionnel — OpenGraph personnalisé

À ajouter si le title OG doit différer du title SEO (ex. version plus courte pour les réseaux) :

```yaml
openGraph:
  title: "[Version courte du title pour les réseaux — 60 caractères max]"
  description: "[Variante de l'excerpt optimisée partage — 120 caractères max]"
  url: "https://www.studiokova.fr/blog/[slug]"
  type: "article"
```

### Frontmatter optionnel — FAQ Schema

À ajouter si l'article répond à des questions fréquentes (améliore les chances de Featured Snippet et People Also Ask) :

```yaml
faq:
  - question: "[Question exacte telle que tapée sur Google]"
    answer: "[Réponse directe, 2-4 phrases, en texte plat sans markdown]"
  - question: "[Deuxième question]"
    answer: "[Réponse]"
```

**Règles FAQ :**
- 3 à 6 questions maximum
- Les questions doivent être réelles (reprendre les formulations Google, pas des reformulations marketing)
- Les réponses doivent être en texte brut (pas de gras, pas de liste — le JSON-LD Schema ne les supporte pas)
- La section FAQ dans le corps de l'article doit reprendre les mêmes questions, mot pour mot

---

## Structure du corps de l'article

### Longueur

- Article standard : 900 à 1 400 mots
- Article approfondi (guide complet) : 1 500 à 2 500 mots
- Pas de rembourrage — chaque paragraphe doit apporter une information nouvelle

### Structure type

```
[Introduction — 2 à 4 paragraphes]
Accroche sur le problème réel du lecteur, pas sur les généralités du sujet.
Le mot-clé principal doit apparaître dans le premier paragraphe.

## [H2 — section principale 1]
[corps]

## [H2 — section principale 2]
[corps]

## [H2 — section principale 3]
[corps]

[Section FAQ — uniquement si faq: est présent dans le frontmatter]
## Questions fréquentes
[les mêmes Q/R que dans le frontmatter, avec gras sur les questions]

---

[CTA de fin — 2 à 3 phrases max + lien interne vers l'offre la plus pertinente]
```

### Règles de rédaction

**Structure :**
- H2 uniquement pour les grandes sections — pas de H3 sauf dans les articles > 1 500 mots
- Paragraphes courts : 2 à 4 phrases maximum
- Listes à puces pour les énumérations de 3 items ou plus
- Citations (blockquote `>`) pour les formulations à retenir, maximum 1 ou 2 par article

**SEO dans le texte :**
- Mot-clé principal dans : introduction (premier paragraphe), un H2, conclusion
- Variantes sémantiques distribuées naturellement dans le corps
- 1 à 2 liens internes vers d'autres articles (`/blog/[slug]`) si pertinent
- 1 lien interne vers une offre Studio Kova, placé naturellement dans le corps (pas uniquement en CTA final)

**Ton :**
- Pas de "nous" éditorial — l'auteur est Studio Kova, pas "nous les décorateurs"
- Pas de superlatifs vides ("incroyable", "magnifique", "révolutionnaire")
- Phrases actives, verbes d'action
- Exemples concrets avec chiffres précis quand disponibles (budgets, dimensions, délais)

---

## CTA de fin

Le dernier paragraphe avant `---` doit toujours contenir un appel à l'action vers l'offre la plus pertinente pour le sujet de l'article :

- Article sur la couleur, l'aménagement, une pièce spécifique → lien vers `/analyse`
- Article sur le style déco, l'identité décorative → lien vers `/quiz` d'abord, puis `/analyse`
- Article sur un projet complet, un budget élevé → lien vers `/surmesure`

Format du lien : `[texte ancre naturel](/offre)` — pas de bouton en MDX, le bouton est rendu automatiquement par la page.

---

## Exemple de fichier complet

```mdx
---
title: "Comment décorer un salon en 5 étapes concrètes"
date: "2026-06-10"
excerpt: "Transformer un salon sans partir de zéro ni exploser son budget : les 5 étapes dans l'ordre, avec les erreurs à éviter à chaque palier."
keywords: ["comment décorer un salon", "décorer salon budget", "aménagement salon petite surface", "déco salon moderne", "comment relooker son salon", "salon décoration idée"]
pieces: ["salon"]
image: "/blog/comment-decorer-salon-5-etapes.webp"
faq:
  - question: "Par quoi commencer pour décorer un salon ?"
    answer: "Commencez par identifier les éléments fixes que vous gardez (canapé, sol, fenêtres) avant d'acheter quoi que ce soit. Ces contraintes définissent votre palette de couleurs et votre budget réel."
  - question: "Quel budget pour rénover un salon ?"
    answer: "Un rafraîchissement efficace (textiles, éclairage, plantes, petits accessoires) se fait entre 300 et 800€. Une transformation complète avec mobilier neuf dépasse 2 000€. L'erreur la plus courante est d'acheter des accessoires avant d'avoir réglé le gros problème (souvent le tapis ou l'éclairage)."
---

Transformer son salon ne suppose pas de tout changer. Dans 80% des cas, le problème vient d'un ou deux éléments qui tirent l'ensemble vers le bas — et les identifier avant d'acheter quoi que ce soit change radicalement le budget nécessaire.

Voici les 5 étapes dans l'ordre, avec ce qui se passe concrètement à chaque palier.

## 1. Identifier ce qui ne fonctionne pas (avant d'acheter)

[corps de section...]

## 2. Fixer les contraintes non négociables

[corps de section...]

## 3. Choisir une palette de 3 couleurs maximum

[corps de section...]

## 4. Hiérarchiser par impact visuel

[corps de section...]

## 5. Acheter dans l'ordre, pas en même temps

[corps de section...]

## Questions fréquentes

**Par quoi commencer pour décorer un salon ?**

Commencez par identifier les éléments fixes que vous gardez (canapé, sol, fenêtres) avant d'acheter quoi que ce soit. Ces contraintes définissent votre palette de couleurs et votre budget réel.

**Quel budget pour rénover un salon ?**

Un rafraîchissement efficace (textiles, éclairage, plantes, petits accessoires) se fait entre 300 et 800€. Une transformation complète avec mobilier neuf dépasse 2 000€. L'erreur la plus courante est d'acheter des accessoires avant d'avoir réglé le gros problème (souvent le tapis ou l'éclairage).

---

Si vous voulez qu'on fasse ce diagnostic sur votre salon à partir de photos, c'est exactement ce que propose l'[analyse déco Studio Kova à 69€](/analyse) : un plan d'action hiérarchisé, livré en 48h.
```

---

## Ce que tu NE fais PAS

- ❌ Pas de lien externe (sauf source factuelle incontournable)
- ❌ Pas de composants React dans le MDX — uniquement du markdown standard
- ❌ Pas d'image inline avec `<Image />` — uniquement la syntaxe `![alt](/chemin.webp)` pour les images dans le corps
- ❌ Pas de mention de concurrents nommés
- ❌ Pas de prix inventés — utiliser uniquement les prix officiels (quiz gratuit, analyse 69€, sur-mesure 299€/pièce)
- ❌ Pas de `console.log`, de commentaires de code, ni de balises HTML dans le MDX

---

## Livrable

Un seul fichier MDX, chemin complet indiqué en en-tête, prêt à être déposé dans `src/content/blog/`. Pas de fichier image à ce stade (à fournir séparément en WebP).

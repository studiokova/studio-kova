# SEO Mapping complet — Studio Kova

_Généré le 19 mai 2026 — à réviser après validation des keywords sur un outil (Semrush, Ahrefs, Google Search Console)_

---

## Synthèse & 10 actions prioritaires

Classées par impact × faisabilité à court terme :

| # | Action | Impact | Effort | Délai |
|---|--------|--------|--------|-------|
| 1 | Implémenter sitemap.xml dynamique (Next.js 13+ natif) | Fort | S | J+2 |
| 2 | noindex sur `/analyse/merci`, `/premium/merci`, `/premium/brief`, `/admin/*` | Moyen (évite dilution) | S | J+2 |
| 3 | Schema.org `Organization` + `WebSite` dans `layout.js` | Moyen | S | J+3 |
| 4 | Optimiser title + meta description sur `/quiz`, `/analyse`, `/surmesure` | Fort | S | J+3 |
| 5 | OG image dédiée par page clé (quiz, analyse, surmesure) | Moyen | M | J+7 |
| 6 | Schema `Product` sur `/analyse` et `/surmesure` | Fort (rich results) | S | J+5 |
| 7 | Créer les 12 pages `/styles/[slug]` (templates) | Fort (volume + maillage) | M | S2 |
| 8 | Publier le pilier 1 blog "Comment trouver son style déco" | Fort (trafic organique) | L | S3 |
| 9 | Créer 3-4 pages `/idees/[slug]` à fort volume | Fort | M | S3 |
| 10 | Créer la page `/conseil-decoration-en-ligne` | Moyen (top of funnel) | M | M2 |

---

## Niveau 1 — Pages existantes (à optimiser)

---

### `/` — Homepage

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "conseil décoration intérieur en ligne" |
| **Volume estimé** | Moyen (500–2 000 / mois) |
| **Intention** | Mixte (informationnelle + transactionnelle) |
| **Difficulté SEO** | Difficile (Côté Maison, IKEA, Maisons du Monde) |
| **Mots-clés secondaires** | "décorateur d'intérieur en ligne", "conseil déco personnalisé", "studio déco en ligne", "coach décoration intérieur" |
| **Title** | `Studio Kova — Conseil déco personnalisé en ligne` (49 chars) |
| **Meta description** | `Trouvez votre style déco et transformez vos pièces depuis chez vous. Quiz gratuit, analyse photo 49€ ou accompagnement sur-mesure. Sans rendez-vous.` (149 chars) |
| **H1 recommandé** | "La déco personnalisée, enfin accessible." _(actuel — à conserver)_ |
| **Slug** | `/` — inchangé |
| **Statut indexation** | Indexable |
| **Schema.org** | `Organization` (nom, url, logo, email, description), `WebSite` (SearchAction vers /blog), `ItemList` (offres) |
| **Maillage sortant** | → `/quiz`, → `/analyse`, → `/surmesure`, → `/blog`, → `/styles/` |

**Notes :** La homepage ne doit pas sur-optimiser sur un seul mot-clé — son rôle est d'orienter. Le vrai travail de ranking se fait sur les pages de 2e niveau (styles, idées, blog).

---

### `/quiz` — Quiz de style gratuit

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "quiz style déco" |
| **Volume estimé** | Faible (<500 / mois) mais fort potentiel viral (partage résultat) |
| **Intention** | Informationnelle / engagement |
| **Difficulté SEO** | Faible (peu de concurrents sur ce format exact) |
| **Mots-clés secondaires** | "quiz décoration intérieur", "trouver son style déco", "profil déco personnalisé", "test style intérieur" |
| **Title** | `Quiz style déco — Trouvez votre profil en 2 minutes` (52 chars) |
| **Meta description** | `6 questions, 12 profils de style. Recevez votre palette de couleurs et vos premières actions déco par email. Entièrement gratuit.` (130 chars) |
| **H1 recommandé** | "Quel est votre style déco ?" |
| **Slug** | `/quiz` — inchangé |
| **Statut indexation** | Indexable |
| **Schema.org** | `FAQPage` (les 6 questions du quiz en FAQ condensée), `BreadcrumbList` |
| **Maillage sortant** | → `/analyse` (post-quiz, budget <1500€), → `/surmesure` (budget ≥1500€), → `/styles/` (liens vers les 12 archétypes dans la page résultat) |

**Notes :** Envisager une meta OG avec aperçu du résultat (palette + archétype) pour maximiser le taux de partage organique — chaque partage est un backlink potentiel.

---

### `/analyse` — Analyse photo 49€

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "analyse déco appartement" |
| **Volume estimé** | Faible (<500 / mois) — longue traîne mais haute intention d'achat |
| **Intention** | Transactionnelle |
| **Difficulté SEO** | Faible (offre quasiment unique en France) |
| **Mots-clés secondaires** | "conseil déco photo pièce", "transformer sa pièce décoration", "bilan déco appartement", "décoration intérieur pas cher" |
| **Title** | `Analyse déco de votre pièce — 49€, livré en 48h` (49 chars) |
| **Meta description** | `Uploadez une photo de votre pièce. Recevez un PDF complet : palette, aménagement et liens d'achat. Réponse personnalisée en 48h. 49€ seulement.` (144 chars) |
| **H1 recommandé** | "Transformez votre pièce — analyse photo personnalisée, 49€" |
| **Slug** | `/analyse` — inchangé |
| **Statut indexation** | Indexable |
| **Schema.org** | `Product` (name, price: 49, priceCurrency: EUR, description, offers), `Service`, `BreadcrumbList` |
| **Maillage sortant** | → `/quiz` (si pas encore de profil), → `/surmesure` (upsell), → `/blog/` (articles associés sur transformation de pièce) |

**Objectif de conversion :** Achat direct 49€.

---

### `/analyse/merci` — Confirmation analyse

| Paramètre | Valeur |
|-----------|--------|
| **Statut indexation** | **noindex, nofollow** |
| **Raison** | Page post-paiement sans valeur SEO, duplication de contenu potentielle |
| **Schema.org** | Aucun |

---

### `/surmesure` — Offre sur-mesure 299€+

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "décorateur d'intérieur en ligne" |
| **Volume estimé** | Moyen (500–2 000 / mois) |
| **Intention** | Transactionnelle (forte intention d'achat) |
| **Difficulté SEO** | Difficile (concurrence sur ce terme exact) |
| **Mots-clés secondaires** | "sélection meubles sur mesure", "planche déco personnalisée", "coach déco en ligne", "conseil décoration professionnel en ligne" |
| **Title** | `Décoration sur mesure en ligne — Sélection meubles` (51 chars) |
| **Meta description** | `Confiez votre intérieur à Studio Kova : sélection meubles, planche produits et liens d'achat livrés en 5 jours. À partir de 230€/pièce.` (136 chars) |
| **H1 recommandé** | "Je vous confie mon intérieur — décoration sur mesure en ligne" |
| **Slug** | `/surmesure` — inchangé |
| **Statut indexation** | Indexable |
| **Schema.org** | `Product` (name, priceRange: "230€–", offers AggregateOffer), `Service` (serviceType: Interior Design), `BreadcrumbList` |
| **Maillage sortant** | → `/quiz` (découvrir son style avant), → `/analyse` (downsell), → `/blog/` (article "faire appel à un décorateur") |

**Objectif de conversion :** Achat 299€ + (n-1)×230€.

---

### `/premium/brief` — Formulaire brief post-paiement

| Paramètre | Valeur |
|-----------|--------|
| **Statut indexation** | **noindex, nofollow** |
| **Raison** | Page fonctionnelle protégée par session Stripe — sans intérêt SEO et potentiellement accessible à quiconque connaît l'URL |
| **Schema.org** | Aucun |

---

### `/premium/merci` — Confirmation sur-mesure

| Paramètre | Valeur |
|-----------|--------|
| **Statut indexation** | **noindex, nofollow** |
| **Raison** | Page post-conversion, contenu générique, risque de crawl budget |
| **Schema.org** | Aucun |

---

### `/blog` — Journal

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "conseils décoration intérieur" |
| **Volume estimé** | Fort (2 000–10 000 / mois) |
| **Intention** | Informationnelle |
| **Difficulté SEO** | Très difficile (Côté Maison, Marie Claire Maison dominent) |
| **Mots-clés secondaires** | "idées déco appartement", "inspiration décoration intérieur", "astuces décoration maison" |
| **Title** | `Journal déco — Conseils et inspirations · Studio Kova` (54 chars) |
| **Meta description** | `Méthodes concrètes, guides de style et inspirations déco pour transformer votre intérieur avec justesse. Par Studio Kova.` (121 chars) |
| **H1 recommandé** | "Conseils & inspirations déco" _(actuel — OK)_ |
| **Slug** | `/blog` — inchangé |
| **Statut indexation** | Indexable |
| **Schema.org** | `Blog`, `BreadcrumbList` |

---

## Niveau 2 — Pages SEO dédiées à créer

---

### 2a. Pages "style" — `/styles/[slug]`

12 pages, une par archétype. Route : `/styles/[slug]`. Ces pages forment la colonne vertébrale du SEO de Studio Kova : elles capturent les requêtes de style (forte affinité avec la cible), qualifient l'audience et redirigent vers le quiz ou l'analyse.

**Structure de contenu commune (8 sections H2) :**
1. Qu'est-ce que ce style ? (définition, origines, valeurs)
2. La palette de couleurs (3 teintes, comment les utiliser, proportions)
3. Les matières et textures clés
4. Les pièces emblématiques (3-5 meubles ou objets iconiques)
5. L'éclairage idéal
6. Ce qu'il faut éviter (les erreurs courantes)
7. Comment savoir si c'est mon style ? (5 questions d'auto-diagnostic)
8. Par où commencer ? (CTA quiz + CTA analyse)

---

#### `/styles/scandinave-chaleureux`

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "déco style scandinave" |
| **Volume estimé** | Fort (2 000–5 000 / mois) |
| **Intention** | Informationnelle / mixte |
| **Difficulté SEO** | Difficile |
| **Secondaires** | "intérieur scandinave chaleureux", "hygge décoration", "déco bois naturel lin", "style nordique appartement" |
| **Title** | `Style scandinave chaleureux — Guide déco complet` (49 chars) |
| **Meta** | `Bois chaud, lin naturel et palette neutre : guide complet du style scandinave chaleureux. Palette, matières, meubles et premiers pas.` (133 chars) |
| **CTA principal** | Vers `/quiz` — "Découvrez si c'est votre style" |
| **CTA secondaire** | Vers `/analyse` — "Transformer ma pièce dans ce style" |
| **Maillage interne** | → `/quiz`, → `/analyse`, → `/blog/comment-trouver-son-style-deco`, → `/styles/naturel-affirme`, → `/styles/japonais-minimaliste` |

---

#### `/styles/naturel-affirme`

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "décoration intérieur naturel et organique" |
| **Volume estimé** | Moyen (500–2 000 / mois) |
| **Intention** | Informationnelle / mixte |
| **Difficulté SEO** | Moyen |
| **Secondaires** | "déco rotin bois brut", "style bohème naturel", "intérieur matières naturelles", "déco wicker et lin" |
| **Title** | `Style naturel affirmé — Rotin, bois brut et textures` (52 chars) |
| **Meta** | `Rotin, bois brut, lin épais : le style naturel affirmé pour un intérieur ancré et vivant. Guide palette, matières et meubles clés.` (131 chars) |
| **CTA principal** | Vers `/quiz` |
| **Maillage interne** | → `/quiz`, → `/analyse`, → `/styles/scandinave-chaleureux`, → `/styles/vert-nature` |

---

#### `/styles/japonais-minimaliste`

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "déco wabi-sabi intérieur" |
| **Volume estimé** | Moyen (500–2 000 / mois) |
| **Intention** | Informationnelle |
| **Difficulté SEO** | Faible (niche accessible) |
| **Secondaires** | "décoration japonaise minimaliste", "intérieur zen épuré", "style japandi", "déco vide composition" |
| **Title** | `Style japonais minimaliste & wabi-sabi — Guide déco` (52 chars) |
| **Meta** | `Le vide comme composition. Guide complet du style japonais wabi-sabi : palette, matières, meubles et l'art de l'épure à la française.` (134 chars) |
| **CTA principal** | Vers `/quiz` |
| **Maillage interne** | → `/quiz`, → `/analyse`, → `/styles/contemporain-sobre`, → `/blog/wabi-sabi-decoration` |

---

#### `/styles/contemporain-sobre`

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "intérieur contemporain épuré" |
| **Volume estimé** | Moyen (500–2 000 / mois) |
| **Intention** | Informationnelle |
| **Difficulté SEO** | Difficile |
| **Secondaires** | "déco béton métal brossé", "intérieur gris épuré", "style loft contemporain", "déco minimaliste moderne" |
| **Title** | `Style contemporain sobre — Béton, métal et gris` (48 chars) |
| **Meta** | `Béton, métal brossé, palette de gris : le style contemporain sobre pour un intérieur fort et sans artifice. Guide palette et matières.` (135 chars) |
| **CTA principal** | Vers `/quiz` |
| **Maillage interne** | → `/quiz`, → `/analyse`, → `/styles/japonais-minimaliste`, → `/styles/bleu-nuit-doux` |

---

#### `/styles/terracotta-vivant`

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "décoration terracotta intérieur" |
| **Volume estimé** | Moyen (500–2 000 / mois) |
| **Intention** | Informationnelle / mixte |
| **Difficulté SEO** | Moyen |
| **Secondaires** | "déco ocre argile", "intérieur solaire chaud", "couleurs terracotta salon", "déco méditerranéenne" |
| **Title** | `Style terracotta vivant — Ocre, argile et soleil` (49 chars) |
| **Meta** | `Ocre, argile et tons solaires : le style terracotta vivant pour un intérieur généreux et chaleureux. Palette, matières et idées déco.` (134 chars) |
| **CTA principal** | Vers `/quiz` |
| **Maillage interne** | → `/quiz`, → `/analyse`, → `/styles/vintage-cuivre`, → `/styles/jungle-urbaine` |

---

#### `/styles/vintage-cuivre`

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "décoration vintage laiton" |
| **Volume estimé** | Faible (<500 / mois) |
| **Intention** | Informationnelle |
| **Difficulté SEO** | Faible |
| **Secondaires** | "intérieur vintage cuivré", "déco laiton velours miroirs", "style rétro élégant", "déco vintage chic" |
| **Title** | `Style vintage cuivré — Laiton, velours et miroirs` (50 chars) |
| **Meta** | `Laiton, velours et miroirs vieillis : le style vintage cuivré pour un intérieur à la fois sophistiqué et chaleureux. Guide complet.` (132 chars) |
| **CTA principal** | Vers `/quiz` |
| **Maillage interne** | → `/quiz`, → `/analyse`, → `/styles/retro-pop-70s`, → `/styles/terracotta-vivant` |

---

#### `/styles/vert-nature`

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "déco vert sauge intérieur" |
| **Volume estimé** | Moyen (500–2 000 / mois) |
| **Intention** | Informationnelle / mixte |
| **Difficulté SEO** | Moyen |
| **Secondaires** | "intérieur vert sauge lin", "déco verte plantes", "couleur vert sauge salon", "intérieur naturel vert" |
| **Title** | `Style vert nature — Sauge, lin et plantes` (42 chars) |
| **Meta** | `Vert sauge, lin et plantes structurantes : le style vert nature pour un intérieur vivant et apaisant. Palette, meubles et codes du style.` (138 chars) |
| **CTA principal** | Vers `/quiz` |
| **Maillage interne** | → `/quiz`, → `/analyse`, → `/styles/jungle-urbaine`, → `/styles/naturel-affirme` |

---

#### `/styles/bleu-nuit-doux`

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "décoration bleu nuit intérieur" |
| **Volume estimé** | Faible (<500 / mois) |
| **Intention** | Informationnelle |
| **Difficulté SEO** | Faible |
| **Secondaires** | "déco bleu profond enveloppant", "intérieur couleur nuit", "bleu nuit salon déco", "palette bleu foncé maison" |
| **Title** | `Style bleu nuit doux — Profond, enveloppant, apaisant` (53 chars) |
| **Meta** | `Bleu profond, tons beige chaud et matières douces : le style bleu nuit doux pour un intérieur cocooning et élégant. Guide complet.` (131 chars) |
| **CTA principal** | Vers `/quiz` |
| **Maillage interne** | → `/quiz`, → `/analyse`, → `/styles/contemporain-sobre`, → `/styles/japonais-minimaliste` |

---

#### `/styles/retro-pop-70s`

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "décoration rétro 70s intérieur" |
| **Volume estimé** | Faible (<500 / mois) |
| **Intention** | Informationnelle |
| **Difficulté SEO** | Faible |
| **Secondaires** | "déco années 70 moutarde", "style rétro pop couleurs", "intérieur vintage 70s", "déco orange brûlé formes rondes" |
| **Title** | `Style rétro pop 70s — Moutarde, orange et formes rondes` (55 chars) |
| **Meta** | `Moutarde, orange brûlé et formes organiques : le style rétro pop 70s pour un intérieur joyeux et affirmé. Palette et références clés.` (134 chars) |
| **CTA principal** | Vers `/quiz` |
| **Maillage interne** | → `/quiz`, → `/analyse`, → `/styles/vintage-cuivre`, → `/styles/colore-assume` |

---

#### `/styles/jungle-urbaine`

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "déco jungle urbaine appartement" |
| **Volume estimé** | Moyen (500–2 000 / mois) |
| **Intention** | Informationnelle / mixte |
| **Difficulté SEO** | Moyen |
| **Secondaires** | "intérieur plantes exotiques", "déco urban jungle", "plantes structurantes intérieur", "appartement végétal" |
| **Title** | `Style jungle urbaine — Plantes, tressage et terracotta` (54 chars) |
| **Meta** | `Plantes structurantes, tressage et tons tropicaux : le style jungle urbaine pour un intérieur vivant et audacieux. Guide complet.` (129 chars) |
| **CTA principal** | Vers `/quiz` |
| **Maillage interne** | → `/quiz`, → `/analyse`, → `/styles/vert-nature`, → `/styles/naturel-affirme` |

---

#### `/styles/colore-assume`

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "intérieur coloré déco" |
| **Volume estimé** | Faible (<500 / mois) |
| **Intention** | Informationnelle |
| **Difficulté SEO** | Faible |
| **Secondaires** | "déco couleurs vives appartement", "intérieur coloré assumé", "comment associer les couleurs déco", "palette colorée maison" |
| **Title** | `Style coloré assumé — La couleur comme point de départ` (54 chars) |
| **Meta** | `Bleu, jaune et terracotta : le style coloré assumé pour un intérieur qui affiche sa personnalité sans complexe. Guide palette et codes.` (136 chars) |
| **CTA principal** | Vers `/quiz` |
| **Maillage interne** | → `/quiz`, → `/analyse`, → `/styles/maximalist-dopamine`, → `/styles/retro-pop-70s` |

---

#### `/styles/maximalist-dopamine`

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "décoration maximalist dopamine" |
| **Volume estimé** | Faible (<500 / mois) mais forte viralité potentielle |
| **Intention** | Informationnelle |
| **Difficulté SEO** | Faible (terme émergent) |
| **Secondaires** | "déco dopamine décoration", "intérieur maximalist dense", "décoration saturée couches", "déco audacieuse assumée" |
| **Title** | `Style maximalist dopamine — Dense, saturé, assumé` (50 chars) |
| **Meta** | `Couleurs saturées, couches de sens et décoration dense : le style maximalist dopamine pour ceux qui n'ont pas peur de l'excès. Guide complet.` (141 chars) |
| **CTA principal** | Vers `/quiz` |
| **Maillage interne** | → `/quiz`, → `/analyse`, → `/styles/colore-assume`, → `/blog/deco-dopamine` |

---

### 2b. Pages "pièce × budget" — `/idees/[slug]`

12 pages ciblant les intentions de recherche fortes de la cible (locataires, primo-accédantes, petits budgets, petites surfaces).

| Slug | Mot-clé principal | Volume | Intention | Difficulté | Title (≤60) |
|------|------------------|--------|-----------|------------|-------------|
| `/idees/relooker-salon-petit-budget` | "relooker salon petit budget" | Fort (2k-5k) | Info/Trans | Difficile | `Relooker son salon avec un petit budget — Guide` |
| `/idees/amenager-petit-appartement` | "aménager petit appartement" | Très fort (>5k) | Info/Trans | Très difficile | `Aménager un petit appartement — Méthode complète` |
| `/idees/decorer-chambre-locataire` | "décorer chambre locataire" | Moyen (500-2k) | Info | Moyen | `Décorer sa chambre quand on est locataire` |
| `/idees/bureau-maison-deco` | "bureau à domicile décoration" | Moyen (500-2k) | Info/Trans | Moyen | `Bureau à domicile : idées déco et organisation` |
| `/idees/premier-appartement-deco` | "décoration premier appartement" | Fort (2k-5k) | Info/Trans | Difficile | `Décorer son premier appartement — Par où commencer` |
| `/idees/deco-entree-appartement` | "décorer entrée appartement" | Moyen (500-2k) | Info | Moyen | `Décorer une entrée d'appartement — Idées et astuces` |
| `/idees/amenager-studio-petit-espace` | "aménager un studio" | Fort (2k-5k) | Info | Difficile | `Aménager un studio — Méthode et plan d'espace` |
| `/idees/renovation-douce-appartement` | "rénovation douce appartement" | Moyen (500-2k) | Info/Trans | Moyen | `Rénovation douce : transformer sans travaux` |
| `/idees/deco-salon-sans-abimer-murs` | "décoration salon sans percer murs" | Moyen (500-2k) | Info | Faible | `Décorer son salon sans percer les murs` |
| `/idees/chambre-adulte-relooking` | "relooking chambre adulte" | Moyen (500-2k) | Info/Trans | Moyen | `Relooker sa chambre adulte — Idées et méthode` |
| `/idees/deco-salle-a-manger-petite` | "décorer petite salle à manger" | Moyen (500-2k) | Info | Moyen | `Décorer une petite salle à manger` |
| `/idees/amenager-coin-repas-salon` | "coin repas dans le salon" | Moyen (500-2k) | Info | Faible | `Créer un coin repas dans son salon` |

**Structure de contenu commune pour les pages `/idees/` :**
1. Le problème concret (H1 = la situation cible)
2. Les 3 erreurs à éviter
3. La méthode étape par étape
4. Budget indicatif (3 niveaux : serré / confortable / généreux)
5. Idées déco concrètes avec visuels
6. CTA vers quiz (trouver son style avant d'acheter) ou analyse (faire analyser sa pièce)

**Maillage commun :** → `/quiz`, → `/analyse`, → `/blog/` (article satellite associé), → au moins 2 pages `/styles/` pertinentes

---

### 2c. Pages "alternative / conseil"

Ces pages interceptent les requêtes haut du tunnel, des utilisatrices encore en phase de décision.

---

#### `/conseil-decoration-en-ligne`

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "conseil décoration intérieur en ligne" |
| **Volume** | Moyen (500–2 000) |
| **Intention** | Informationnelle + transactionnelle |
| **Difficulté** | Moyen |
| **Title** | `Conseil déco en ligne — Comment ça marche chez Studio Kova` (59 chars) |
| **Meta** | `Quiz gratuit, analyse photo 49€ ou accompagnement sur-mesure : découvrez comment Studio Kova rend le conseil déco accessible.` (125 chars) |
| **Contenu** | Explication du service, comparaison des 3 offres, FAQ (délai, qualité, remboursement), témoignages |
| **CTA** | → `/quiz` (début gratuit), → `/analyse` |
| **Maillage** | → `/quiz`, → `/analyse`, → `/surmesure`, → `/alternative-decorateur-interieur` |

---

#### `/alternative-decorateur-interieur`

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "alternative décorateur intérieur" |
| **Volume** | Faible (<500) — très haute intention d'achat |
| **Intention** | Transactionnelle |
| **Difficulté** | Faible |
| **Title** | `Alternative au décorateur d'intérieur — Studio Kova` (52 chars) |
| **Meta** | `Pas 500€/h de décorateur. Studio Kova propose un conseil déco personnalisé en ligne dès 49€. Palette, meubles et PDF livré en 48h.` (131 chars) |
| **Contenu** | Tableau comparatif (décorateur classique vs Studio Kova), prix, délai, qualité, cas d'usage |
| **CTA** | → `/analyse`, → `/surmesure` |
| **Maillage** | → `/analyse`, → `/surmesure`, → `/conseil-decoration-en-ligne`, → `/blog/faire-appel-decorateur-interieur` |

---

#### `/coach-deco-en-ligne`

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "coach déco en ligne" |
| **Volume** | Faible (<500) |
| **Intention** | Transactionnelle |
| **Difficulté** | Faible |
| **Title** | `Coach déco en ligne — Studio Kova` (34 chars) |
| **Meta** | `Un coaching déco personnalisé depuis chez vous : quiz de style, analyse photo ou accompagnement complet. Studio Kova, conseil déco accessible.` (141 chars) |
| **Contenu** | Présentation du positionnement "coach vs décorateur", méthode, ce que vous obtenez, profil Clémence |
| **CTA** | → `/quiz`, → `/analyse` |
| **Maillage** | → `/quiz`, → `/analyse`, → `/surmesure`, → `/conseil-decoration-en-ligne` |

---

#### `/decoration-appartement-sans-architecte`

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "décoration appartement sans architecte" |
| **Volume** | Faible (<500) |
| **Intention** | Informationnelle / transactionnelle |
| **Difficulté** | Faible |
| **Title** | `Décorer son appartement sans architecte` (39 chars) |
| **Meta** | `Vous n'avez pas besoin d'un architecte pour avoir un bel intérieur. Découvrez comment Studio Kova rend ça possible, dès 49€.` (124 chars) |
| **Maillage** | → `/quiz`, → `/analyse`, → `/alternative-decorateur-interieur` |

---

#### `/comment-trouver-son-style-interieur` _(page landing + pilier blog)_

| Paramètre | Valeur |
|-----------|--------|
| **Mot-clé principal** | "comment trouver son style déco" |
| **Volume** | Fort (2 000–5 000) |
| **Intention** | Informationnelle |
| **Difficulté** | Difficile |
| **Title** | `Comment trouver son style déco — Guide complet` (47 chars) |
| **Meta** | `Scandinave, wabi-sabi, coloré assumé… comment identifier votre style déco ? Méthode complète + quiz gratuit pour trouver le vôtre.` (131 chars) |
| **Contenu** | Guide 1500 mots + quiz en fin de page + mini-présentation des 12 profils |
| **CTA** | → `/quiz` (fort, en milieu et fin de page) |
| **Maillage** | → `/quiz`, → tous les `/styles/[slug]`, → `/blog/comment-trouver-son-style-deco` |

---

### 2d. SEO local — Évaluation et recommandation

**Recommandation : ne pas investir dans le SEO local à ce stade.**

**Raisons :**
1. **Modèle 100% en ligne** — Studio Kova ne reçoit pas de clients physiquement. L'argument "local" est artifice.
2. **Loir-et-Cher : volume quasi nul** — le département compte ~330k habitants, dont une fraction est la cible. Les requêtes "décorateur loir-et-cher" ou "déco blois" génèrent probablement <50 recherches/mois.
3. **La cible est nationale, voire parisienne** — les primo-accédantes et locataires budget moyen en quête de conseil déco accessible sont concentrées dans les grandes villes (Paris, Lyon, Bordeaux, Lille).
4. **Risque de positionnement** — apparaître comme "décoratrice locale à Loir-et-Cher" diluerait le positionnement "accessible en ligne, partout en France".
5. **Google Business Profile** : à créer malgré tout pour la crédibilité (avis Google) mais sans optimisation SEO locale poussée.

**Exception possible à 12 mois :** Si Studio Kova développe des ateliers en présentiel ou des partenariats locaux, une page `/decoratrice-blois` pourrait faire sens — mais uniquement si le trafic national est déjà établi.

---

## Niveau 3 — Blog : architecture topic cluster

Le blog `/blog/` existe dans le code. L'architecture recommandée : 4 piliers + 32 articles satellites sur 12 mois.

---

### Pilier 1 — "Comment trouver son style déco"

| Paramètre | Valeur |
|-----------|--------|
| **URL** | `/blog/comment-trouver-son-style-deco` |
| **Mot-clé principal** | "comment trouver son style déco" |
| **Volume** | Fort (2 000–5 000 / mois) |
| **Difficulté** | Difficile |
| **Objectif** | Capturer le haut du tunnel → convertir vers `/quiz` |
| **Longueur** | 2 500–3 000 mots |

**Plan de l'article :**
- H1 : Comment trouver son style déco — méthode complète
- H2 : Le style déco, c'est quoi exactement ?
- H2 : Pourquoi c'est difficile de se définir
  - H3 : Le piège du "j'aime tout"
  - H3 : Pinterest vs votre vrai style de vie
- H2 : Les 5 étapes pour identifier son style
  - H3 : 1. Observer ses espaces favoris (pas Pinterest)
  - H3 : 2. Identifier 3 mots qui décrivent l'ambiance que vous voulez
  - H3 : 3. Regarder ses propres achats, pas ses wishlist
  - H3 : 4. Identifier la couleur dominante vers laquelle vous revenez toujours
  - H3 : 5. Tester avec un quiz structuré
- H2 : Les 12 grands styles déco (mini-présentation des archétypes)
- H2 : Et si j'aime plusieurs styles ? Comment mixer sans fautes
- H2 : Par où commencer concrètement ?
- CTA fort : Quiz Studio Kova (encart)

**Satellites rattachés (6) :**

| URL satellite | Mot-clé | Volume | Priorité |
|---------------|---------|--------|----------|
| `/blog/12-styles-deco-populaires` | "styles déco populaires" | Moyen | M1-M3 |
| `/blog/quiz-style-deco-comment-ca-marche` | "quiz style déco" | Faible | M1-M3 |
| `/blog/scandinave-vs-japandi` | "scandinave vs japandi différence" | Faible | M4-M6 |
| `/blog/comment-melanger-styles-deco` | "mélanger styles déco" | Moyen | M4-M6 |
| `/blog/wabi-sabi-decoration` | "wabi-sabi décoration intérieur" | Moyen | M4-M6 |
| `/blog/deco-dopamine-interieur` | "déco dopamine" | Faible mais viral | M7-M12 |

---

### Pilier 2 — "Décorer son appartement de locataire"

| Paramètre | Valeur |
|-----------|--------|
| **URL** | `/blog/decorer-appartement-locataire` |
| **Mot-clé principal** | "décorer son appartement de locataire" |
| **Volume** | Fort (2 000–5 000 / mois) |
| **Difficulté** | Moyen (moins saturé que les termes génériques) |
| **Objectif** | Capturer la locataire en quête de solutions → convertir vers `/analyse` |
| **Longueur** | 2 500–3 000 mots |

**Plan de l'article :**
- H1 : Décorer son appartement en location — guide complet sans risque
- H2 : Les contraintes du locataire (état des lieux, caution, règles)
- H2 : Ce qu'on peut faire sans autorisation
  - H3 : Accrocher sans percer (rails, strips commandtable)
  - H3 : Textiles comme premier levier (rideaux, tapis, plaids)
  - H3 : Mobilier temporaire et modulable
- H2 : Ce qu'on peut faire avec accord du bailleur
  - H3 : Papier peint repositionnable
  - H3 : Peinture avec remise en état
- H2 : Les 5 changements qui transforment le plus une pièce de location
- H2 : Les achats à éviter (ce que vous n'emporterez pas)
- H2 : Comment créer une identité cohérente malgré les contraintes
- CTA : Quiz gratuit + Analyse photo 49€

**Satellites rattachés (7) :**

| URL satellite | Mot-clé | Volume | Priorité |
|---------------|---------|--------|----------|
| `/blog/deco-sans-percer-les-murs` | "décorer sans percer les murs" | Moyen | M1-M3 |
| `/blog/papier-peint-sans-colle-appartement` | "papier peint sans colle location" | Moyen | M1-M3 |
| `/blog/meubles-que-vous-emportez` | "meubles déco à emporter" | Faible | M4-M6 |
| `/blog/transformer-appartement-sans-travaux` | "transformer appartement sans travaux" | Moyen | M4-M6 |
| `/blog/choisir-son-tapis-guide` | "comment choisir son tapis" | Fort | M4-M6 |
| `/blog/rideaux-transforment-piece` | "choisir ses rideaux appartement" | Moyen | M7-M12 |
| `/blog/plantes-interieur-style-deco` | "plantes d'intérieur déco" | Moyen | M7-M12 |

---

### Pilier 3 — "Faire appel à un décorateur d'intérieur : guide complet"

| Paramètre | Valeur |
|-----------|--------|
| **URL** | `/blog/faire-appel-decorateur-interieur` |
| **Mot-clé principal** | "décorateur d'intérieur" + "faire appel décorateur" |
| **Volume** | Très fort (>10 000 / mois) pour le terme générique |
| **Difficulté** | Très difficile (terme hautement concurrentiel) |
| **Stratégie** | Ranker sur la longue traîne et le cluster — pas directement sur le terme principal |
| **Objectif** | Intercepter les requêtes comparatives, éduquer sur les alternatives → convertir vers `/surmesure` |
| **Longueur** | 3 000–3 500 mots |

**Plan de l'article :**
- H1 : Faire appel à un décorateur d'intérieur — guide complet 2025
- H2 : Décorateur, architecte d'intérieur, coach déco : quelles différences ?
- H2 : Combien ça coûte (fourchettes réalistes, modes de facturation)
  - H3 : Tarif à l'heure (80–200€/h)
  - H3 : Forfait projet (800–3000€+)
  - H3 : Pourcentage du budget travaux
- H2 : Pour quel type de projet ça vaut le coup ?
- H2 : Comment choisir son décorateur (questions à poser)
- H2 : Les alternatives au décorateur classique
  - H3 : Le conseil déco en ligne (Studio Kova)
  - H3 : Les plateformes de mise en relation
  - H3 : Faire soi-même avec des outils
- H2 : Comment préparer son brief déco pour optimiser le budget
- CTA : Voir l'offre sur-mesure Studio Kova

**Satellites rattachés (7) :**

| URL satellite | Mot-clé | Volume | Priorité |
|---------------|---------|--------|----------|
| `/blog/cout-decorateur-interieur` | "prix décorateur intérieur" | Fort | M1-M3 |
| `/blog/architecte-vs-decorateur` | "architecte intérieur vs décorateur" | Moyen | M1-M3 |
| `/blog/preparer-son-brief-deco` | "brief déco comment faire" | Faible | M4-M6 |
| `/blog/decoration-interieur-en-ligne-guide` | "décoration intérieur en ligne" | Moyen | M4-M6 |
| `/blog/moodboard-deco-creer-le-sien` | "créer moodboard déco" | Moyen | M4-M6 |
| `/blog/questions-a-poser-decorateur` | "questions décorateur intérieur" | Faible | M7-M12 |
| `/blog/quand-vaut-il-mieux-un-archi` | "architecte intérieur quand" | Faible | M7-M12 |

---

### Pilier 4 — "Aménager un petit appartement"

| Paramètre | Valeur |
|-----------|--------|
| **URL** | `/blog/amenager-petit-appartement-guide` |
| **Mot-clé principal** | "aménager un petit appartement" |
| **Volume** | Fort (2 000–10 000 / mois) |
| **Difficulté** | Difficile |
| **Objectif** | Attirer la cible vivant en surface réduite → convertir vers `/analyse` ou `/quiz` |
| **Longueur** | 2 500–3 000 mots |

**Plan de l'article :**
- H1 : Aménager un petit appartement — méthode et idées concrètes
- H2 : Le premier réflexe : désencombrer avant de meubler
- H2 : L'erreur de la pièce "tout-en-un" (et comment l'éviter)
- H2 : Les règles d'or de la circulation et des proportions
  - H3 : Hauteur sous plafond vs largeur
  - H3 : La règle des 80cm de circulation
- H2 : Meubles multifonctions — lesquels acheter vraiment
- H2 : Comment agrandir visuellement une pièce (couleurs, miroirs, lumière)
- H2 : Créer des zones dans un espace unique
- H2 : Petit budget vs grand budget : les bons arbitrages
- CTA : Analyse photo 49€ (pour votre pièce spécifique)

**Satellites rattachés (8) :**

| URL satellite | Mot-clé | Volume | Priorité |
|---------------|---------|--------|----------|
| `/blog/meubles-multifonctions-petit-espace` | "meubles multifonctions petit espace" | Moyen | M1-M3 |
| `/blog/couleurs-agrandissent-piece` | "couleurs agrandissent pièce" | Fort | M1-M3 |
| `/blog/miroirs-decoration-guide` | "miroirs décoration intérieur" | Moyen | M1-M3 |
| `/blog/amenager-coin-bureau-petit-espace` | "coin bureau petit espace" | Moyen | M4-M6 |
| `/blog/eclairage-agrandir-piece` | "éclairage pour agrandir pièce" | Moyen | M4-M6 |
| `/blog/organiser-studio-methode` | "organiser son studio" | Moyen | M4-M6 |
| `/blog/rangements-deco-gain-place` | "rangements décoratifs gain de place" | Moyen | M7-M12 |
| `/blog/petite-cuisine-amenagement` | "aménager petite cuisine" | Fort | M7-M12 |

---

### Plan de publication sur 12 mois

**Vague 1 — M1 à M3 : fondations + trafic rapide**
_Priorité : contenus à volume moyen, difficulté faible/moyen, liés directement aux offres_

| Contenu | Type | Difficulté | Impact business |
|---------|------|------------|-----------------|
| Pilier 3 : "Faire appel à un décorateur" | Blog pilier | Très difficile | Fort (surmesure) |
| `/blog/cout-decorateur-interieur` | Satellite P3 | Moyen | Fort |
| `/blog/architecte-vs-decorateur` | Satellite P3 | Moyen | Fort |
| `/blog/deco-sans-percer-les-murs` | Satellite P2 | Faible | Moyen |
| `/blog/meubles-multifonctions-petit-espace` | Satellite P4 | Moyen | Moyen |
| `/blog/couleurs-agrandissent-piece` | Satellite P4 | Moyen | Moyen |
| `/blog/miroirs-decoration-guide` | Satellite P4 | Faible | Faible |
| Pages `/styles/` × 4 (scandinave, wabi-sabi, terracotta, jungle) | Landing SEO | Faible/Moyen | Fort (quiz) |

**Vague 2 — M4 à M6 : montée en puissance**
_Priorité : piliers à fort volume, pages idées, satellites complémentaires_

| Contenu | Type | Difficulté | Impact business |
|---------|------|------------|-----------------|
| Pilier 1 : "Comment trouver son style déco" | Blog pilier | Difficile | Fort (quiz) |
| Pilier 2 : "Décorer son appartement de locataire" | Blog pilier | Moyen | Fort (analyse) |
| `/blog/12-styles-deco-populaires` | Satellite P1 | Moyen | Fort (quiz) |
| `/blog/papier-peint-sans-colle-appartement` | Satellite P2 | Faible | Moyen |
| `/blog/wabi-sabi-decoration` | Satellite P1 | Faible | Moyen |
| `/blog/moodboard-deco-creer-le-sien` | Satellite P3 | Moyen | Moyen |
| Pages `/styles/` × 4 (vert nature, vintage, bleu nuit, coloré) | Landing SEO | Faible | Fort |
| Pages `/idees/` × 4 (relooker salon, premier appart, studio, entrée) | Landing SEO | Moyen | Fort |

**Vague 3 — M7 à M12 : consolidation + longue traîne**
_Priorité : compléter les clusters, attaquer la longue traîne, satelliser_

| Contenu | Type | Difficulté | Impact business |
|---------|------|------------|-----------------|
| Pilier 4 : "Aménager un petit appartement" | Blog pilier | Difficile | Fort (analyse) |
| Pages `/styles/` × 4 restantes | Landing SEO | Faible | Moyen |
| Pages `/idees/` × 4 restantes | Landing SEO | Moyen | Moyen |
| Pages alternatives (`/conseil-decoration-en-ligne`, etc.) | Landing SEO | Moyen | Fort |
| Satellites restants (tous piliers) | Blog | Variable | Variable |
| `/comment-trouver-son-style-interieur` (landing) | Landing SEO | Difficile | Fort (quiz) |

---

## Récapitulatif maillage interne — flux de conversion

```
Haut du tunnel (blog / pages style / pages idées)
        ↓
/quiz (capture email + profil)
        ↓
/analyse (49€ — si budget pièce <1500€)
        ↓ (upsell ou parcours direct)
/surmesure (299€+)
        ↓
/premium/brief → /premium/merci
```

**Règle de maillage :** Chaque page doit pointer vers au minimum :
- 1 page d'offre (quiz, analyse ou surmesure selon le stade de l'intention)
- 2 pages de même niveau ou de niveau adjacent (styles ↔ idées ↔ blog)
- 1 retour vers la homepage ou le blog si page terminale

---

## Notes techniques complémentaires

### Sitemap XML
Utiliser le mécanisme natif Next.js 13+ (`app/sitemap.ts`) — génère automatiquement le sitemap depuis les routes. Exclure : `/admin/*`, `/api/*`, `/analyse/merci`, `/premium/brief`, `/premium/merci`, `/offre-premium/*`.

### robots.txt (améliorations)
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

### OG images manquantes
Le `layout.js` référence `/og-image.webp` qui n'existe pas encore. Priorité : créer cette image (1200×630px) + une version dédiée pour `/quiz`, `/analyse` et `/surmesure`.

### Schema.org — implémentation recommandée

**`layout.js` (global) :**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Studio Kova",
  "url": "https://www.studiokova.fr",
  "logo": "https://www.studiokova.fr/logo-fond-vert.svg",
  "email": "hello@studiokova.fr",
  "description": "Conseil en décoration intérieure personnalisé et accessible en ligne.",
  "serviceArea": { "@type": "Country", "name": "France" }
}
```

**`/analyse` :**
```json
{
  "@type": "Product",
  "name": "Analyse photo de pièce",
  "description": "Analyse personnalisée de votre pièce par une décoratrice, livrée en 48h en PDF.",
  "offers": {
    "@type": "Offer",
    "price": "49",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  }
}
```

**`/surmesure` :**
```json
{
  "@type": "Service",
  "name": "Décoration sur-mesure en ligne",
  "description": "Sélection meubles, planche produits et liens d'achat personnalisés.",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "230",
    "priceCurrency": "EUR"
  }
}
```

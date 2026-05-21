export const salonData = {
  slug: 'salon',

  meta: {
    title: "Décorer son salon : analyse IA + plan d'action en 48h | Studio Kova",
    description: "Envoyez 3 photos de votre salon, recevez en 48h un diagnostic complet et un plan d'action concret. Couleurs, circulation, agencement. Dès 69€.",
    ogImage: '/og/piece-salon.jpg',
  },

  hero: {
    h1: 'Décorer votre salon',
    subtitle: "Envoyez 3 photos. Recevez en 48h un diagnostic complet et un plan d'action concret pour transformer votre salon.",
    image: '/ok/B.webp',
    ctaPrimary: { label: 'Analyser mon salon — 69€', href: '/analyse?piece=salon' },
    ctaSecondary: { label: "Faire le quiz d'abord", href: '/quiz' },
  },

  enjeux: {
    title: "Les enjeux d'un salon qui fonctionne vraiment",
    body: `Le salon, c'est la pièce qui se voit. Celle où on reçoit, où on travaille parfois, où on regarde un film, où on lit. Plusieurs usages dans un seul lieu, et c'est ce qui le rend difficile à décorer : il faut qu'il fonctionne pour tous ces moments.

Le premier enjeu, c'est l'équilibre des assises. Trop de canapé tue la convivialité. Pas assez et chaque visite devient gênante. La règle qu'on oublie souvent : tout le monde doit pouvoir se parler sans tourner la tête à 90°.

Le deuxième, c'est la lumière. Un salon a besoin de trois sources lumineuses minimum (plafond, lampe d'appoint, ambiance). Et chacune doit pouvoir se moduler selon l'heure et l'usage. Une suspension plein écrasement à 21h ruine n'importe quel salon.

Le troisième enjeu, c'est l'ancrage au sol. Un tapis bien dimensionné transforme l'espace. Trop petit, il fait l'effet inverse et morcelle visuellement. C'est l'erreur la plus fréquente, et la plus simple à corriger.`,
  },

  analyse: {
    title: "Ce que l'analyse IA examine dans votre salon",
    points: [
      "L'agencement des assises et la fluidité de circulation",
      "L'équilibre entre zones d'usage (TV, lecture, réception)",
      "Les sources lumineuses et leur complémentarité",
      "L'harmonie des couleurs et matières",
      'Le tapis, son dimensionnement et son rôle structurant',
      "Les rangements visibles et leur impact sur l'ambiance",
    ],
  },

  faqTitle: 'Vos questions sur la déco de salon',
  faq: [
    {
      q: 'Comment disposer son canapé dans un petit salon ?',
      a: "La règle : ne jamais coller un canapé contre tous les murs disponibles. Préférez un placement où il « flotte » légèrement, même de 20cm, ou en angle avec un fauteuil d'appoint. Cela crée l'illusion d'un espace plus grand. L'analyse vous propose un plan d'agencement adapté à votre configuration réelle.",
    },
    {
      q: 'Quelles couleurs pour un salon lumineux ?',
      a: "Si votre salon manque de lumière naturelle, évitez le piège du blanc pur qui rend l'espace froid et clinique. Préférez des blancs cassés (lin, ivoire), associés à une couleur d'accent chaude sur un mur (terracotta léger, vert sauge, beige doré). L'analyse identifie votre exposition et propose la palette adaptée.",
    },
    {
      q: 'Tapis dans un salon : quelles dimensions ?',
      a: "Règle simple : tous les pieds avant du canapé doivent reposer sur le tapis. Idéalement, le tapis fait 30 à 50cm de plus que la largeur du canapé. Un tapis trop petit fait l'effet « timbre poste » et fragmente visuellement la pièce.",
    },
    {
      q: 'Mon salon est en open space avec la cuisine, comment le délimiter ?',
      a: "Trois leviers efficaces : le tapis (zone visuelle), l'éclairage (suspensions différenciées au-dessus de chaque zone), et un meuble bas semi-séparateur (console, banquette basse). L'analyse identifie le levier le plus adapté à votre configuration.",
    },
    {
      q: 'Quel budget pour rafraîchir un salon ?',
      a: "Un salon rafraîchi sans changement de mobilier : 300 à 600€ (peinture, textiles, éclairage, déco). Un salon transformé : 1500 à 4000€ selon le mobilier. L'analyse vous donne des priorités chiffrées pour arbitrer.",
    },
  ],

  ctaFinal: {
    title: 'Prête à transformer votre salon ?',
    ctaPrimary: { label: 'Analyser mon salon — 69€', href: '/analyse?piece=salon' },
    ctaSecondary: { label: "Voir l'aménagement clé en main", href: '/surmesure' },
  },
};

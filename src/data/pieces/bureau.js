export const bureauData = {
  slug: 'bureau',

  meta: {
    title: "Aménager son bureau à la maison : analyse IA + plan d'action en 48h | Studio Kova",
    description: "Envoyez 3 photos de votre bureau, recevez en 48h un diagnostic complet et un plan d'action concret. Ergonomie, lumière, concentration. Dès 69€.",
    ogImage: '/og/piece-bureau.jpg',
  },

  hero: {
    h1: 'Aménager votre bureau à la maison',
    subtitle: "Envoyez 3 photos. Recevez en 48h un diagnostic complet et un plan d'action concret pour transformer votre espace de travail.",
    image: '/images/pieces/office.webp',
    ctaPrimary: { label: 'Analyser mon bureau - 69€', href: '/analyse?piece=bureau' },
    ctaSecondary: { label: "Faire le quiz d'abord", href: '/quiz' },
  },

  enjeux: {
    title: 'Le bureau à la maison, entre productivité et bien-être',
    body: `Le télétravail a transformé le rôle du bureau. Avant, c'était une pièce d'appoint, parfois un coin négligé. Aujourd'hui, c'est un lieu où on passe 6 à 8 heures par jour, et qui doit fonctionner sans nuire au reste de la vie.

Le premier enjeu, c'est la séparation visuelle. Que vous ayez une pièce dédiée ou un coin dans le salon, il faut que le bureau « existe » comme zone à part. Sinon, le travail déborde et la maison ne se repose jamais.

Le second, c'est la lumière. Un bureau mal éclairé fatigue les yeux, fait baisser la concentration, et donne mauvaise mine en visio. Idéalement, la lumière naturelle vient de côté (pas de face, pas de dos). À défaut, une bonne lampe d'architecte fait des miracles.

Le troisième enjeu, c'est l'ergonomie du regard. Ce que vous voyez quand vous levez les yeux de l'écran. Un mur vide démoralise. Un mur trop chargé déconcentre. L'équilibre se trouve dans 2-3 éléments visuels soigneusement choisis : une plante, un cadre, une étagère sobre.

Et si possible, gardez en tête que ce bureau doit aussi pouvoir disparaître. Le soir, le week-end, ne pas voir son ordinateur portable change la qualité du repos.`,
  },

  analyse: {
    title: "Ce que l'analyse IA examine dans votre bureau",
    points: [
      'La position du bureau par rapport à la lumière naturelle',
      "L'ergonomie de l'assise et la hauteur du plan de travail",
      'La séparation visuelle avec le reste de la pièce (si bureau dans salon ou chambre)',
      'Les éléments dans le champ de vision (mur, étagère, plante)',
      "L'organisation des câbles et du matériel",
      'La possibilité de « fermer » la zone de travail le soir',
    ],
  },

  faqTitle: "Vos questions sur l'aménagement d'un bureau",
  faq: [
    {
      q: "Comment installer un bureau dans un petit appartement ?",
      a: "Trois pistes : un secrétaire mural qui se ferme (gain de place visuel énorme), un coin dans une chambre avec séparation visuelle (paravent, bibliothèque), ou un bureau intégré dans le salon avec une zone clairement délimitée par un tapis ou une couleur de mur. L'analyse identifie la meilleure option chez vous.",
    },
    {
      q: 'Quelles couleurs favorisent la concentration ?',
      a: "Le vert (toutes nuances désaturées) est scientifiquement le plus apaisant pour le travail prolongé. Le bleu doux fonctionne aussi très bien. À éviter en grandes surfaces : le rouge, l'orange vif, le jaune saturé, qui stimulent trop et fatiguent. L'analyse propose une palette compatible avec votre lumière naturelle.",
    },
    {
      q: 'Bureau ou chambre, où vaut-il mieux travailler ?',
      a: "Mieux vaut éviter la chambre si vous avez le choix : mélanger travail et sommeil dégrade les deux. Si pas le choix, créez une vraie séparation visuelle (paravent, rideau, bibliothèque) et masquez l'ordinateur portable le soir. Le cerveau associe l'environnement à l'activité.",
    },
    {
      q: 'Quel budget pour aménager un bureau à la maison ?',
      a: "Un bureau correct : 200 à 400€ (plan de travail + tréteaux ou bureau IKEA basique, bonne chaise d'occasion, lampe). Un bureau soigné : 600 à 1500€ (bureau qualité, chaise ergonomique neuve, éclairage et déco). La chaise est le poste le plus important : c'est elle qui fait la santé du dos.",
    },
    {
      q: 'Comment décorer un bureau sans le surcharger ?',
      a: "La règle des 3 : maximum 3 éléments visuels au-dessus du bureau (une plante, un cadre, une étagère). Au-delà, ça déconcentre. Et privilégier les rangements fermés : tout ce qui est visible doit avoir été choisi, pas accumulé par défaut.",
    },
  ],

  ctaFinal: {
    title: 'Prête à transformer votre bureau ?',
    ctaPrimary: { label: 'Analyser mon bureau - 69€', href: '/analyse?piece=bureau' },
    ctaSecondary: { label: "Voir l'aménagement clé en main", href: '/surmesure' },
  },
};

export const cuisineData = {
  slug: 'cuisine',

  meta: {
    title: "Décorer sa cuisine : analyse IA + plan d'action en 48h | Studio Kova",
    description: "Envoyez 3 photos de votre cuisine, recevez en 48h un diagnostic complet et un plan d'action concret. Couleurs, plan de travail, ambiance. Dès 69€.",
    ogImage: '/og/piece-cuisine.jpg',
  },

  hero: {
    h1: 'Décorer votre cuisine',
    subtitle: "Envoyez 3 photos. Recevez en 48h un diagnostic complet et un plan d'action concret pour transformer votre cuisine.",
    image: '/ok/window.webp',
    ctaPrimary: { label: 'Analyser ma cuisine — 69€', href: '/analyse?piece=cuisine' },
    ctaSecondary: { label: "Faire le quiz d'abord", href: '/quiz' },
  },

  enjeux: {
    title: 'La cuisine, entre fonction et plaisir',
    body: `La cuisine n'est plus un simple lieu de cuisson. Elle est devenue le centre de gravité de l'appartement : on y cuisine, on y mange, on y travaille, on y discute. Et plus elle est ouverte sur le salon, plus elle se doit d'être aussi belle qu'efficace.

Le premier enjeu, c'est l'ergonomie du plan de travail. La règle du triangle (évier, plaque, frigo) doit être tenue, sinon cuisiner devient pénible. Le second, c'est le rangement : une cuisine encombrée perd 80% de son potentiel visuel. Le troisième, c'est l'ambiance, qui se joue surtout sur trois éléments : la crédence, l'éclairage et la touche de couleur ou de matière qui personnalise.

Beaucoup de cuisines sont fonctionnelles mais ternes. La transformation passe rarement par un changement de meuble. Plus souvent par une crédence repensée, un éclairage retravaillé, et trois ou quatre choix d'accessoires qui font basculer l'ensemble.

Et si vous êtes en location avec une cuisine équipée qui ne vous plaît pas, sachez qu'il existe des solutions : adhésifs imitation matière, peinture spéciale meuble cuisine, poignées à changer. Pas idéal, mais transformant pour quelques dizaines d'euros.`,
  },

  analyse: {
    title: "Ce que l'analyse IA examine dans votre cuisine",
    points: [
      "L'ergonomie du plan de travail et de la circulation",
      "Le rangement visible et l'impact sur l'ambiance",
      "L'harmonie crédence / plan de travail / meubles",
      "L'éclairage fonctionnel et l'éclairage d'ambiance",
      "Les zones de personnalisation possible (étagères ouvertes, accessoires)",
      'La cohérence avec le salon si la cuisine est ouverte',
    ],
  },

  faqTitle: 'Vos questions sur la déco de cuisine',
  faq: [
    {
      q: 'Comment redonner du peps à une cuisine qui me lasse ?',
      a: "Trois leviers à fort impact : changer la crédence (carrelage adhésif si location, vrai carrelage si propriétaire), repeindre les portes de meubles (peinture meuble cuisine, en mat ou satiné), ajouter une étagère ouverte avec 3-4 objets sélectionnés. L'analyse identifie le levier qui change le plus l'ambiance chez vous.",
    },
    {
      q: 'Quelles couleurs pour une cuisine accueillante ?',
      a: "Évitez le tout blanc qui fatigue à la longue. Les combinaisons qui marchent : blanc + bois clair + une couleur d'accent (vert sauge, terracotta, bleu pétrole) sur la crédence ou un mur. Le noir mat sur les meubles fonctionne aussi très bien s'il est compensé par un plan de travail clair.",
    },
    {
      q: 'Comment décorer une cuisine ouverte sur le salon ?',
      a: "Deux principes : assurer la continuité visuelle (palette qui dialogue, pas qui s'oppose) tout en marquant une légère délimitation (suspension différente, tapis sous la table à manger). Le piège : faire deux pièces totalement différentes côte à côte, ça fragmente l'espace.",
    },
    {
      q: "Que faire d'une cuisine de location qui ne me plaît pas ?",
      a: "Trois interventions réversibles : adhésifs sur les portes de meubles ou la crédence (qualité industrielle, ça tient des années), nouveaux boutons de tiroirs et poignées (effet immédiat), accessoires apparents soignés (bocaux en verre, planches en bois, torchons unis). Avec moins de 100€, vous changez l'ambiance.",
    },
    {
      q: 'Plantes dans la cuisine : oui ou non ?',
      a: "Oui, mais en mode sélectif. Les aromatiques (basilic, ciboulette, menthe) sur le rebord de fenêtre apportent une touche vivante et sont utiles. Pour le décoratif, préférez une grande plante structurante (pothos qui retombe, monstera) plutôt que plusieurs petites éparpillées qui font encombré.",
    },
  ],

  ctaFinal: {
    title: 'Prête à transformer votre cuisine ?',
    ctaPrimary: { label: 'Analyser ma cuisine — 69€', href: '/analyse?piece=cuisine' },
    ctaSecondary: { label: "Voir l'aménagement clé en main", href: '/surmesure' },
  },
};

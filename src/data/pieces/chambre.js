export const chambreData = {
  slug: 'chambre',

  meta: {
    title: "Décorer sa chambre : analyse IA + plan d'action en 48h | Studio Kova",
    description: "Envoyez 3 photos de votre chambre, recevez en 48h un diagnostic complet et un plan d'action concret. Couleurs, lumière, agencement. Dès 69€.",
    ogImage: '/og/piece-chambre.jpg',
  },

  hero: {
    h1: 'Décorer votre chambre',
    subtitle: "Envoyez 3 photos. Recevez en 48h un diagnostic complet et un plan d'action concret pour transformer votre chambre.",
    image: '/images/pieces/bedroom.webp',
    ctaPrimary: { label: 'Analyser ma chambre - 69€', href: '/analyse?piece=chambre' },
    ctaSecondary: { label: "Faire le quiz d'abord", href: '/quiz' },
  },

  enjeux: {
    title: "Les enjeux d'une chambre réussie",
    body: `La chambre est la pièce du repos. C'est aussi celle où on passe le plus de temps en réalité : huit heures par nuit, plus les moments de lecture, de pause, de transition. Pourtant, c'est souvent la pièce la moins travaillée.

Trois enjeux s'y croisent en permanence. D'abord les couleurs : trop saturées, elles fatiguent et empêchent de décompresser. Trop fades, la pièce devient impersonnelle. L'équilibre est subtil et dépend de la lumière naturelle dont vous disposez.

Ensuite l'agencement : la position du lit, l'accès au rangement, la circulation autour, la place laissée pour respirer. Une chambre de 12m² bien pensée fait mieux qu'une chambre de 18m² mal organisée.

Enfin l'ambiance : cocoon, minimal, romantique, contemporain - c'est ce qui transforme une pièce fonctionnelle en lieu où on a vraiment envie d'être. Et c'est rarement une question de budget, plutôt de cohérence.`,
  },

  analyse: {
    title: "Ce que l'analyse regarde dans votre chambre",
    points: [
      "L'harmonie des couleurs entre les murs, le linge de lit et le mobilier",
      "Ce qui crée la surcharge, la froideur ou l'impression de pièce impersonnelle",
      "La lumière naturelle de la pièce et la palette qui lui va vraiment",
      "Les surfaces à reprendre en priorité, et avec quelle teinte exacte",
      "Les matières et textiles qui manquent pour réchauffer l'ensemble",
    ],
  },

  faqTitle: 'Vos questions sur la déco de chambre',
  faq: [
    {
      q: 'Quelles couleurs choisir pour favoriser le sommeil ?',
      a: "Les tons doux et désaturés sont les plus apaisants : vert sauge, bleu nuit profond, beige rosé, terracotta atténué. À éviter sur les grands murs : les couleurs très saturées (rouge vif, orange électrique) qui stimulent visuellement. L'analyse vous propose une palette de 3 couleurs adaptée à votre lumière et à votre mobilier existant.",
    },
    {
      q: 'Petite chambre, comment optimiser sans tout casser ?',
      a: "Trois priorités : la verticalité (étagères hautes, rideaux montés au plafond), l'unification visuelle (palette restreinte de 2-3 couleurs maximum) et le rangement caché (sous le lit, derrière des portes pleines). L'analyse identifie les zones où vous gagnez le plus de mètres visuels.",
    },
    {
      q: "Je suis locataire, qu'est-ce que je peux vraiment changer ?",
      a: "Beaucoup plus que vous ne le pensez. La peinture (en cas de départ, repeindre en blanc avant état des lieux), les textiles (rideaux, tapis, linge de lit), l'éclairage (lampes, suspensions sur ampoules connectées), les meubles d'appoint. L'analyse privilégie systématiquement les transformations réversibles.",
    },
    {
      q: 'Quel budget moyen pour redécorer une chambre ?',
      a: "Tout dépend de l'ampleur. Une chambre rafraîchie (peinture + textiles + 2-3 objets) : 200 à 400€. Une chambre transformée avec changement de mobilier : 800 à 2000€. L'analyse vous donne des fourchettes précises par priorité, pour que vous arbitriez vous-même selon votre budget.",
    },
    {
      q: "L'analyse fonctionne-t-elle pour une chambre d'enfant ?",
      a: "Oui, mais précisez-le dans le contexte au moment de l'envoi. Les enjeux sont différents (évolutivité, jeu, sommeil), et les recommandations s'adaptent. Pour une chambre de bébé en revanche, mieux vaut attendre les 2-3 ans pour que les choix décoratifs aient une vraie durée de vie.",
    },
  ],

  ctaFinal: {
    title: 'Prête à transformer votre chambre ?',
    ctaPrimary: { label: 'Analyser ma chambre - 69€', href: '/analyse?piece=chambre' },
    ctaSecondary: { label: "Voir l'aménagement clé en main", href: '/surmesure' },
  },
};

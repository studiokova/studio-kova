export const PIECES = [
  { slug: "chambre",      label: "Chambre",      img: "/A.webp" },
  { slug: "salon",        label: "Salon",         img: "/B.webp" },
  { slug: "salle-de-bain",label: "Salle de bain", img: "/C.webp" },
  { slug: "cuisine",      label: "Cuisine",       img: "/D.webp" },
  { slug: "bureau",       label: "Bureau",        img: "/E.webp" },
  { slug: "entree",       label: "Entrée",        img: "/F.webp" },
];

export const OFFRES = [
  {
    img: "/window.webp",
    badgeText: "Gratuit", badgeClass: "kova-badge--gold",
    price: "Gratuit",
    title: "Quiz de style",
    desc: "Découvrez votre profil déco en 3 minutes. Recevez votre palette de couleurs et 3 actions concrètes.",
    ctaLabel: "Faire le quiz →", ctaHref: "/quiz", ctaVariant: "dark",
    event: "Clic offre gratuite", featured: false,
  },
  {
    img: "/shelves.webp",
    badgeText: "Recommandé", badgeClass: "kova-badge--copper",
    price: "69€",
    title: "Analyse IA + plan d'action en 48h",
    desc: "Envoyez 1 à 3 photos de votre pièce. Recevez en 48h une analyse IA complète : diagnostic, palette, priorités, matières.",
    ctaLabel: "Analyser ma pièce →", ctaHref: "/analyse", ctaVariant: "primary",
    event: "Clic offre 49", featured: true,
  },
  {
    img: "/lamp.webp",
    badgeText: "CLÉ EN MAIN", badgeClass: "kova-badge--dark",
    priceFrom: "à partir de", price: "299€", priceUnit: "/pièce",
    title: "Aménagement clé en main",
    desc: "Je sélectionne chaque meuble pour vous, avec les liens d'achat directs et une planche par pièce. Délai 5 jours.",
    ctaLabel: "Démarrer mon projet →", ctaHref: "/surmesure", ctaVariant: "dark",
    event: "Clic offre 299", featured: false,
  },
];

export const HOW_STEPS = [
  { n: "1", title: "Vous envoyez 1 à 3 photos", desc: "Photos de la pièce à transformer, en lumière naturelle si possible. Aucun matériel spécial requis." },
  { n: "2", title: "L'IA analyse", desc: "L'espace, les couleurs, la lumière, l'agencement. Chaque détail compte pour une recommandation sur mesure." },
  { n: "3", title: "Vous recevez en 48h", desc: "Un PDF avec diagnostic, palette de 3 couleurs, priorités d'action chiffrées, matières conseillées et à éviter." },
];

export const FAQ_ITEMS = [
  { q: "Combien de temps pour recevoir mon analyse ?", a: "48h maximum après réception de vos photos et du paiement." },
  { q: "À qui s'adresse l'analyse ?", a: "À toute personne qui veut transformer sa pièce sans payer un décorateur d'intérieur. Locataires comme propriétaires, petit budget comme budget confortable. L'analyse s'adapte à votre situation, votre mode de vie et ce que vous voulez garder dans la pièce." },
  { q: "L'IA, c'est vraiment fiable pour de la déco ?", a: "L'IA analyse vos photos et propose. Je supervise chaque livrable avant envoi. C'est cette combinaison qui rend l'analyse précise et personnalisée." },
  { q: "Quelle différence avec un décorateur d'intérieur ?", a: "Un décorateur d'intérieur facture 500 à 2000€ par pièce et travaille sur plusieurs semaines. L'analyse Studio Kova livre un plan exécutable en 48h pour 69€. C'est complémentaire, pas le même usage." },
  { q: "Et si l'analyse ne me plaît pas ?", a: "Vous m'écrivez, on ajuste. Si l'analyse ne correspond vraiment pas à votre pièce, je rembourse." },
];

export const REASSURANCE_ITEMS = [
  "Conçu pour les budgets réels (locataires, primo-accédantes)",
  "Pas besoin de tout casser : je travaille avec l'existant",
  "Livré en 48h chrono",
  "Pas de rendez-vous, pas de devis interminable",
];

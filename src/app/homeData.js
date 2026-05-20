export const PIECES = [
  { slug: "chambre",      label: "Chambre",      bg: "linear-gradient(135deg, #3D6B52 0%, #2E4A3A 100%)" },
  { slug: "salon",        label: "Salon",         bg: "linear-gradient(135deg, #B8612A 0%, #2E4A3A 100%)" },
  { slug: "salle-de-bain",label: "Salle de bain", bg: "linear-gradient(135deg, #6B9E7A 0%, #3D6B52 100%)" },
  { slug: "cuisine",      label: "Cuisine",       bg: "linear-gradient(135deg, #E8C97A 0%, #B8612A 100%)" },
  { slug: "bureau",       label: "Bureau",        bg: "linear-gradient(135deg, #2E4A3A 0%, #1a2e25 100%)" },
  { slug: "entree",       label: "Entrée",        bg: "linear-gradient(135deg, #A8CCB8 0%, #3D6B52 100%)" },
];

export const OFFRES = [
  {
    bg: "linear-gradient(135deg, #6B9E7A 0%, #3D6B52 100%)",
    badgeText: "Gratuit", badgeClass: "kova-badge--gold",
    price: "Gratuit",
    title: "Quiz de style",
    desc: "Découvrez votre profil déco en 3 minutes. Recevez votre palette de couleurs et 3 actions concrètes.",
    ctaLabel: "Faire le quiz →", ctaHref: "/quiz", ctaVariant: "dark",
    event: "Clic offre gratuite", featured: false,
  },
  {
    bg: "linear-gradient(135deg, #B8612A 0%, #2E4A3A 100%)",
    badgeText: "Le plus choisi", badgeClass: "kova-badge--copper",
    price: "49€",
    title: "Analyse IA + plan d'action en 48h",
    desc: "Envoyez 1 à 3 photos de votre pièce. Recevez en 48h une analyse IA complète : diagnostic, palette, priorités, matières.",
    ctaLabel: "Analyser ma pièce →", ctaHref: "/analyse", ctaVariant: "primary",
    event: "Clic offre 49", featured: true,
  },
  {
    bg: "linear-gradient(135deg, #2E4A3A 0%, #1a2e25 100%)",
    badgeText: "Sur mesure", badgeClass: "kova-badge--dark",
    priceFrom: "à partir de", price: "299€", priceUnit: "/pièce",
    title: "Aménagement clé en main",
    desc: "On vous sélectionne chaque meuble, avec les liens d'achat directs et une planche par pièce. Délai 5 jours.",
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
  { q: "Combien de temps pour recevoir l'analyse ?", a: "48h maximum après réception de vos photos et du paiement." },
  { q: "Est-ce que ça marche si je suis locataire ?", a: "Oui, c'est même notre cœur de cible. Nos recommandations privilégient les transformations réversibles : peinture, textiles, mobilier, éclairage." },
  { q: "L'IA, c'est fiable pour de la déco ?", a: "L'IA analyse les photos et propose. Un humain (moi) supervise chaque livrable avant envoi. C'est cette combinaison qui rend l'analyse fiable et personnalisée." },
  { q: "Quelle différence avec un décorateur d'intérieur ?", a: "Un décorateur facture 500 à 2 000€ par pièce et travaille sur plusieurs semaines. Studio Kova livre en 48h pour 49€ : c'est complémentaire, pas le même usage." },
  { q: "Et si je ne suis pas satisfaite ?", a: "Vous m'écrivez. On ajuste. Si l'analyse ne correspond vraiment pas à votre pièce, je rembourse." },
];

export const REASSURANCE_ITEMS = [
  "Conçu pour les budgets réels (locataires, primo-accédantes)",
  "Pas besoin de tout casser : on travaille avec l'existant",
  "Livré en 48h chrono",
  "Pas de rendez-vous, pas de devis interminable",
];

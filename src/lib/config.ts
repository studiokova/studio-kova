export const PROMO = {
  active: true,
  price: 48,
  display: '48€',
  originalDisplay: '69€',
  coupon: 'FybqdJQq',
  endLabel: '24 juin',
} as const;

export const ANALYSE_LIVRABLES = [
  "Un diagnostic de votre pièce. Ce qui fonctionne, ce qui crée la gêne que vous ressentez, et pourquoi. Une lecture de vos photos, mur par mur.",
  "Trois directions au choix, du plus sobre au plus affirmé. Chacune avec sa palette précise (références exactes, couleurs à conserver) et ses actions prioritaires.",
  "Chaque action est chiffrée. Quoi faire, dans quel ordre, et combien ça coûte (fourchette par poste). Vous choisissez la direction qui vous parle, votre budget suit.",
  "Les matières à privilégier et à éviter, pour que vos achats restent cohérents.",
];

export const OFFERS = {
  quiz: {
    amount: 0,
    display: "Gratuit",
    stripeId: null as null,
  },
  analyse: {
    amount: 69,
    display: "69€",
    stripeId: process.env.STRIPE_PRICE_ID_ANALYSIS,
  },
  surmesure: {
    amount: 299,
    display: "à partir de 299€",
    stripePerPiece: 299,
    stripePerPieceExtra: 230,
    stripeId: process.env.STRIPE_PRICE_ID_SURMESURE,
  },
};

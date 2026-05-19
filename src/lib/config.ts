export const ANALYSE_LIVRABLES = [
  "Analyse photo de la pièce",
  "Recommandations couleurs et aménagement",
  "PDF complet livré en 48h",
];

export const OFFERS = {
  quiz: {
    amount: 0,
    display: "Gratuit",
    stripeId: null as null,
  },
  analyse: {
    amount: 49,
    display: "49€",
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

import KovaButton from "@/components/kova/KovaButton";

const CTA_MAP = {
  quiz: {
    eyebrow: "Prochaine étape",
    label: "Trouvez votre style en 6 minutes",
    desc: "Répondez au quiz gratuit et recevez votre profil déco, votre palette de couleurs et 3 actions concrètes pour votre pièce.",
    href: "/quiz",
    cta: "Faire le quiz gratuit →",
  },
  analyse: {
    eyebrow: "Passez à l'action",
    label: "Une pièce qui ne fonctionne pas ?",
    desc: "Envoyez des photos. Recevez un diagnostic complet avec palette, priorités et PDF - en 48h.",
    href: "/analyse",
    cta: "Découvrir l'Analyse déco →",
  },
  surmesure: {
    eyebrow: "Passez à l'action",
    label: "Plusieurs pièces à transformer ?",
    desc: "Je vous livre la sélection complète de meubles avec liens d'achat et planche visuelle par pièce.",
    href: "/surmesure",
    cta: "Voir l'offre sur mesure →",
  },
};

export default function KovaArticleCta({ type = "quiz" }) {
  const c = CTA_MAP[type] || CTA_MAP.quiz;
  return (
    <div className="kova-article-cta">
      <p className="kova-article-cta__eyebrow">{c.eyebrow}</p>
      <p className="kova-article-cta__label">{c.label}</p>
      <p className="kova-article-cta__desc">{c.desc}</p>
      <KovaButton variant="primary" href={c.href}>{c.cta}</KovaButton>
    </div>
  );
}

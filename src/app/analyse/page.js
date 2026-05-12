// src/app/analyse/page.js
import ComingSoon from "@/components/ComingSoon";

export const metadata = {
  title: "Je transforme ma pièce — Studio Kova",
};

export default function AnalysePage() {
  return (
    <ComingSoon
      offre="analyse"
      titre="Je transforme ma pièce"
      description="L'analyse IA de votre pièce arrive bientôt. Laissez votre email et je vous préviens en premier."
      couleur="cuivre"
    />
  );
}
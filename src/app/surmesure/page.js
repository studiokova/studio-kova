// src/app/surmesure/page.js
import ComingSoon from "@/components/ComingSoon";

export const metadata = {
  title: "Je vous confie mon intérieur — Studio Kova",
};

export default function SurmesurePage() {
  return (
    <ComingSoon
      offre="surmesure"
      titre="Je vous confie mon intérieur"
      description="La sélection meuble sur mesure arrive bientôt. Laissez votre email et je vous préviens en premier."
      couleur="sauge"
    />
  );
}
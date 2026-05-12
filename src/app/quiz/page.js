// src/app/quiz/page.js
import ComingSoon from "@/components/ComingSoon";

export const metadata = {
  title: "Je trouve mon style — Studio Kova",
};

export default function QuizPage() {
  return (
    <ComingSoon
      offre="quiz"
      titre="Je trouve mon style"
      description="Le quiz de style arrive bientôt. Laissez votre email et je vous préviens en premier."
      couleur="sauge"
    />
  );
}
import Quiz from "@/components/Quiz";

export const metadata = {
  title: "Quiz style déco - Trouvez votre profil en 2 minutes",
  description: "6 questions, 12 profils de style. Recevez votre palette de couleurs et vos premières actions déco par email. Entièrement gratuit.",
  alternates: { canonical: "https://www.studiokova.fr/quiz" },
  openGraph: {
    title: "Quiz style déco - Trouvez votre profil en 2 minutes",
    description: "6 questions, 12 profils de style. Recevez votre palette de couleurs et vos premières actions déco par email.",
    url: "https://www.studiokova.fr/quiz",
    type: "website",
  },
};

export default function QuizPage() {
  return <Quiz />;
}
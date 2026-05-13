import { DM_Sans, Playfair_Display } from "next/font/google";
 
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
});
 
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});
 
export const metadata = {
  title: "Studio Kova · La déco personnalisée, enfin accessible.",
  description: "Conseil en décoration d'appartement personnalisé et accessible. Palette, moodboard et sélection meuble sur mesure.",
  metadataBase: new URL('https://www.studiokova.fr'),
  openGraph: {
    title: "Studio Kova · La déco personnalisée, enfin accessible.",
    description: "Conseil en décoration d'appartement personnalisé et accessible. Palette, moodboard et sélection meuble sur mesure.",
    url: 'https://www.studiokova.fr',
    siteName: 'Studio Kova',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Studio Kova — Conseil en décoration accessible',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Studio Kova · La déco personnalisée, enfin accessible.",
    description: "Conseil en décoration d'appartement personnalisé et accessible.",
    images: ['/og-image.jpg'],
  },
};
 
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* Privacy-friendly analytics by Plausible */}
        <script async src="https://plausible.io/js/pa-VceMkiq3LUFOHHjYXLSCe.js"></script>
        <script dangerouslySetInnerHTML={{__html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}} />
      </head>
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import MetaPixel from "./components/MetaPixel";
import PinterestPixel from "./components/PinterestPixel";
import UtmCapture from "./components/UtmCapture";
import { ConsentProvider } from "./components/ConsentContext";
import ConsentBanner from "./components/ConsentBanner";
import ConsentPreferences from "./components/ConsentPreferences";
import { JsonLd } from "@/components/seo/JsonLd";

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
  title: "Studio Kova, l'analyse IA qui transforme votre pièce en 48h",
  description: "Vous venez d'emménager ? Mon analyse IA transforme votre pièce avec un plan déco concret en 48h, pour 69€. Couleurs, aménagement, matières.",
  metadataBase: new URL('https://www.studiokova.fr'),
  alternates: { canonical: 'https://www.studiokova.fr' },
  openGraph: {
    title: "Studio Kova - Transformez votre pièce en 48h",
    description: "Analyse IA de votre pièce + plan d'action concret livré en 48h. Dès 69€.",
    url: 'https://www.studiokova.fr',
    siteName: 'Studio Kova',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/ok/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Studio Kova - Transformez votre pièce en 48h',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Studio Kova - Transformez votre pièce en 48h",
    description: "Analyse IA de votre pièce + plan d'action concret livré en 48h. Dès 69€.",
    images: ['/ok/og-image.webp'],
  },
  other: {
    'p:domain_verify': 'f96331ede63e06b65df7db56e147db91',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <head>
        {/* Privacy-friendly analytics by Plausible */}
        <script defer data-domain="studiokova.fr" src="https://plausible.io/js/script.manual.revenue.tagged-events.js" />
        <script dangerouslySetInnerHTML={{__html: `window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}`}} />
      </head>
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Studio Kova",
          "url": "https://www.studiokova.fr",
          "logo": "https://www.studiokova.fr/logo-fond-vert.svg",
          "email": "hello@studiokova.fr",
          "description": "Conseil en décoration intérieure personnalisé et accessible en ligne. Quiz gratuit, analyse photo 69€, sur-mesure dès 299€/pièce.",
          "serviceArea": { "@type": "Country", "name": "France" },
          "sameAs": ["https://instagram.com/studiokova.fr"],
        }} />
        <ConsentProvider>
          <MetaPixel />
          <PinterestPixel />
          <UtmCapture />
          {children}
          <ConsentBanner />
          <ConsentPreferences />
        </ConsentProvider>
      </body>
    </html>
  );
}

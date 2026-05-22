import KovaFooter from '@/components/kova/KovaFooter'

export const metadata = {
  title: 'Brief envoyé - Studio Kova',
  robots: { index: false, follow: false },
}

const DiamondIcon = () => (
  <svg viewBox="-14 -14 28 28" width="48" height="48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect transform="translate(0,-8) rotate(45)"  x="-4" y="-4" width="8" height="8" rx="1.5" fill="#B8612A" />
    <rect transform="translate(8,0) rotate(45)"   x="-4" y="-4" width="8" height="8" rx="1.5" fill="#2E4A3A" />
    <rect transform="translate(-8,0) rotate(45)"  x="-4" y="-4" width="8" height="8" rx="1.5" fill="#E8C97A" />
    <rect transform="translate(0,8) rotate(45)"   x="-4" y="-4" width="8" height="8" rx="1.5" fill="#6B9E7A" />
  </svg>
)

export default function PremiumMerciPage() {
  return (
    <>
      <style>{`
        .pm-wrap { min-height: 100vh; background: #F5EFE4; display: flex; flex-direction: column; }
        .pm-main { flex: 1; max-width: 480px; margin: 0 auto; padding: 64px 24px 48px; text-align: center; }
        .pm-icon { display: flex; justify-content: center; margin-bottom: 28px; }
        .pm-title { font-family: "Playfair Display", serif; font-style: italic; font-size: clamp(28px, 6vw, 38px); color: #2E4A3A; line-height: 1.2; margin: 0 0 16px; }
        .pm-sub { font-family: "DM Sans", sans-serif; font-size: 16px; color: #2E4A3A; line-height: 1.7; margin: 0; }
        .pm-sep { border: none; border-top: 1px solid #D3D1C7; margin: 40px 0; }
        .pm-contact { font-family: "DM Sans", sans-serif; font-size: 13px; color: #888780; margin: 0; }
        .pm-contact a { color: #888780; text-decoration: underline; text-underline-offset: 3px; }
      `}</style>

      <div className="pm-wrap">
        <main className="pm-main">
          <div className="pm-icon">
            <DiamondIcon />
          </div>

          <h1 className="pm-title">C'est noté.</h1>
          <p className="pm-sub">
            Je reviens vers vous sous 48h pour confirmer la prise en charge.
            Le moodboard arrive dans la semaine.
          </p>

          <hr className="pm-sep" />

          <p className="pm-contact">
            Une question entre temps ?{' '}
            <a href="mailto:hello@studiokova.fr">hello@studiokova.fr</a>
          </p>
        </main>

        <KovaFooter />
      </div>
    </>
  )
}

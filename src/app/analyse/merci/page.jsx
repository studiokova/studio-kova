import { Suspense } from 'react'
import KovaFooter from '@/components/kova/KovaFooter'
import { ANALYSE_LIVRABLES } from '@/lib/config'
import MerciTracker from './MerciTracker'

export const metadata = {
  title: 'Analyse lancée - Studio Kova',
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


export default function MerciPage() {
  return (
    <>
      <style>{`
        .mc-wrap { min-height: 100vh; background: #F5EFE4; display: flex; flex-direction: column; }
        .mc-main { flex: 1; max-width: 480px; margin: 0 auto; padding: 48px 24px; text-align: center; }
        .mc-icon { display: flex; justify-content: center; margin-bottom: 28px; }
        .mc-title { font-family: "Playfair Display", serif; font-style: italic; font-size: clamp(26px, 6vw, 36px); color: #2E4A3A; line-height: 1.2; margin: 0 0 12px; }
        .mc-sub { font-family: "DM Sans", sans-serif; font-size: 16px; color: #2E4A3A; line-height: 1.6; margin: 0; }
        .mc-sep { border: none; border-top: 1px solid #D3D1C7; margin: 32px 0; }
        .mc-block-label { font-family: "DM Sans", sans-serif; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.10em; color: #888780; margin-bottom: 16px; }
        .mc-list { list-style: none; padding: 0; margin: 0; text-align: left; display: flex; flex-direction: column; gap: 12px; }
        .mc-item { display: flex; align-items: flex-start; gap: 10px; font-family: "DM Sans", sans-serif; font-size: 15px; color: #2E4A3A; line-height: 1.5; }
        .mc-check { color: #B8612A; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
        .mc-contact { font-family: "DM Sans", sans-serif; font-size: 13px; color: #888780; margin: 0; }
        .mc-contact a { color: #888780; text-decoration: underline; text-underline-offset: 3px; }
        .mc-cta { display: inline-block; margin-top: 28px; padding: 16px 32px; background: #2E4A3A; color: #F5EFE4; border-radius: 999px; font-family: "DM Sans", sans-serif; font-size: 15px; font-weight: 500; text-decoration: none; transition: opacity 0.18s; }
        .mc-cta:hover { opacity: 0.88; }
      `}</style>

      <Suspense fallback={null}>
        <MerciTracker />
      </Suspense>

      <div className="mc-wrap">
        <main className="mc-main">
          <div className="mc-icon">
            <DiamondIcon />
          </div>

          <h1 className="mc-title">Votre analyse est lancée.</h1>
          <p className="mc-sub">Je l'analyse et vous envoie votre PDF sous 48h.</p>

          <hr className="mc-sep" />

          <p className="mc-block-label">Ce qui arrive dans votre boîte mail</p>
          <ul className="mc-list">
            {ANALYSE_LIVRABLES.map(item => (
              <li key={item} className="mc-item">
                <span className="mc-check">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <hr className="mc-sep" />

          <p className="mc-contact">
            Une question ?{' '}
            <a href="mailto:hello@studiokova.fr">hello@studiokova.fr</a>
          </p>

          <a href="/" className="mc-cta">← Retour à l'accueil</a>
        </main>

        <KovaFooter />
      </div>
    </>
  )
}

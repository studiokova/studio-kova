'use client';
import { useState, useEffect } from 'react';
import { useConsent } from './ConsentContext';

const CSS = `
  .cb-banner {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: #FDFAF6;
    border-top: 1px solid #D3D1C7;
    box-shadow: 0 -4px 24px rgba(0,0,0,0.07);
    z-index: 9999;
    font-family: var(--font-dm-sans, "DM Sans", sans-serif);
  }
  .cb-inner {
    max-width: 960px; margin: 0 auto;
    padding: 20px 24px;
    display: flex; align-items: center; gap: 24px;
  }
  .cb-text {
    flex: 1;
    font-size: 14px; color: #2E4A3A; line-height: 1.6; margin: 0;
  }
  .cb-actions {
    display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0;
  }
  .cb-btn-row { display: flex; gap: 10px; }
  .cb-reject {
    padding: 10px 20px;
    border: 1.5px solid #D3D1C7; border-radius: 10px;
    background: transparent; color: #888780;
    font-size: 14px; font-family: inherit;
    cursor: pointer; white-space: nowrap;
    transition: border-color 0.18s, color 0.18s;
  }
  .cb-reject:hover { border-color: #888780; color: #2E4A3A; }
  .cb-accept {
    padding: 10px 20px;
    border: none; border-radius: 10px;
    background: #2E4A3A; color: #F5EFE4;
    font-size: 14px; font-weight: 500; font-family: inherit;
    cursor: pointer; white-space: nowrap;
    transition: opacity 0.18s;
  }
  .cb-accept:hover { opacity: 0.88; }
  .cb-more {
    font-size: 12px; color: #888780;
    text-decoration: underline; text-underline-offset: 3px;
    text-decoration-color: #D3D1C7;
  }
  .cb-more:hover { color: #2E4A3A; text-decoration-color: #888780; }
  @media (max-width: 640px) {
    .cb-inner { flex-direction: column; align-items: stretch; gap: 16px; }
    .cb-actions { align-items: stretch; }
    .cb-btn-row { flex-direction: column; }
    .cb-reject, .cb-accept { text-align: center; }
  }
`;

export default function ConsentBanner() {
  const { consent, acceptAll, rejectAll } = useConsent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Don't render until mounted (avoids flash for users with stored consent)
  if (!mounted || consent !== null) return null;

  return (
    <>
      <style>{CSS}</style>
      <div className="cb-banner" role="region" aria-label="Gestion des cookies">
        <div className="cb-inner">
          <p className="cb-text">
            J&apos;utilise des cookies pour mesurer l&apos;audience de mon site et améliorer mon
            contenu publicitaire. Vous pouvez accepter ou refuser à tout moment.
          </p>
          <div className="cb-actions">
            <div className="cb-btn-row">
              <button className="cb-reject" onClick={rejectAll}>Refuser</button>
              <button className="cb-accept" onClick={acceptAll}>Accepter</button>
            </div>
            <a href="/confidentialite" className="cb-more">En savoir plus</a>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useConsent } from './ConsentContext';

const CSS = `
  .cp-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.28);
    z-index: 10000;
    animation: cp-fade-in 0.18s ease;
  }
  .cp-panel {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    background: #FDFAF6;
    border-radius: 14px;
    padding: 28px;
    width: calc(100% - 48px);
    max-width: 400px;
    z-index: 10001;
    box-shadow: 0 8px 40px rgba(0,0,0,0.13);
    font-family: var(--font-dm-sans, "DM Sans", sans-serif);
    animation: cp-slide-up 0.2s ease;
  }
  @keyframes cp-fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes cp-slide-up { from { transform: translate(-50%, calc(-50% + 10px)); opacity: 0; } to { transform: translate(-50%, -50%); opacity: 1; } }
  .cp-close {
    position: absolute; top: 14px; right: 14px;
    background: none; border: none; padding: 6px 8px;
    font-size: 18px; line-height: 1; cursor: pointer; color: #888780;
    border-radius: 6px; transition: color 0.15s, background 0.15s;
  }
  .cp-close:hover { color: #2E4A3A; background: rgba(0,0,0,0.05); }
  .cp-title {
    font-family: "Playfair Display", serif;
    font-size: 20px; font-weight: 400;
    color: #2E4A3A; margin: 0 0 24px;
    padding-right: 28px; line-height: 1.25;
  }
  .cp-row {
    display: flex; align-items: flex-start; gap: 16px;
    padding: 16px 0;
    border-top: 1px solid #E8E4DC;
    border-bottom: 1px solid #E8E4DC;
  }
  .cp-row-info { flex: 1; }
  .cp-row-label {
    font-size: 14px; font-weight: 500; color: #2E4A3A; margin: 0 0 5px;
  }
  .cp-row-desc {
    font-size: 13px; color: #888780; line-height: 1.55; margin: 0;
  }
  /* Toggle switch (iOS-style) */
  .cp-toggle {
    flex-shrink: 0; margin-top: 2px;
    width: 44px; height: 24px; border-radius: 999px;
    background: #D3D1C7; border: none; cursor: pointer; padding: 0;
    position: relative; transition: background 0.22s;
  }
  .cp-toggle--on { background: #3D6B52; }
  .cp-toggle-knob {
    display: block;
    position: absolute; top: 3px; left: 3px;
    width: 18px; height: 18px; border-radius: 50%;
    background: white; box-shadow: 0 1px 4px rgba(0,0,0,0.20);
    transition: transform 0.22s;
    pointer-events: none;
  }
  .cp-toggle--on .cp-toggle-knob { transform: translateX(20px); }
  .cp-footer {
    display: flex; justify-content: flex-end; gap: 10px;
    margin-top: 24px;
  }
  .cp-cancel {
    padding: 10px 20px;
    border: 1.5px solid #D3D1C7; border-radius: 10px;
    background: transparent; color: #888780;
    font-size: 14px; font-family: inherit; cursor: pointer;
    transition: border-color 0.18s, color 0.18s;
  }
  .cp-cancel:hover { border-color: #888780; color: #2E4A3A; }
  .cp-save {
    padding: 10px 20px;
    border: none; border-radius: 10px;
    background: #2E4A3A; color: #F5EFE4;
    font-size: 14px; font-weight: 500; font-family: inherit; cursor: pointer;
    transition: opacity 0.18s;
  }
  .cp-save:hover { opacity: 0.88; }
  @media (max-width: 480px) {
    .cp-footer { flex-direction: column-reverse; }
    .cp-cancel, .cp-save { text-align: center; }
  }
`;

export default function ConsentPreferences() {
  const { consent, isPreferencesOpen, acceptAll, rejectAll, closePreferences } = useConsent();
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Sync toggle to current consent each time the panel opens
  useEffect(() => {
    if (isPreferencesOpen) setEnabled(consent === 'accepted');
  }, [isPreferencesOpen, consent]);

  // Close on Escape
  useEffect(() => {
    if (!isPreferencesOpen) return;
    function onKey(e) { if (e.key === 'Escape') closePreferences(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isPreferencesOpen, closePreferences]);

  if (!mounted || !isPreferencesOpen) return null;

  function handleSave() {
    if (enabled) acceptAll();
    else rejectAll();
    closePreferences();
  }

  return (
    <>
      <style>{CSS}</style>
      {/* Backdrop - click to cancel */}
      <div className="cp-overlay" onClick={closePreferences} aria-hidden="true" />

      <div
        className="cp-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Préférences de cookies"
      >
        <button className="cp-close" onClick={closePreferences} aria-label="Fermer">✕</button>

        <h2 className="cp-title">Mes préférences de cookies</h2>

        <div className="cp-row">
          <div className="cp-row-info">
            <p className="cp-row-label">Cookies de mesure d&apos;audience</p>
            <p className="cp-row-desc">
              M&apos;aident à comprendre ce qui fonctionne sur le site pour l&apos;améliorer
              et faire des recommandations plus pertinentes.
            </p>
          </div>
          <button
            className={`cp-toggle${enabled ? ' cp-toggle--on' : ''}`}
            role="switch"
            aria-checked={enabled}
            aria-label="Cookies de mesure d'audience"
            onClick={() => setEnabled(v => !v)}
          >
            <span className="cp-toggle-knob" />
          </button>
        </div>

        <div className="cp-footer">
          <button className="cp-cancel" onClick={closePreferences}>Annuler</button>
          <button className="cp-save" onClick={handleSave}>Enregistrer</button>
        </div>
      </div>
    </>
  );
}

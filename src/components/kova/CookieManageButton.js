'use client';
import { useConsent } from '@/app/components/ConsentContext';

export default function CookieManageButton() {
  const { openPreferences } = useConsent();
  return (
    <button
      onClick={openPreferences}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        font: 'inherit',
        color: 'inherit',
        textDecoration: 'none',
      }}
      onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
      onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}
    >
      Gérer mes cookies
    </button>
  );
}

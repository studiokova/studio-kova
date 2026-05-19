'use client';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { track } from '@/lib/plausible';
import { OFFERS } from '@/lib/config';
import { useConsent } from '@/app/components/ConsentContext';
import { getStoredUtms } from '@/lib/utmTracking';

export default function MerciTracker() {
  const searchParams = useSearchParams();
  const pixelFired = useRef(false);
  const { consent } = useConsent();
  const [metaEventId, setMetaEventId] = useState(null);

  // Plausible — no consent needed
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) return;
    const guardKey = `plausible_analysis_purchased_${sessionId}`;
    if (sessionStorage.getItem(guardKey)) return;
    const roomType = sessionStorage.getItem('analysis_room_type') || '';
    track('Analysis Purchased', { room_type: roomType }, OFFERS.analyse.amount);
    sessionStorage.setItem(guardKey, '1');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch the meta_event_id from the session and store it
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) return;

    fetch(`/api/checkout/session?session_id=${sessionId}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.meta_event_id) setMetaEventId(data.meta_event_id);
      })
      .catch(err => console.error('[Meta Pixel Purchase]', err));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fire pixel when both meta_event_id is ready AND consent is accepted
  useEffect(() => {
    if (!metaEventId || consent !== 'accepted' || pixelFired.current) return;
    if (typeof window.fbq !== 'function') return;
    pixelFired.current = true;
    window.fbq('track', 'Purchase', {
      value: 49,
      currency: 'EUR',
      content_name: 'Analyse photo 49€',
      content_category: 'analyse',
      content_ids: ['analyse_49'],
      ...getStoredUtms(),
    }, { eventID: metaEventId });
  }, [metaEventId, consent]);

  return null;
}

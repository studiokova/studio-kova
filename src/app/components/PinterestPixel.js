'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useConsent } from './ConsentContext';

const TAG_ID = process.env.NEXT_PUBLIC_PINTEREST_TAG_ID;

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { consent } = useConsent();

  useEffect(() => {
    if (!TAG_ID || consent !== 'accepted' || typeof window.pintrk !== 'function') return;
    window.pintrk('page');
  }, [pathname, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export default function PinterestPixel() {
  const { consent, isLoaded } = useConsent();

  if (!TAG_ID || !isLoaded || consent !== 'accepted') return null;

  return (
    <>
      <Script
        id="pinterest-tag"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(e){if(!window.pintrk){window.pintrk=function(){
            window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
            n=window.pintrk;n.queue=[],n.version="3.0";var
            t=document.createElement("script");t.async=!0,t.src=e;var
            r=document.getElementsByTagName("script")[0];
            r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
            pintrk('load', '${TAG_ID}');
            pintrk('page');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://ct.pinterest.com/v3/?event=init&tid=${TAG_ID}&noscript=1`}
          alt=""
        />
      </noscript>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}

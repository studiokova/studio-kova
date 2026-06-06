import { createHash } from 'crypto';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function hash(value) {
  if (value === undefined || value === null) return undefined;
  return sha256(String(value).toLowerCase().trim());
}

function normalizePhone(phone) {
  if (!phone) return undefined;
  const digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 10) {
    return '33' + digits.slice(1);
  }
  return digits;
}

function cleanObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
  );
}

export async function sendMetaEvent({
  eventName,
  eventId,
  email,
  phone,
  firstName,
  externalId,
  value,
  currency,
  eventSourceUrl,
  clientIpAddress,
  clientUserAgent,
  fbp,
  fbc,
  customData,
}) {
  if (process.env.VERCEL_ENV !== 'production') {
    console.log('[CAPI] skipped (non-prod)');
    return { success: false, skipped: true };
  }

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.error('[Meta CAPI] Missing NEXT_PUBLIC_META_PIXEL_ID or META_CAPI_ACCESS_TOKEN');
    return { success: false, error: 'Missing configuration' };
  }

  const userData = cleanObject({
    em: email ? [hash(email)] : undefined,
    ph: phone ? [hash(normalizePhone(phone))] : undefined,
    fn: firstName ? [hash(firstName)] : undefined,
    external_id: externalId ? [hash(externalId)] : undefined,
    client_ip_address: clientIpAddress,
    client_user_agent: clientUserAgent,
    fbp,
    fbc,
  });

  const hasCustomData = value !== undefined || currency !== undefined || (customData && Object.keys(customData).length > 0);

  const eventPayload = cleanObject({
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    event_source_url: eventSourceUrl,
    action_source: 'website',
    user_data: userData,
    custom_data: hasCustomData
      ? cleanObject({ value, currency, ...customData })
      : undefined,
  });

  const url = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [eventPayload] }),
    });

    const response = await res.json();

    if (!res.ok) {
      console.error('[Meta CAPI] API error', response);
      return { success: false, error: response };
    }

    return { success: true, response };
  } catch (error) {
    console.error('[Meta CAPI] Fetch failed', error);
    return { success: false, error };
  }
}

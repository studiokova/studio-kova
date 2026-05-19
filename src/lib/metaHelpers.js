export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? undefined;
}

export function getClientUserAgent(request) {
  return request.headers.get('user-agent') ?? undefined;
}

function extractCookie(cookieHeader, name) {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function getFbp(request) {
  return extractCookie(request.headers.get('cookie'), '_fbp');
}

export function getFbc(request) {
  return extractCookie(request.headers.get('cookie'), '_fbc');
}

export function generateEventId() {
  return crypto.randomUUID();
}

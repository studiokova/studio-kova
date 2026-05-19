const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const SESSION_KEY = 'studiokova_utms';

export function captureUtmsFromUrl() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const incoming = {};
  UTM_KEYS.forEach(key => {
    const val = params.get(key);
    if (val) incoming[key] = val;
  });
  if (Object.keys(incoming).length === 0) return;
  // Nouveaux UTMs dans l'URL → on écrase (last touch wins pour les retours via nouvelle source)
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(incoming));
}

export function getStoredUtms() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return Object.fromEntries(
      Object.entries(parsed).filter(([, v]) => v && String(v).trim().length > 0)
    );
  } catch {
    return {};
  }
}

export function clearUtms() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SESSION_KEY);
}

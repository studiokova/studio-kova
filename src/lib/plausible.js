export function track(event, props, revenue) {
  if (typeof window === 'undefined') return;
  if (typeof window.plausible !== 'function') return;
  const options = {};
  if (props) options.props = props;
  if (revenue != null) options.revenue = { currency: 'EUR', amount: revenue };
  window.plausible(event, options);
}

export function getSource() {
  if (typeof document === 'undefined') return 'direct';
  const ref = document.referrer;
  if (!ref) return 'direct';
  if (ref.includes('/quiz')) return 'quiz';
  if (ref.includes('studiokova.fr')) return 'homepage';
  return 'direct';
}

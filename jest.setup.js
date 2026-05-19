// jest-dom matchers (extend expect)
// Wrappé pour éviter l'erreur "expect is not defined" lors de la validation Jest 30
if (typeof expect !== 'undefined') {
  require('@testing-library/jest-dom');
}

// IntersectionObserver absent de jsdom — polyfill minimal
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

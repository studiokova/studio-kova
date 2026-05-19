const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const customConfig = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: [require.resolve('./jest.setup.js')],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/app/layout.js',
    '!src/content/**',
    '!src/lib/**',
    // Fichiers server-side ou statiques non testables en jsdom
    '!src/app/blog/**',
    '!src/app/sitemap.js',
    // API complexe Brevo (300+ lignes, intégration externe)
    '!src/app/api/subscribe/**',
    // Composants legacy remplacés par les composants kova/
    '!src/components/ComingSoon.js',
    '!src/components/Footer.js',
    '!src/components/Nav.js',
    // Page wrapper autour de ComingSoon (exclu ci-dessus)
    '!src/app/analyse/**',
  ],
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
};

// createJestConfig returns an async function — supported by Jest 27+
module.exports = createJestConfig(customConfig);

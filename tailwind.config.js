/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neu: {
          bg: '#e8edf3',
          card: '#e8edf3',
          text: '#2d3748',
          muted: '#718096',
          darkBg: '#181b22',
          darkCard: '#1e222b',
          darkText: '#e2e8f0',
          darkMuted: '#94a3b8',
        }
      },
      boxShadow: {
        'neu-flat': '7px 7px 15px #c5cbd3, -7px -7px 15px #ffffff',
        'neu-flat-sm': '4px 4px 8px #c5cbd3, -4px -4px 8px #ffffff',
        'neu-flat-lg': '12px 12px 24px #c2c8d0, -12px -12px 24px #ffffff',
        'neu-pressed': 'inset 4px 4px 8px #c2c8d0, inset -4px -4px 8px #ffffff',
        'neu-pressed-sm': 'inset 2px 2px 5px #c2c8d0, inset -2px -2px 5px #ffffff',
        'neu-dark-flat': '7px 7px 15px #111318, -7px -7px 15px #252b36',
        'neu-dark-flat-sm': '4px 4px 8px #111318, -4px -4px 8px #252b36',
        'neu-dark-flat-lg': '12px 12px 24px #0d0f13, -12px -12px 24px #29303c',
        'neu-dark-pressed': 'inset 4px 4px 8px #0f1115, inset -4px -4px 8px #272e3a',
        'neu-dark-pressed-sm': 'inset 2px 2px 5px #0f1115, inset -2px -2px 5px #272e3a',
      },
      borderRadius: {
        'neu': '1.25rem',
        'neu-lg': '1.75rem',
        'neu-full': '9999px',
      }
    },
  },
  plugins: [],
};

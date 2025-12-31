import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        messenger: '#0084FF',
        whatsapp: '#25D366',
        midnight: '#0B1623',
        slate: {
          950: '#0f172a'
        }
      },
      fontFamily: {
        display: ['var(--font-sans)']
      },
      boxShadow: {
        floating: '0 20px 45px -20px rgba(15, 23, 42, 0.4)'
      }
    }
  },
  plugins: []
};

export default config;

import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: '#FAF7F2',
        foreground: '#222222',
        primary: {
          DEFAULT: '#5C1D16',
          foreground: '#FAF7F2',
        },
        secondary: {
          DEFAULT: '#C8A46B',
          foreground: '#222222',
        },
        muted: {
          DEFAULT: '#F0EBE3',
          foreground: '#666666',
        },
        accent: {
          DEFAULT: '#C8A46B',
          foreground: '#222222',
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FAF7F2',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#222222',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-noto-arabic)', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [animate, typography],
};

export default config;

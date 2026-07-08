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
        background: '#F8F5EF',
        foreground: '#2C2C2C',
        primary: {
          DEFAULT: '#5B2C83',
          foreground: '#F8F5EF',
        },
        secondary: {
          DEFAULT: '#C8A24A',
          foreground: '#2C2C2C',
        },
        muted: {
          DEFAULT: '#F0EBE3',
          foreground: '#666666',
        },
        accent: {
          DEFAULT: '#C8A24A',
          foreground: '#2C2C2C',
        },
        lavender: '#8E5FBF',
        saffron: '#E67E22',
        olive: '#5F7D3A',
        sage: '#A8C686',
        brown: '#7A4E2D',
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#F8F5EF',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#2C2C2C',
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

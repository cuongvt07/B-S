import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '16px',
        sm: '24px',
        lg: '32px',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1200px',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0000EE',
          hover: '#0000CC',
          active: '#0000AA',
          disabled: '#CCCCCC',
        },
        ink: {
          DEFAULT: '#313131',
          strong: '#000000',
          muted: '#666666',
        },
        brdr: {
          DEFAULT: '#D9D9D9',
          focus: 'rgba(0,0,238,0.2)',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F5F5F5',
        },
        price: {
          DEFAULT: '#059669',
          soft: '#ECFDF5',
        },
        vip: {
          DEFAULT: '#D97706',
          soft: '#FFFBEB',
        },
        danger: {
          DEFAULT: '#DC2626',
          soft: '#FEF2F2',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: ['"Courier New"', 'monospace'],
      },
      fontSize: {
        xs: ['12px', '18px'],
        sm: ['13.33px', '20px'],
        base: ['16px', '24px'],
        lg: ['20px', '28px'],
        xl: ['24px', '30px'],
        '2xl': ['32px', '40px'],
        '4xl': ['40px', '50px'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
      },
      boxShadow: {
        raised: '0px 1px 3px rgba(0,0,0,0.1)',
        elevated: '0px 4px 12px rgba(0,0,0,0.15)',
        deep: '0px 8px 24px rgba(0,0,0,0.2)',
      },
      maxWidth: {
        container: '1200px',
      },
      keyframes: {
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.04)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        slideInBottom: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        modalIn: {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        spin: 'spin 1s linear infinite',
        fadeIn: 'fadeIn 200ms ease-out',
        float: 'floatY 4s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
        slideUp: 'slideUp 500ms ease-out both',
        slideInRight: 'slideInRight 240ms ease-out',
        slideInLeft: 'slideInLeft 240ms ease-out',
        slideInBottom: 'slideInBottom 240ms ease-out',
        modalIn: 'modalIn 220ms ease-out',
      },
    },
  },
  plugins: [],
};

export default config;

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
        xl: '1240px',
        '2xl': '1240px',
      },
    },
    extend: {
      colors: {
        // ── Brand design system theo logo Gold ──
        // Primary = Gold (đồng bộ logo), CTA = Navy đen (tương phản cao)
        primary: {
          DEFAULT: '#E3A81D',       // Gold (spec) - logo chính
          light: '#F2C24E',         // Gold nhạt - gradient, hover
          dark: '#B07C14',          // Gold tối (gold-dark spec) - shadow, borders
          soft: '#FAF6EC',          // Kem vàng nhạt - background phụ
        },
        // Navy thương hiệu (spec)
        navy: {
          DEFAULT: '#071A3A',
          light: '#10294F',
        },
        
        // CTA - Nút hành động chính (đen sang trọng, tương phản mạnh với gold)
        cta: {
          DEFAULT: '#1A1A1A',       // Đen - nút chính
          hover: '#333333',         // Đen nhạt - hover
          soft: '#F5F5F5',          // Xám nhạt - disabled state
        },
        
        // Background
        background: {
          DEFAULT: '#FFFFFF',       // Nền trắng chính
          cream: '#FAF7F0',         // Nền kem ánh vàng - section xen kẽ
          subtle: '#F7F8FA',        // Nền xám rất nhạt
        },
        
        // Border & dividers
        border: {
          DEFAULT: '#E8E2D5',       // Viền kem vàng nhạt
          light: '#F3EFEA',         // Viền rất nhạt
          focus: 'rgba(227, 168, 29,0.35)', // Focus state với gold (spec)
        },
        
        // VIP badges - phân cấp rõ ràng với gold
        vip: {
          3: '#E3A81D',             // VIP 3: Gold đậm (chữ trắng)
          2: '#F2C24E',             // VIP 2: Gold vừa (chữ đen)
          1: '#E8D9B5',             // VIP 1: Vàng kem (chữ đen)
        },
        
        // Accent - link, tag phụ
        accent: {
          DEFAULT: '#1E88E5',       // Xanh dương - link, info
          hover: '#1565C0',         // Xanh đậm - hover
          soft: '#E3F2FD',          // Xanh nhạt - background
        },
        
        // Price - nổi bật với gold
        price: {
          DEFAULT: '#B07C14',       // Gold-dark (spec) - giá nổi bật
          soft: '#FAF6EC',          // Nền kem
        },
        
        // Semantic colors
        success: {
          DEFAULT: '#16A34A',       // Xanh lá - thành công
          soft: '#F0FDF4',          // Nền xanh nhạt
        },
        danger: {
          DEFAULT: '#DC2626',       // Đỏ - lỗi
          soft: '#FEF2F2',          // Nền đỏ nhạt
        },
        warning: {
          DEFAULT: '#F59E0B',       // Cam - cảnh báo
          soft: '#FFFBEB',          // Nền cam nhạt
        },
        
        // Legacy aliases (giữ tương thích với code cũ)
        brand: {
          DEFAULT: '#E3A81D',       // Alias cho primary gold (spec)
          hover: '#F2C24E',
          active: '#B07C14',
          soft: '#FAF6EC',
        },
        gold: {
          DEFAULT: '#E3A81D',       // Đồng bộ với primary (spec)
          hover: '#F2C24E',
          active: '#B07C14',
          soft: '#FAF6EC',
          ink: '#101828',
        },
        champagne: {
          DEFAULT: '#E3A81D',       // Map sang gold (spec)
          hover: '#F2C24E',
          active: '#B07C14',
          soft: '#FAF6EC',
          ink: '#101828',
        },
        ink: {
          DEFAULT: '#101828',       // Chữ chính (spec text-primary)
          strong: '#0B1220',        // Đen đậm
          muted: '#667085',         // Xám (spec text-muted)
        },
        brdr: {
          DEFAULT: '#E8E2D5',       // Alias cho border
          focus: 'rgba(227, 168, 29,0.35)',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F7F8FA',
        },
      },
      textColor: {
        // Text colors cho Tailwind classes (spec scale)
        'on-dark': '#FFFFFF',
        'on-dark-muted': '#E5E7EB',
        'on-light': '#101828',            // text-primary
        'on-light-secondary': '#475467',  // text-secondary
        'on-light-muted': '#667085',      // text-muted
        'on-light-faint': '#98A2B3',      // text-light
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Arial',
          'Helvetica',
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
        container: '1240px',
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

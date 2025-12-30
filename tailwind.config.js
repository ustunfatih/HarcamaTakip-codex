/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // iOS System Colors
        ios: {
          blue: '#007AFF',
          green: '#34C759',
          orange: '#FF9500',
          red: '#FF3B30',
          purple: '#5856D6',
          pink: '#FF2D55',
          yellow: '#FFCC00',
          teal: '#5AC8FA',
          indigo: '#5856D6',
        },
        // Design System Semantic Colors
        dss: {
          primary: '#007AFF',
          success: '#34C759',
          warning: '#FF9500',
          error: '#FF3B30',
          // Labels
          label: '#1D1D1F',
          secondaryLabel: '#6E6E73',
          tertiaryLabel: '#AEAEB2',
          // Backgrounds
          background: '#F5F5F7',
          secondaryBg: '#FFFFFF',
          groupedBg: '#F2F2F7',
          // Dark mode
          darkBg: '#1C1C1E',
          darkSecondaryBg: '#2C2C2E',
          darkTertiaryBg: '#3A3A3C',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        // HIG Typography Scale (Dynamic Type - Large/Default)
        'hig-largeTitle': ['34px', { lineHeight: '41px', fontWeight: '700' }],
        'hig-title1': ['28px', { lineHeight: '34px', fontWeight: '400' }],
        'hig-title2': ['22px', { lineHeight: '28px', fontWeight: '400' }],
        'hig-title3': ['20px', { lineHeight: '25px', fontWeight: '400' }],
        'hig-headline': ['17px', { lineHeight: '22px', fontWeight: '600' }],
        'hig-body': ['17px', { lineHeight: '22px', fontWeight: '400' }],
        'hig-callout': ['16px', { lineHeight: '21px', fontWeight: '400' }],
        'hig-subheadline': ['15px', { lineHeight: '20px', fontWeight: '400' }],
        'hig-footnote': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'hig-caption1': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'hig-caption2': ['11px', { lineHeight: '13px', fontWeight: '400' }],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'glass-dark': '0 4px 30px rgba(0, 0, 0, 0.3)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        blob: "blob 7s infinite",
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spin 1s linear infinite',
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      borderRadius: {
        'ios': '12px',
        'ios-lg': '16px',
        'ios-xl': '20px',
        'ios-2xl': '24px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}

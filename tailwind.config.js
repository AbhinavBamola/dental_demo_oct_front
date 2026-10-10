/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#071526',
          900: '#0B2545',
          800: '#133E6E',
          700: '#1B538C',
          600: '#256AA8',
          100: '#E1EBF5',
          50: '#F0F6FC',
        },
        dental: {
          teal: '#0D9488',
          'teal-light': '#14B8A6',
          'teal-subtle': '#CCFBF1',
          blue: '#0284C7',
          sky: '#38BDF8',
          ice: '#F0F9FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(11, 37, 69, 0.06)',
        card: '0 8px 30px -4px rgba(11, 37, 69, 0.08)',
        float: '0 20px 40px -10px rgba(11, 37, 69, 0.15)',
      },
    },
  },
  plugins: [],
};

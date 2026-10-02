/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050C1A',
          900: '#0A1128',
          800: '#001F54',
          700: '#0C2754',
          600: '#133B70',
          500: '#1E4D8C',
          100: '#E6ECF5',
          50: '#F0F4FA',
        },
        gold: {
          50: '#FDFBF7',
          100: '#FAF4E5',
          200: '#F4E5BD',
          300: '#EBD28B',
          400: '#E0BF5C',
          500: '#D4AF37', // Primary Luxury Gold
          600: '#B89428',
          700: '#94751C',
          800: '#735914',
          900: '#523E0C',
        },
        cream: {
          50: '#FFFEFA',
          100: '#FDFBF7',
          200: '#F7F3EA',
          300: '#EFE8DA',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
        'gold-subtle': '0 4px 20px rgba(212, 175, 55, 0.15)',
        'luxury': '0 20px 40px -15px rgba(10, 17, 40, 0.15)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #DFBA73 0%, #D4AF37 50%, #C5A059 100%)',
        'navy-gradient': 'linear-gradient(180deg, #0A1128 0%, #001F54 100%)',
        'hero-gradient': 'linear-gradient(to right, rgba(10, 17, 40, 0.95), rgba(0, 31, 84, 0.8), rgba(10, 17, 40, 0.4))',
      }
    },
  },
  plugins: [],
}

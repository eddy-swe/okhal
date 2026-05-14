/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette
        terracotta: {
          50:  '#fdf3ef',
          100: '#fbe0d3',
          200: '#f6bfa7',
          300: '#ef9572',
          400: '#e56a42',
          500: '#d94f24',  // ← main brand color
          600: '#c03d18',
          700: '#9e3016',
          800: '#7f2918',
          900: '#672518',
        },
        // Accent / nature
        savanna: {
          50:  '#f6f7f0',
          100: '#eaeddc',
          200: '#d5dcbb',
          300: '#b7c48f',
          400: '#98aa66',
          500: '#7a9147',
          600: '#5f7237',
          700: '#4a592c',
          800: '#3c4726',
          900: '#333d23',
        },
        // Warm neutrals
        earth: {
          100: '#f2ede4',
          200: '#e3d8c7',
          300: '#cdbda2',
          400: '#b49d7c',
          500: '#9d8260',
          600: '#8a6e4f',
          700: '#735a42',
          800: '#5f4a39',
          900: '#4f3e31',
        },
        // Deep background
        inkwood: '#1c1410',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl':  '0.875rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
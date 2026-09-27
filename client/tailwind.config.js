/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3daec',
          300: '#94c0df',
          400: '#5ea2cf',
          500: '#3784be',
          600: '#1b5e9c', // Primary Gov Deep Blue
          700: '#184f85',
          800: '#17436f',
          900: '#18385d',
          950: '#0f243e'
        },
        india: {
          orange: '#FF9933',
          green: '#138808',
          ashoka: '#000080'
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          border: '#e2e8f0',
          card: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'gov': '0 4px 6px -1px rgba(27, 94, 156, 0.08), 0 2px 4px -1px rgba(27, 94, 156, 0.04)',
        'elevation': '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.03)'
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'portrait': { 'raw': '(orientation: portrait)' },
        'landscape': { 'raw': '(orientation: landscape)' }
      }
    },
    colors: {
      "transparent": "transparent",
      "primary": "#2C63F1",
      "error": "#F84242",
      "success": "#7BFC5A",
      "black": "#060A12",
      "container": "#F1F3FA",
      "container-selected": "#EDEFF6",
      "background": "#FAFBFF",
    },
    fontFamily: {
      "roboto": ["Roboto", "sans-serif"],
    }
  },
  plugins: [],
}


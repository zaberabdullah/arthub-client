/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react");

module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  darkMode: "class",
  plugins: [heroui({
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          background: "#FAFAFA",
          foreground: "#18181B", 
          primary: { 500: "#6366F1", foreground: "#FFFFFF" },
          secondary: { 500: "#F4F4F5" },
        },
        layout: { radius: { medium: "16px" } }
      },
      dark: {
        colors: {
          background: "#09090B",
          foreground: "#FAFAFA",
          primary: { 500: "#8B5CF6" },
        }
      }
    }
  })]
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0a0a0a",
          900: "#121212",
          800: "#1c1c1c",
          700: "#2a2a2a",
        },
        paper: {
          50: "#f6f1e7",
          100: "#efe6d3",
          200: "#e2d4b5",
        },
        gold: {
          400: "#e8c766",
          500: "#c9a227",
          600: "#a5811d",
          700: "#7d6216",
        },
        vermil: {
          500: "#a8201a",
          600: "#8a1a15",
        },
        jade: {
          400: "#5fa88f",
          500: "#3f8a72",
          600: "#2f6b58",
        },
        umber: {
          500: "#6b4a34",
          600: "#513625",
        },
      },
      fontFamily: {
        display: ["'Noto Serif', 'Noto Serif SC', serif"],
        body: ["'Inter', system-ui, sans-serif"],
      },
    },
  },
  plugins: [],
};

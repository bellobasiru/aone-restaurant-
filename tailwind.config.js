/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        jollof: {
          DEFAULT: "#B3202C",
          dark: "#8A1922",
          light: "#D94A4A",
        },
        palm: {
          DEFAULT: "#1E5631",
          dark: "#123A20",
          light: "#2F7A47",
        },
        cream: "#FFF8F0",
        ink: "#201A18",
        gold: "#C98A2C",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Work Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
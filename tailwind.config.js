const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  fontFamily: {
    sans: ["Poppins", "sans-serif"],
    mono: ["Source Code Pro", "monospace"],
    // serif: ["Averia Libre", "cursive"],
  },
  theme: {
    extend: {
      backgroundImage: {
        performersHero: "url('performers/PerformersHero.png')",
      },
      colors: {
        gradient: { 100: "#E6E6E6", 200: "#CCCCCC" },
        neutral: { 100: "#E6E6E6", 200: "#8C8C8C", 900: "#999999" },
        black: { 100: "#000000", 10: "#0000001A" },
        zinc: { 100: "#F2F2F2 ", 400: "#B3B3B3", 900: "#1C1E23" },
        slate: { 500: "#5C71A3" },
        white: { 100: "#FFFFFF" },
        blue: { 500: "#1A202E", 10: "#1A202E1A" },
        "mettalic-blue": { 300: "#5C71A3" },
        gray: { 500: "#999999", 300: "#8C8C8C", 100: "#E6E6E6" },
      },
    },
    screens: {
      sm: "300px",
      md: "700px",
      lg: "1000px",
      xl: "1500px",
      hd: "1920px",
      "2k": "2048px",
      "4k": "3700px",
    },
  },

  plugins: [],
};

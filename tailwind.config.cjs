/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Generic fallbacks matter here: the fonts come from a Google Fonts
        // stylesheet, and without these a failed load drops to the browser
        // default serif rather than a sensible sans-serif.
        bebas: ["Bebas Neue", "Impact", "sans-serif"],
        open: ["Open Sans", "system-ui", "sans-serif"],
        poppins: ["Poppins", "system-ui", "sans-serif"],
      },
      screens: {
        lg: "1100px",
      },
      colors: {
        grayCustom: "#666766",
        // Fallbacks aligned with the current design system (gold / wine / blush).
        primaryLight: "var(--color-primary-light, #d4af6a)",
        primaryDark: "var(--color-primary-dark, #2c1728)",
        secondary: "var(--color-secondary, #e7a9b4)",
        lightGray: "#E4E4E4",
        lightBrown: "#3C4247",
        beige: "#EBCE8F",
        application1: "#A58D90",
        application2: "#766561",
        application3: "#F4D99C",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@headlessui/tailwindcss"),
  ],
};

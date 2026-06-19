/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {},
      animation: {
        "slide-r-l": "slide-r-l 0.3s ease-in-out forwards",
        "slide-b-t": "slide-b-t 0.3s ease-in-out forwards",
        "slide-t-b": "slide-t-b 0.3s ease-in-out forwards",
        fade: "fade 0.3s ease-in-out forwards",
      },
      keyframes: {
        "slide-r-l": {
          "0%": { transform: "translateX(20%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        "slide-t-b": {
          "0%": { transform: "translateY(-20%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "slide-b-t": {
          "0%": { transform: "translateY(20%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        fade: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};

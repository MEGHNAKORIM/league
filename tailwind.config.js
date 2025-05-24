/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

const colors = {
  primary: "#ef495d",
  "base-100": "oklch(100% 0 0)",
  "base-200": "#F2F2F2",
  "base-300": "#E5E6E6",
};

export default {
  content: ["./index.html", "./src/**/*.{tsx,jsx}"],
  theme: {
    extend: {
      colors: colors,
      fontFamily: {
        plain: ["Plain", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        raleway: ["Raleway", "sans-serif"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#ef495d",
          "base-100": "oklch(100% 0 0)",
          "base-200": "#F2F2F2",
          "base-300": "#E5E6E6",
        },
      },
    ],
  },
};

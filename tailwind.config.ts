import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./sections/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        risen: {
          primary: "#2EDBFF",
          navy: "#020B1A",
        },
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "text-shimmer": {
          "0%": { "background-position": "0% 50%" },
          "100%": { "background-position": "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        shimmer: "shimmer 3s infinite linear",
        "shimmer-fast": "shimmer 1.5s infinite linear",
        "text-shimmer": "text-shimmer 3s infinite linear",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
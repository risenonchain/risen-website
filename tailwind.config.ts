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
          bg: "#020B1A",
          navy: "#061B33",
          primary: "#2EDBFF",
          accent: "#7FE8FF",
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(46, 219, 255, 0.6)",
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
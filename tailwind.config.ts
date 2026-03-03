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
    },
  },
  plugins: [],
};

export default config;
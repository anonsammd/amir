import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#050505",
          surface: "#101010",
          secondary: "#171717",
          white: "#ffffff",
          muted: "#b8b8b8",
          red: "#ff3030",
          "red-dark": "#a90f20",
        },
      },
    },
  },
  plugins: [],
};

export default config;

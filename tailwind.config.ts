import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        andes: {
          blue: "#153f98",
          deep: "#0d2d72",
          bright: "#2563eb",
          orange: "#ff7a00",
          warm: "#ff9b26",
          smoke: "#f5f8ff"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;

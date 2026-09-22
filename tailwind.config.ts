import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#030303",
        paper: "#FFFFFF",
        maroon: "#6E1F24",
        coral: "#EB5A3C"
      },
      fontFamily: {
        heading: ["var(--font-bricolage)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;

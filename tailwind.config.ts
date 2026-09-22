import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#030303",
        paper: "#FFFFFF",
        maroon: "#6E1F24"
      },
      fontFamily: {
        heading: ["var(--font-bricolage)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"]
      },
      boxShadow: {
        editorial: "8px 8px 0 #030303",
        "editorial-soft": "5px 5px 0 rgba(3, 3, 3, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;

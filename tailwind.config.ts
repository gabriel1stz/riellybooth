import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        heading: ["var(--font-fredoka)", "sans-serif"],
        handwriting: ["var(--font-caveat)", "cursive"],
      },
      colors: {
        scrapbook: {
          bg: "#FFF0F4",
          bgSecondary: "#FFF9F0",
          primary: "#F48FB1",
          accent: "#E84D91",
          soft: "#F8D8E3",
          plum: "#392633",
          muted: "#8B7180",
          border: "#E9B8CA",
        },
      },
      boxShadow: {
        paper: "0 2px 8px -2px rgba(57, 38, 51, 0.08), 0 4px 16px -4px rgba(232, 77, 145, 0.12)",
        "paper-lg": "0 8px 24px -4px rgba(57, 38, 51, 0.12), 0 12px 32px -4px rgba(232, 77, 145, 0.16)",
        polaroid: "0 4px 14px 0 rgba(57, 38, 51, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.06)",
        stamp: "2px 3px 0px 0px #E9B8CA",
        "stamp-accent": "2px 3px 0px 0px #E84D91",
        "stamp-plum": "2px 3px 0px 0px #392633",
      },
    },
  },
  plugins: [],
};
export default config;

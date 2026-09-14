import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#14110f",
          900: "#1c1815",
          800: "#2b241e",
          700: "#413830",
          600: "#5c5049",
          500: "#7a6d63",
          400: "#a2948a",
          300: "#c7bbae",
          200: "#e3dad0",
          100: "#f1ebe2",
          50: "#faf7f2",
        },
        brand: {
          950: "#1a2e28",
          900: "#20392f",
          800: "#284739",
          700: "#31573f",
          600: "#3c6a4b",
          500: "#4d8058",
          400: "#6c9e73",
          300: "#9bc0a0",
          200: "#cbe0cd",
          100: "#e6f0e7",
          50: "#f3f8f3",
        },
        clay: {
          600: "#b5502f",
          500: "#c96339",
          400: "#dd8360",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "#2b241e",
            "--tw-prose-headings": "#1c1815",
            "--tw-prose-links": "#31573f",
            "--tw-prose-bold": "#1c1815",
            "--tw-prose-quotes": "#413830",
            "--tw-prose-quote-borders": "#9bc0a0",
            "--tw-prose-th-borders": "#e3dad0",
            "--tw-prose-td-borders": "#e3dad0",
            maxWidth: "none",
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;

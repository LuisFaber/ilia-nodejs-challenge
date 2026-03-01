import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        wallet: {
          bg: "var(--wallet-bg)",
          surface: "var(--wallet-surface)",
          muted: "var(--wallet-muted)",
          credit: "var(--wallet-credit)",
          debit: "var(--wallet-debit)",
        },
      },
    },
  },
  plugins: [],
};
export default config;

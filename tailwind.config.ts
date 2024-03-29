import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        1: "1px",
      },
      screens: {
        xs: "500px",
      },
    },
    colors: {
      background: "#F5F5F5",
      onBackground: "#0A0A0A",
      primary: "#2C63F1",
      secondary: "#C5D2F4",
      tertiary: "#94abeb",
      error: "#f12727",
      dark: {
        background: "#02050e",
        onBackground: "#e9eaee",
        primary: "#477cfe",
        secondary: "#070c20",
        tertiary: "#141C3B",
        error: "#D82325",
      },
    },
  },
};
export default config;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        bone: "#F4F1EC",
        graphite: "#5C5C5C",
        line: "#E3DFD8",
        "line-dark": "#262626",
        gold: { DEFAULT: "#F4F1EC", light: "#FFFFFF", dark: "#0A0A0A" },
        sale: "#9B2C2C",
        success: "#2F6B4F",
        error: "#B42318",
      },
      fontFamily: {
        display: ['"Barlow Condensed"', "Impact", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: { label: "0.22em" },
      borderRadius: { DEFAULT: "0px", sm: "2px", md: "2px" },
      boxShadow: {
        lift: "0 18px 40px -18px rgba(10,10,10,.35)",
        soft: "0 6px 20px -10px rgba(10,10,10,.25)",
      },
      backgroundImage: {
        "fade-ink":
          "linear-gradient(to top, rgba(10,10,10,.75), rgba(10,10,10,0))",
      },
      transitionTimingFunction: { brand: "cubic-bezier(.22,.8,.2,1)" },
      maxWidth: { shell: "1440px" },
    },
  },
  plugins: [],
};

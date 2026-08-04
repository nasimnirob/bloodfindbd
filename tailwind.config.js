export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['Playfair', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
        libre: ['Libre Baskerville', 'serif'],
        time: ['Times New Roman', 'time', 'serif']
      },
      colors: {
        primary: {
          DEFAULT: "#ffffff",
          dark: "#1c1c1d",
        },
        secondary: {
          DEFAULT: "#4b5563",
          dark: "#d1d5db",
        },
        container: {
          DEFAULT: "#f9fafb",
          dark: "#111827",
        },
      },
      keyframes: {
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        slideOutRight: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(100%)" },
        },
        slideOutLeft: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        slideInDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0%)" },
        },
      },
      animation: {
        "slide-in-right": "slideInRight 0.7s ease-in-out",
        "slide-in-left": "slideInLeft 0.7s ease-in-out",
        "slide-out-right": "slideOutRight 0.7s ease-in-out",
        "slide-out-left": "slideOutLeft 0.7s ease-in-out",
        "slide-in-down": "slideInDown 0.9s ease-in-out",
      },
      screens: {
            '3xl': '1920px',
            '4xl': '2560px',
        },
    },
  },
  plugins: [
    require('daisyui'),
    require('tailwind-scrollbar-hide'),
  ],
}


// bg-#F3F3FE, textbg-#DFDFFF, text-#7A36FD
// border- #DFE2E5, bg-#ECF5FF, text-#1D69D2, textbg-#CBE5FF,
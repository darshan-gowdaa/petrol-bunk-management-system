/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        modalSlideIn: {
          "0%": { transform: "translateY(-20px) scale(0.95)", opacity: "0" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        modalFadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        popupSlideIn: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        popupSlideOut: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" }
        },
        rotateIn: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(90deg)" }
        }
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        modalSlideIn: "modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        modalFadeIn: "modalFadeIn 0.2s ease-out",
        popupSlideIn: "popupSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        popupSlideOut: "popupSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        fadeInUp: "fadeInUp 0.5s ease-out",
        scaleIn: "scaleIn 0.3s ease-in-out",
        rotateIn: "rotateIn 0.3s ease-in-out"
      },
      transitionProperty: {
        'multiple': 'transform, opacity, filter'
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms'
      }
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
      animation: {
        bounce: 'bounce 1s ease-in-out',
      },
      backgroundImage: {
        'white-pattern': 'url(/backgroundPattern.webp)'
      }
    },
  },
  plugins: [],
};


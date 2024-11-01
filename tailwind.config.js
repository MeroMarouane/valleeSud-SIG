/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        'black': {
          DEFAULT: "#1A1A1A",
          '800': "#2a2e30",
        },
        'gray': {DEFAULT: '#9E9E9E', '600': '#ffffff99'},
        'purple': {
          DEFAULT: "#7450E9",
          '100': '7450e914'
        },
        'red': '#E95050',
        'yellow': '#ffc300'
      },
    },
  },
  plugins: [],
};

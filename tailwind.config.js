/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'lightyellow': '#fdf3da',
        'lightred' :'#ed6ea0',
        'white' :'#DDE2D6',
        'lightgreen' :'#009b74',
        'blackgreen':'#12674A',
      },
      spacing: {
        '129': '80vh',
        '128': '45vw',
        '111': '20vw',
        '112': '60rem',
        'a1': '30rem',
        'a2': '20rem',
      }
    },
  },
  plugins: [require("daisyui")],
}
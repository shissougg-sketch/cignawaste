/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'cigna-red': '#B03045',
        'cigna-yellow': '#FFD700',
        'cigna-charcoal': '#1A1A1A',
        'cigna-cream': '#F5F5DC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Oswald', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

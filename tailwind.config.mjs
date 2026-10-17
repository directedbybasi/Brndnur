/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  corePlugins: {
    preflight: false, // Prevents Tailwind CSS resets from breaking existing reference designs & typography
  },
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F4EFE4',
          50: '#FCFAF6',
          100: '#F4EFE4',
          200: '#E8DFC8',
          300: '#DCCFAC',
        },
        navy: {
          DEFAULT: '#13233A',
          800: '#182C49',
          900: '#13233A',
          950: '#0C1726',
        },
        gold: {
          DEFAULT: '#A8781A',
          hover: '#8C6415',
          light: '#F8F3E9',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
};

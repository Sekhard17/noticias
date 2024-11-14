module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // Color base (puedes cambiarlo)
          dark: '#2563EB',    // Versión más oscura para hover
        }
      }
    }
  },
  plugins: [],
} 
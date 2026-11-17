import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base: './' so the same static build works under a root domain (Vercel/Netlify)
// and a project subpath (GitHub Pages).
export default defineConfig({
  base: './',
  plugins: [react()],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  // Jika lokal ('serve') gunakan '/', jika deploy gunakan '/product-store-final/' [cite: 2025-12-20]
  base: command === 'serve' ? '/' : '/product-store-final/',
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
}))
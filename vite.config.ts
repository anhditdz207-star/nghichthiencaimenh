import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base: './' để chạy đúng trên GitHub Pages (project site) dù không biết trước tên repo
export default defineConfig({
  base: './',
  plugins: [react()],
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/dist/',  // Adjust this to match your deployment subdirectory
  plugins: [vue()],
})
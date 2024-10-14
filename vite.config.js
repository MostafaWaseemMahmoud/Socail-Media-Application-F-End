import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {}, // Define global as an empty object
  },
  build: {
    chunkSizeWarningLimit: 1000, // or any size you prefer
  },
})

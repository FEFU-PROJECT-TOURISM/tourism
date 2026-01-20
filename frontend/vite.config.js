import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2017', // Для поддержки top-level-await
  },
  optimizeDeps: {
    exclude: ['ymaps3'], // Исключаем ymaps3 из оптимизации
  },
  // server: {
  //   allowedHosts: ['tourism-fefu-vdk.ru']
  // }
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Прокси для API-запросов
      '/api': {
        target: 'http://proremont.com/admin', // Локальный OpenServer сайт донор
        changeOrigin: true, // Подменить заголовок Host
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Оставляем путь неизменным
      }
    }
  }
})

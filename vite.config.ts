import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


export default defineConfig({
  base: './',
  plugins: [ vue(), ],
  server: {
    proxy: {
      // Прокси для API-запросов
      '/api': {
        target: 'https://proremont.com', // Локальный OpenServer сайт донор
        changeOrigin: true, // Подменить заголовок Host
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/admin/api'), // Оставляем путь неизменным
      }
    }
  }
})

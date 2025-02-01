import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Notifications from '@kyvg/vue3-notification'
import velocity from 'velocity-animate'
import App from './App.vue'


const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(Notifications, { velocity })
app.mount('#app')

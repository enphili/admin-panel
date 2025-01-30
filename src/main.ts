import { createApp } from 'vue'
import Notifications from '@kyvg/vue3-notification'
import velocity from 'velocity-animate'
import App from './App.vue'

const app = createApp(App)
app.use(Notifications, { velocity })
app.mount('#app')

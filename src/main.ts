import '@/assests/main.css'
import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router'
import { queryClient } from './lib/queryClient.ts'

const app = createApp(App)

app.use(router)
app.use(VueQueryPlugin, { queryClient: queryClient })
app.mount('#app')

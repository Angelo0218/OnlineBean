import { createApp } from 'vue'
import App from './App.vue'
import './style.css' 
import router from './router/router.js'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
createApp(App).use(router).mount('#app')
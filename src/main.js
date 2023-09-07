import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import router from './router/router.js';
import store from './store'
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';



const app = createApp(App)

app.use(store)

app.use(router).mount('#app');

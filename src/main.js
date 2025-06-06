import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import router from './router/router.js';
import { createPinia } from 'pinia';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import axios from 'axios';
import { useAuthStore } from './store/auth.js';

const app = createApp(App);

// 使用 Pinia
const pinia = createPinia();
app.use(pinia);

// Axios 拦截器
axios.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers['Authorization'] = 'Bearer ' + authStore.token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});





app.use(router).mount('#app');

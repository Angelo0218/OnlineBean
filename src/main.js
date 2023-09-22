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

// 如果 localStorage 中有 token，则尝试获取当前用户信息
const authStore = useAuthStore();
if (localStorage.getItem('token')) {
  authStore.fetchCurrentUser().catch(error => {
    console.error("Error fetching user info:", error);
    if (error.response && error.response.status === 403) {
      // 如果错误状态码为 403，清除本地 token 并更新用户认证状态
      localStorage.removeItem('token');
      authStore.isAuthenticated = false;
      authStore.token = null;
      location.reload();
    }
  });
}

app.use(router).mount('#app');

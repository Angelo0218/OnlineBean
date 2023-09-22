import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import router from './router/router.js';
import { createPinia } from 'pinia'; // 引入 createPinia
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import axios from 'axios'; // 引入 Axios
import { useAuthStore } from './store/auth'; // 引入 Auth Store

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
if (localStorage.getItem('token')) {
  axios.get('http://angelo0218-server.ddns.net:3000/api/currentUser')
    .then(response => {
      const authStore = useAuthStore();
      authStore.username = response.data.username;
      authStore.isAuthenticated = true;
    })
    .catch(error => {
      console.error("Error fetching user info:", error);
      if (error.response && error.response.status === 403) {
        // 如果錯誤狀態碼為 403，清除本地 token 並更新用戶認證狀態
        localStorage.removeItem('token');
        const authStore = useAuthStore();
        authStore.isAuthenticated = false;
        authStore.token = null;
        location.reload();
        // 如果需要，您還可以重定向用戶到登錄頁面
        // router.push('/login');
      }
  
    });
}

app.use(router).mount('#app');

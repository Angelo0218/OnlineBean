import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router/router.js';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    registrationSuccess: false,
    token: null,
    isAuthenticated: false,
    username: null,
    errorMessage: null, // 新增此行
  }),
  actions: {
    setRegistrationSuccess(value) {
      this.registrationSuccess = value;
    },
    async login(identifier, password) {
      try {
        const response = await axios.post('http://angelo0218-server.ddns.net:3000/login', { identifier, password });

        if (response.status === 200) {
          this.token = response.data.token;
          this.isAuthenticated = true;
          this.username = response.data.user.username;

          router.push('/');
        } else {
          this.errorMessage = '登入失敗: ' + response.data; // 設置錯誤消息
        }
      } catch (error) {
        this.errorMessage = '登入過程中出現錯誤: ' + error.message; // 設置錯誤消息
      }
    },
    logout() {
      this.token = null;
      this.isAuthenticated = false;
    }
  }
});

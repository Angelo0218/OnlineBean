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
    welcomeMessageShown: false,
    errorMessage: null, // 新增此行
    showWelcomeMessage: false,
  }),
  actions: {
    showWelcomeMessage() {
      if (!this.welcomeMessageShown) {
        this.welcomeMessageShown = true;
        return true;
      }
      return false;
    },
    setRegistrationSuccess(value) {
      this.registrationSuccess = value;
    },
    async login(identifier, password) {
      try {
        const response = await axios.post('http://angelo0218-server.ddns.net:3000/login', { identifier, password });
    
        if (response.status === 200) {
          this.token = response.data.token;
          
          // 將 token 存儲到 localStorage
          localStorage.setItem('token', this.token);
          
          this.isAuthenticated = true;
          this.username = response.data.user.username;
          this.showWelcomeMessage = true; // Set this to true upon successful login
          router.push('/');
        } else {
          throw new Error(response.data || '登錄失敗');
        }
    
      } catch (error) {
        throw new Error(error.response.data || error.message);
      }
    },
    

    hideWelcomeMessage() {
      this.showWelcomeMessage = false;
    },
    logout() {
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    }
  }
});

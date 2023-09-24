import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router/router.js';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    registrationSuccess: false,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    username: null,
    email: null,
    role: null, // 添加 role 狀態
    creationDate: null,
    welcomeMessageShown: false,
    errorMessage: null,
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
          localStorage.setItem('token', this.token);
          this.isAuthenticated = true;
          this.username = response.data.user.username;
          this.email = response.data.user.email;
          this.role = response.data.user.role; // 正確更新 role
          this.creationDate = response.data.user.creationDate;
          this.showWelcomeMessage = true;
          router.push('/');
        } else {
          throw new Error(response.data || '登录失败');
        }
      } catch (error) {
        throw new Error(error.response.data || error.message);
      }
    },
    async fetchCurrentUser() {
      if (this.token) {
          try {
              const response = await axios.get('http://angelo0218-server.ddns.net:3000/api/currentUser', {
                  headers: {
                      'Authorization': `Bearer ${this.token}`
                  }
              });
              console.log(response.data);
              this.username = response.data.username;
              this.email = response.data.email;
              this.role = response.data.role; // 正確更新 role
              this.creationDate = response.data.creationDate;
          } catch (error) {
            console.error('Error fetching current user:', error.response || error);
            this.logout();
          }
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

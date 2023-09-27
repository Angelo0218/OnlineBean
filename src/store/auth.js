import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router/router.js';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    registrationSuccess: false,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    justLoggedIn: false,
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
        const apiUrl = import.meta.env.VITE_API_URL;
    
        const response = await axios.post(`${apiUrl}/login`, { identifier, password });
        if (response.status === 200) {
          this.token = response.data.token;
          localStorage.setItem('token', this.token);
          this.isAuthenticated = true;
          this.username = response.data.user.username;
          this.email = response.data.user.email;
          this.role = response.data.user.role; 
          this.creationDate = response.data.user.creationDate;
          this.showWelcomeMessage = true;
          this.justLoggedIn = true; 
          // 使用 setTimeout 来延迟跳转
          setTimeout(() => {
            router.push('/');
          }, 0);
        } else {
          throw new Error(response.data || '登入成功');
        }
      } catch (error) {
        throw new Error(error.response.data || error.message);
      }
    },
    
    
    async fetchCurrentUser() {
      if (this.token) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL;

          const response = await axios.get(`${apiUrl}/api/currentUser`, {
            headers: {
              'Authorization': `Bearer ${this.token}`
            }
          });
          // console.log(response.data);
          this.username = response.data.username;
          this.email = response.data.email;
          this.role = response.data.role;
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

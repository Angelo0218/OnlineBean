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
    email:null,
    userLevel: null,
    
    welcomeMessageShown: false,
    errorMessage: null, 
    showWelcomeMessage: false,
  }),
  actions: {
    async fetchCurrentUser() {
      if (this.token) {
        try {
          const response = await axios.get('http://angelo0218-server.ddns.net:3000/api/currentUser', {
            headers: {
              'Authorization': `Bearer ${this.token}`
            }
          });
          // 确保从响应体中正确地获取 userLevel 属性
          this.username = response.data.username;
          this.email = response.data.email;
          this.userLevel = response.data.userLevel; // 确保这里是正确的路径
          console.log(response.data);

        } catch (error) {
          console.error('Error fetching current user:', error);
          this.logout(); // 如果获取用户信息失败，执行登出操作
        }
      }
    },
    
    
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
          this.email = response.data.user.email;
          this.userLevel = response.data.user.userLevel;
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

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
            
              // 将 token 存储到 localStorage
              localStorage.setItem('token', this.token);
            
              this.isAuthenticated = true;
              this.username = response.data.user.username;
              this.email = response.data.user.email;
            
              // 确保从返回的数据中提取 userLevel 并设置
              this.userLevel = response.data.user.userLevel; // 请根据实际返回值结构调整路径
            
              console.log(this.userLevel); // 打印出 userLevel 查看是否正确设置
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
         
          this.username = response.data.username;
          this.email = response.data.email;
          this.userLevel = response.data.userLevel; 
      

        } catch (error) {
          console.error('Error fetching current user:', error);
          this.logout(); // 如果获取用户信息失败，执行登出操作
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

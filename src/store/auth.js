import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router/router.js';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    token: null,
    isAuthenticated: false,
    username: null, // 添加此行
  }),
  actions: {
    async login(identifier, password) {
      try {
        // console.log('Attempting to log in with credentials:', { identifier, password });

        const response = await axios.post('http://192.168.0.121:3000/login', { identifier, password });
        console.log('Login response:', response.data);

        if (response.status === 200) {
          this.token = response.data.token;
          this.isAuthenticated = true;
          this.username = response.data.user.username;
          console.log('Setting username:', response.data.user.username);


          router.push('/');
          console.log('Login successful');
        } else {
          console.error('Login failed:', response.data);
        }

      } catch (error) {
        console.error('Error during login:', error);
      }
    },
    logout() {
      this.token = null;
      this.isAuthenticated = false;
    }
  }
});

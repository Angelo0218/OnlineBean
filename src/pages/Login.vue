<template>
    <div class="flex items-center justify-center home  mt-32 sm:mt-20  ">
        <div class="container w-auto shadow-2xl flex flex-col rounded-l-md max-sm:rounded-none sm:flex-row">
            <div class="left bg-white flex items-center justify-center w-auto rounded max-sm:rounded-none">
                <div class="w-full md:mt-0 sm:max-w-md xl:p-0">
                    <div class="p-6 space-y-4 md:space-y-6">
                        <p class="text-3xl font-black leading-tight tracking-tight text-gray-900">
                            登入
                        </p>

                        <!-- 帳號 (使用者名稱或電子郵件) -->
                        <div>
                            <label for="identifier" class="block mb-2 text-sm font-medium text-gray-900">
                                帳號 (使用者名稱或電子郵件)
                            </label>
                            <input type="text" name="identifier" id="identifier" v-model="credentials.identifier"
                                class="bg-gray-50 border text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600
                            focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                            dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        </div>


                        <!-- 密碼 -->
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900">密碼</label>
                            <input type="password" name="password" id="password" placeholder="••••••••"
                                v-model="credentials.password"
                                class="border text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        </div>


                        <!-- 記住我選項 -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox"
                                        class="w-4 h-4 border rounded focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800">
                                </div>
                                <div class="ml-3 text-sm">
                                    <label for="remember" class="text-blue-500">記住我</label>
                                </div>
                            </div>
                        </div>

                        <!-- 登入按鈕 -->
                        <button @click="handleLogin"
                            class="btn w-full focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">登入</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '../index.css';

import { ref } from 'vue'; // 加入 ref 來創建反應性對象
import { useAuthStore } from '../store/auth.js'; // 引入我們的 auth store



export default {

    name: 'Login',
    setup() {
  const authStore = useAuthStore();
  const credentials = ref({
      identifier: '',
      password: ''
  });

  const handleLogin = async () => {
    try {
      const { identifier, password } = credentials.value; // 获取 identifier 和 password
      authStore.login(identifier, password); // Just call the store's login function
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return {
      credentials,
      handleLogin
  };
}

}
</script>

<style scoped>
video {
    object-fit: cover;
}

.btn {
    background-color: blackgreen;
}



p,
input,
label {
    font-family: CUBIC;
}
</style>
  
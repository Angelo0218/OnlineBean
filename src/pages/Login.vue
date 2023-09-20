<template>
    <div class="flex items-center justify-center home  mt-32 sm:mt-20  ">
        <div  v-if="showRegistrationSuccess"  class="alert alert-success fixed-bottom-alert">
            註冊成功！請登入。
        </div>
        <div v-if="errorMessage" class="alert alert-danger fixed-bottom-alert">
    {{ errorMessage }}
</div>

        <div class="container w-auto shadow-2xl flex flex-col rounded-l-md max-sm:rounded-none sm:flex-row">
            <div class="left bg-white flex items-center justify-center w-auto rounded max-sm:rounded-none">
                <div class="w-full md:mt-0 sm:max-w-md xl:p-0">
                    <div class="p-6 space-y-4 md:space-y-6">
                        <p class="text-4xl font-black leading-tight tracking-tight text-gray-900">
                            登入
                        </p>
                        <form @submit.prevent="handleLogin">
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
                        <div class="flex items-center justify-between pt-5 pb-5">
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
                    </form>
                        </div>
                       
                </div>
            </div>
        </div>
       

    </div>
</template>

<script>


import { ref, onMounted } from 'vue';

import { useAuthStore } from '../store/auth.js'; // 引入我們的 auth store


export default {
    name: 'Login',
    setup() {
        const authStore = useAuthStore();
        const errorMessage = ref('');

        const credentials = ref({
            identifier: '',
            password: ''
        });

        const handleLogin = async () => {
            try {
                const { identifier, password } = credentials.value;
                await authStore.login(identifier, password); // Here, you might want to check the result, if the login method in the store returns anything
            } catch (error) {
                errorMessage.value = '登錄過程中出現錯誤: ' + error.message;
                  // 5秒後隱藏錯誤消息
        setTimeout(() => {
            errorMessage.value = '';
        }, 2000); // 5000毫秒 = 5秒
            }
        };

        onMounted(() => {
            if (authStore.registrationSuccess) {
                setTimeout(() => {
                    authStore.setRegistrationSuccess(false);
                }, 1000);
            }
        });

        return {
            credentials,
            handleLogin,
            showRegistrationSuccess: authStore.registrationSuccess,
            errorMessage  // Include this in the return object
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


.fixed-bottom-alert {
    position: fixed;
    bottom: 30px;  /* 距離網頁底部的距離 */
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;  /* 確保它在其他元素的上方 */
    padding: 10px 20px;
    background-color: rgb(187 247 208 );
    color: #000000;  /* 只是一個建議的文字顏色 */
    border: 1px solid rgb(187 247 208 );
    border-radius: 4px;
width:50vw;
}
p,
input,
label {
    font-family: CUBIC;
}
</style>
  
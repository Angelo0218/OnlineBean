<template>
    <div class="flex items-center justify-center home  mt-32 sm:mt-20  ">
        <div v-if="showRegistrationSuccess" class="alert alert-success fixed-bottom-alert">
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
                                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 pt-2">密碼</label>
                                <input type="password" name="password" id="password" placeholder="••••••••"
                                    v-model="credentials.password"
                                    class="border text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            </div>

                            <!-- 註冊路由-->
                            <div class="pt-2">

                                <label class="  text-gray-900">還沒註冊嗎? <router-link to="register"
                                        class='text-blue-700'>點我</router-link>
                                </label>
                            </div>


                            <!-- 登入按鈕 -->
                            <button @click="handleLogin"
                                class="btn w-full focus:ring-4 mt-5 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">登入</button>
                        </form>
                    </div>

                </div>
            </div>
        </div>


    </div>
</template>

<script>


import { ref, onMounted } from 'vue';

import { useAuthStore } from '../../store/auth.js'; // 引入我們的 auth store
import router from '../../router/router';


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
            const { identifier, password } = credentials.value;

            // 檢查是否所有欄位都已填寫
            if (!identifier.trim() || !password.trim()) {
                errorMessage.value = '使用者名稱和密碼不能為空';
                return; // 早期返回，不進行後續處理
            }

            try {
                await authStore.login(identifier, password); // 登入邏輯
                // 登入成功後的邏輯（如果需要）
            } catch (error) {
                errorMessage.value = '登錄過程中出現錯誤: ' + error.message;
                setTimeout(() => {
                    errorMessage.value = '';
                }, 5000); // 5秒後隱藏錯誤消息
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
            errorMessage
        };
    },
    components: { router }
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
    bottom: 30px;
    /* 距離網頁底部的距離 */
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    /* 確保它在其他元素的上方 */
    padding: 10px 20px;
    background-color: rgb(187 247 208);
    color: #000000;
    /* 只是一個建議的文字顏色 */
    border: 1px solid rgb(187 247 208);
    border-radius: 4px;
    width: 50vw;
}

p,
input,
label {
    font-family: CUBIC;
}
</style>
  
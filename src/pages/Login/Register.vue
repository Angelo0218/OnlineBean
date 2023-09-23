<template>
    <form @submit.prevent="register">
        <div class="flex items-center justify-center home  mt-32 sm:mt-20    ">
            <div v-if="errorMessage" class="alert alert-danger fixed-bottom-alert">
                {{ errorMessage }}
            </div>

            <div class="container w-auto shadow-2xl flex flex-col rounded-l-md max-sm:rounded-none sm:flex-row">
                <div class="left bg-white flex items-center justify-center w-auto rounded max-sm:rounded-none">
                    <div class="w-full md:mt-0 sm:max-w-md xl:p-0">
                        <div class="p-6 space-y-4 md:space-y-6">
                            <p class="text-4xl font-black leading-tight tracking-tight text-gray-900">
                                註冊
                            </p>

                            <!-- 使用者名稱 -->
                            <div>
                                <label for="username" class="block mb-2 text-sm font-medium text-gray-900">
                                    使用者名稱
                                </label>
                                <input type="text" name="username" @input="errorMessage = ''" id="username"
                                    v-model="username"
                                    class="bg-gray-50 border text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            </div>

                            <!-- 電子郵件 -->
                            <div>
                                <label for="email" class="block mb-2 text-sm font-medium text-gray-900">
                                    電子郵件
                                </label>
                                <input type="email" name="email" id="email" v-model="email" @input="errorMessage = ''"
                                    class="bg-gray-50 border text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            </div>

                            <!-- 密碼 -->
                            <div>
                                <label for="password" class="block mb-2 text-sm font-medium text-gray-900">密碼
                                    (至少6個字符)</label>
                                <input type="password" name="password" id="password" placeholder="••••••••"
                                    @input="errorMessage = ''" v-model="password"
                                    class="border text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            </div>
                            <!-- 同意使用条例的复选框 -->
                            <div class="agree-terms">
                                <input type="checkbox" id="agreeTerms" v-model="agreeTerms" @change="errorMessage = ''">
                                <label for="agreeTerms" class="ml-2 text-gray-900">我已閱讀並同意<a href="#" class=" text-blue-700"
                                        @click.prevent="viewTerms">使用條例</a></label>
                            </div>

                            <!-- 注册按钮 -->
                            <input type="submit" :disabled="!agreeTerms" @input="errorMessage = ''"
                                class="btn w-full focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                value="註冊">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth.js';

export default {
  name: 'Register',
  setup() {
    const router = useRouter();
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const agreeTerms = ref(false); // 新增的复选框模型

    async function register() {
      if (!agreeTerms.value) {
        errorMessage.value = '您必須同意使用條例才能註冊';
        return;
      }
    }
    function viewTerms() {
      router.push('/terms'); // 跳转到条款页面
    }
        async function register() {
            try {
                // 獲取表單字段的值
                const usernameValue = username.value;
                const emailValue = email.value;
                const passwordValue = password.value;

                // 檢查表單是否填寫完整
                if (!usernameValue || !emailValue || !passwordValue) {
                    console.error('請填寫所有信息');
                    return;
                }

                // 發送註冊請求
                const response = await axios.post('http://angelo0218-server.ddns.net:3000/register', {
                    username: usernameValue,
                    email: emailValue,
                    password: passwordValue,
                });

                if (response.status === 200) {
                    const authStore = useAuthStore();
                    authStore.setRegistrationSuccess(true);
                    router.push('/login');
                }
            } catch (error) {
                errorMessage.value = error.response.data; // 使用伺服器返回的錯誤消息更新 errorMessage

                // 5秒後隱藏錯誤消息
                setTimeout(() => {
                    errorMessage.value = '';
                }, 2000); // 5000毫秒 = 5秒
            }

        }



        return {
            username,
            email,
            password,
            register,
            errorMessage,
            agreeTerms, // 传递复选框模型
      viewTerms // 传递查看条款的函数
        };
    },
};
</script>


<style scoped>
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

.overlay {
    position: fixed;
    top: -25px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.overlay-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
}
.agree-terms {
  margin-top: 1rem;
  display: flex;
  align-items: center;
}</style>

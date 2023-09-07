<template>
    <form @submit.prevent="register">
        <div class="flex items-center justify-center home  mt-32 sm:mt-20    ">
            <div class="container w-auto shadow-2xl flex flex-col rounded-l-md max-sm:rounded-none sm:flex-row">
                <div class="left bg-white flex items-center justify-center w-auto rounded max-sm:rounded-none">
                    <div class="w-full md:mt-0 sm:max-w-md xl:p-0">
                        <div class="p-6 space-y-4 md:space-y-6">
                            <p class="text-3xl font-black leading-tight tracking-tight text-gray-900">
                                註冊
                            </p>

                            <!-- 使用者名稱 -->
                            <div>
                                <label for="username" class="block mb-2 text-sm font-medium text-gray-900">
                                    使用者名稱
                                </label>
                                <input type="text" name="username" id="username"
                                    v-model="username"
                                    class="bg-gray-50 border text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            </div>

                            <!-- 電子郵件 -->
                            <div>
                                <label for="email" class="block mb-2 text-sm font-medium text-gray-900">
                                    電子郵件
                                </label>
                                <input type="email" name="email" id="email"
                                    v-model="email"
                                    class="bg-gray-50 border text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            </div>

                            <!-- 密碼 -->
                            <div>
                                <label for="password" class="block mb-2 text-sm font-medium text-gray-900">密碼
                                    (至少8個字符，且包含大小寫英文)</label>
                                <input type="password" name="password" id="password" placeholder="••••••••"
                                    v-model="password"
                                    class="border text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            </div>

                            <input type="submit"
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
import '../index.css';
import { useRouter } from 'vue-router'; // 导入 useRouter

export default {
    name: 'Register',
    setup() {
        const router = useRouter(); // 使用 useRouter 获取 router 对象
        const username = ref('');
        const email = ref('');
        const password = ref('');

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
                const response = await axios.post('http://192.168.0.41:3000/register', {
                    username: usernameValue,
                    email: emailValue,
                    password: passwordValue,
                });

                if (response.status === 200) {
                    // 註冊成功，執行相應操作，例如導航到登錄頁面
                    // 使用 router.push 进行导航
                    router.push('/login');
                } else {
                    // 註冊失敗，顯示錯誤消息或執行其他操作
                    console.error('註冊失敗:', response.data);
                }
            } catch (error) {
                console.error('Error during registration:', error);
            }
        }

        return {
            username,
            email,
            password,
            register,
        };
    },
};
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
</style>

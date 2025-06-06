<template>
    <form @submit.prevent="register">
        <div class="flex items-center justify-center home  mt-32 sm:mt-20    ">
            <div v-if="errorMessage" class="alert alert-danger text-red fixed-bottom-alert">
                {{ errorMessage }}
            </div>

            <div class="container w-auto shadow-2xl flex flex-col rounded-l-md max-sm:rounded-none sm:flex-row">
                <div class="left bg-white flex items-center justify-center w-auto rounded max-sm:rounded-none">
                    <div class="w-full md:mt-0 sm:max-w-md xl:p-0">
                        <div class="p-6 space-y-4 md:space-y-6">
                            <p class="text-4xl font-black leading-tight tracking-tight text-gray-900">
                                註冊
                            </p>
                            <div>
                                <label for="profilePicture" class="block mb-2 text-sm font-medium text-gray-900">
                                    大頭貼 (選填)
                                </label>
                                <input type="file" id="profilePicture" @change="handleFileChange"
                                    class="bg-gray-50 border text-gray-900 sm:text-sm rounded-lg block w-full p-2.5">
                                <div v-if="previewImage" class="mt-2">
                                    <img :src="previewImage" class="rounded-full w-24 h-24 object-cover">
                                </div>
                                <div v-if="fileErrorMessage" class="alert alert-danger fixed-bottom-alert">
                                    {{ fileErrorMessage }}
                                </div>
                            </div>

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
                                <label for="agreeTerms" class="ml-2 text-gray-900">我已閱讀並同意<a href="#" target="_blank"
                                        class=" text-blue-700" @click.prevent="viewTerms">使用條例</a></label>
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
        const agreeTerms = ref(false);
        const previewImage = ref(null);
        const fileErrorMessage = ref('');

        function handleFileChange(event) {
            const file = event.target.files[0];
            const validTypes = ['image/jpeg', 'image/png'];

            if (file && validTypes.includes(file.type)) {
                previewImage.value = URL.createObjectURL(file);
            } else if (file) {
                event.target.value = ''; // 重置文件輸入欄位
                previewImage.value = null; // 清除現有的預覽
                fileErrorMessage.value = '只允許上傳 JPG、JPEG、PNG 格式的圖片';
                setTimeout(() => {
                    fileErrorMessage.value = '';
                }, 3000);
            } else {
                previewImage.value = null;
            }
        }

        async function register() {
            if (!agreeTerms.value) {
                errorMessage.value = '您必須同意使用條例才能註冊';
                return;
            }

            try {
                const formData = new FormData();
                formData.append('username', username.value);
                formData.append('email', email.value);
                formData.append('password', password.value);

                const fileInput = document.getElementById('profilePicture');
                if (fileInput && fileInput.files.length > 0) {
                    formData.append('avatar', fileInput.files[0]);
                }

                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await axios.post(`${apiUrl}/register`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 200) {
                    const authStore = useAuthStore();
                    authStore.setRegistrationSuccess(true);
                    router.push('/login');
                }
            } catch (error) {
                errorMessage.value = error.response.data;
                setTimeout(() => {
                    errorMessage.value = '';
                }, 2000);
            }
        }

        function viewTerms() {
            router.push('/terms');
        }

        return {
            username,
            email,
            password,
            register,
            errorMessage,
            agreeTerms,
            viewTerms,
            previewImage,
            fileErrorMessage,
            handleFileChange
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

.rounded-full {
    border-radius: 50%;
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
}

.alert-danger {
    color: red;
}
</style>

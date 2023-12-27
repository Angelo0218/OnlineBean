<template>
    <div class="container">
        <div class="user-card">
            <div v-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
            </div>
            <div v-if="successMessage" class="alert alert-success">
                {{ successMessage }}
            </div>
            <div class="header">
                <span class="title">用戶資訊</span>
                <button @click="toggleEdit" class="edit-button">{{ editing ? '取消' : '編輯' }}</button>
            </div>
            <div class="content">
                <div v-if="editing">
                    <div class="info">
                        <label class="label">更改大頭貼:</label>
                        <input type="file" @change="handleAvatarChange">
                    </div>
                    <img :src="previewAvatar" alt="預覽" v-if="previewAvatar" class="avatar-preview">
                    <div class="info">
                        <label class="label">新用戶名:</label>
                        <input v-model="newUsername" placeholder="新用戶名">
                    </div>
                    <div class="info">
                        <label class="label">新電子郵件:</label>
                        <input v-model="newEmail" placeholder="新電子郵件" type="email">
                    </div>
                    <div class="info">
                        <label class="label">新密碼:</label>
                        <input v-model="newPassword" placeholder="新密碼" type="password">
                    </div>
                    <div class="info">
                        <label class="label">當前密碼<br>（確認更改）:</label>
                        <input v-model="password" placeholder="當前密碼" type="password">
                    </div>
                    <button @click="updateUserInfo" class="save-button">保存更改</button>
                </div>
                <div v-else>
                    <div class="info">
                        <span class="label">用戶名:</span>
                        <span class="value">{{ username }}</span>
                    </div>
                    <div class="info">
                        <span class="label">電子郵件:</span>
                        <span class="value">{{ email }}</span>
                    </div>
                    <div class="info">
                        <span class="label">用戶角色:</span>
                        <span class="value">{{ roleInChinese }}</span>
                    </div>
                    <div class="info">
                        <span class="label">建立時間:</span>
                        <span class="value">{{ formattedCreationDate }}</span>
                    </div>
                    <div class="info">
                        <img :src="avatar" alt="大頭貼" class="avatar-image">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { ref, watchEffect, computed } from 'vue';
import { useAuthStore } from '../../store/auth.js';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        const apiUrl = import.meta.env.VITE_API_URL;
        const authStore = useAuthStore();
        const redirectCountdown = ref(0);
        const username = ref(authStore.username);
        const email = ref(authStore.email);
        const role = ref(authStore.role);
        const creationDate = ref(authStore.creationDate);
        const avatar = ref(authStore.avatar);

        const editing = ref(false);
        const newUsername = ref('');
        const newEmail = ref('');
        const newPassword = ref('');
        const password = ref('');
        const previewAvatar = ref(null);
        const errorMessage = ref(''); // 新增錯誤訊息狀態
        const successMessage = ref('');

        watchEffect(() => {
            if (!editing.value) {
                newUsername.value = '';
                newEmail.value = '';
                newPassword.value = '';
                password.value = '';
                previewAvatar.value = null;
            }
        });

        const roleInChinese = computed(() => {
            switch (role.value) {
                case 'admin': return '管理員';
                case 'authorized_user': return '白金用戶';
                default: return '普通用戶';
            }
        });

        const formattedCreationDate = computed(() => {
            if (creationDate.value) {
                const date = new Date(creationDate.value);
                return date.toLocaleDateString('zh-hant', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });
            }
            return '';
        });

        function handleAvatarChange(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                previewAvatar.value = URL.createObjectURL(file);
            }
        }

        const toggleEdit = () => {
            editing.value = !editing.value;
        };

        const updateUserInfo = async () => {
            try {
                const formData = new FormData();
                formData.append('currentPassword', password.value);
                if (newUsername.value) formData.append('newUsername', newUsername.value);
                if (newEmail.value) formData.append('newEmail', newEmail.value);
                if (newPassword.value) formData.append('newPassword', newPassword.value);
                if (previewAvatar.value) {
                    const fileInput = document.querySelector('input[type="file"]');
                    if (fileInput.files[0]) {
                        formData.append('avatar', fileInput.files[0]);
                    }
                }

                const response = await axios.post(`${apiUrl}/updateUserInfo`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.status === 200) {
                    successMessage.value = '用戶信息更新成功！';
                    errorMessage.value = '';

                    // 如果用戶名、電子郵件或密碼被更改，則登出用戶並跳轉到登入頁面
        
                    if (newUsername.value || newEmail.value || newPassword.value) {
                        successMessage.value = '用戶信息更新成功！將在 3 秒後重新登入。';
                        redirectCountdown.value = 3; // 設定倒數計時

                        // 每秒更新一次倒數計時器
                        const intervalId = setInterval(() => {
                            redirectCountdown.value--;
                            if (redirectCountdown.value <= 0) {
                                clearInterval(intervalId);
                                authStore.logout();
                                router.push('/login');
                            }
                        }, 1000);
                    } else {
                        await authStore.fetchCurrentUser();
                        avatar.value = authStore.avatar;  // 更新大頭貼路徑
                        editing.value = false;
                    }
                }
            } catch (error) {
                errorMessage.value = error.response ? error.response.data : error.message;
                console.error('更新失敗:', error);
            }
        };



        return {
            username,
            email,
            role, creationDate, avatar,
            roleInChinese, formattedCreationDate, editing,
            newUsername, newEmail, password, newPassword,
            previewAvatar, handleAvatarChange, updateUserInfo, toggleEdit,
            errorMessage, successMessage,redirectCountdown
        };
    }
}
</script>



<style scoped>
/* 在這裡加入您的樣式 */
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
}

.alert-success {
    padding: 10px;
    background-color: #d4edda;
    color: #155724;
    border-radius: 5px;
    margin-bottom: 15px;
}

.user-card {
    background-color: #272626;
    padding: 20px;
    color: #fff;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.title {
    font-size: 24px;
    font-weight: 600;
}

.edit-button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.edit-button:hover {
    background-color: #0056b3;
}

.content {
    margin-top: 20px;
}

.info {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.icon {
    font-size: 20px;
    margin-right: 10px;
}

.label {
    font-weight: 600;
    min-width: 100px;
}

.value {
    font-weight: 400;
}

input {
    padding: 10px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    width: 100%;
}

.action-buttons {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

.alert-danger {
    padding: 10px;
    background-color: #f8d7da;
    color: #721c24;
    border-radius: 5px;
    margin-bottom: 15px;
}

.save-button {
    background-color: #28a745;
    color: #fff;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.save-button:hover {
    background-color: #218838;
}

.avatar-image,
.avatar-preview {
    width: 100px;
    /* 設定大小 */
    height: 100px;
    /* 設定大小 */
    border-radius: 50%;
    /* 圓形 */
    object-fit: cover;
    /* 確保圖片適當填充 */
}
</style>

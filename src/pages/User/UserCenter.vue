<template>
    <div class="container">
        <div class="user-card">
            <div class="header">
                <span class="title">用戶資訊</span>
                <button @click="editing = !editing" class="edit-button">{{ editing ? '取消' : '編輯' }}</button>
            </div>
            <div class="content">
                <div class="info" v-if="role">
                    <span class="icon"> &#128081;</span>
                    <span class="label">用戶角色:</span>
                    <span class="value">{{ roleInChinese }}</span>
                </div>
                <div class="info" v-if="username">
                    <span class="icon">&#128100;</span>
                    <span class="label">用戶名:</span>
                    <span class="value" v-if="!editing">{{ username }}</span>
                    <input v-if="editing" v-model="newUsername" placeholder="新用戶名" />
                </div>
                <div class="info" v-if="email">
                    <span class="icon">&#9993;</span>
                    <span class="label">電子郵件:</span>
                    <span class="value" v-if="!editing">{{ email }}</span>
                    <input v-if="editing" v-model="newEmail" placeholder="新電子郵件" type="email" />
                </div>
                <div v-if="editing" class="info">
                    <span class="icon">&#128274;</span>
                    <span class="label">當前密碼:</span>
                    <input v-model="password" placeholder="輸入當前密碼以確認更改" type="password" />
                </div>
                <div v-if="editing" class="info">
                    <span class="icon">&#128274;</span>
                    <span class="label">新密碼:</span>
                    <input v-model="newPassword" placeholder="輸入新密碼" type="password" />
                </div>
                <div class="info" v-if="creationDate">
                    <span class="icon">🖋️</span>
                    <span class="label">建立時間:</span>
                    <span class="value">{{ formattedCreationDate }}</span>
                </div>
                <div v-if="editing" class="action-buttons">
                    <button @click="updateUserInfo" class="save-button">保存</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watchEffect, computed } from 'vue';
import { useAuthStore } from '../../store/auth.js';
import axios from 'axios';
import router from '../../router/router';

export default {
    setup() {
        const apiUrl = import.meta.env.VITE_API_URL;
        const authStore = useAuthStore();
        const username = ref(authStore.username);
        const email = ref(authStore.email);
        const role = ref(authStore.role);
        const creationDate = ref(authStore.creationDate);
        const editing = ref(false);
        const newUsername = ref(authStore.username);
        const newEmail = ref(authStore.email);
        const password = ref('');
        const newPassword = ref('');
        const { logout } = useAuthStore();
        watchEffect(() => {
            username.value = authStore.username;
            email.value = authStore.email;
            role.value = authStore.role;
            creationDate.value = authStore.creationDate;
        });


        const roleInChinese = computed(() => {
            switch (role.value) {
                case 'admin':
                    return '管理員';
                case 'authorized_user':
                    return '白金用戶';
                case 'regular_user':
                    return '普通用戶';
            }
        });

        const formattedCreationDate = computed(() => {
            if (creationDate.value) {
                const date = new Date(creationDate.value);
                try {
                    const formatted = date.toLocaleDateString('zh-hant', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    });
                    return formatted;
                } catch (error) {
                    console.error("Error formatting date:", error);
                }
            }
            return '';
        });

        const updateUserInfo = async () => {
            try {
                // 前端驗證
                if (!newPassword.value || newPassword.value.length < 6) {
                    throw new Error('新密碼至少需要6個字符');
                }
                if (!newEmail.value || !/^\S+@\S+\.\S+$/.test(newEmail.value)) {
                    throw new Error('請輸入有效的電子郵件地址');
                }
                if (!password.value) {
                    throw new Error('請輸入當前密碼');
                }
                if (!newUsername.value) {
                    throw new Error('請輸入新用戶名');
                }

                // 發送POST請求到後端
                const response = await axios.post(`${apiUrl}/updateUserInfo`, {
                    password: password.value,
                    email: newEmail.value,
                    newPassword: newPassword.value,
                    newUsername: newUsername.value,
                });

                // 檢查響應並給出適當的提示
                if (response.status === 200) {
                    alert('用戶信息更新成功！');
                    editing.value = false; // 關閉編輯模式
                    await logout(); // 登出
                    router.push('/login');
                }
            } catch (error) {
                // 處理來自後端的錯誤響應
                if (error.response) {
                    // 從後端獲取錯誤信息
                    const errorMessage = error.response.data || '更新用戶信息時發生未知錯誤';
                    alert(`錯誤: ${errorMessage}`);
                } else {
                    // 處理其他錯誤（如網路問題或前端驗證錯誤）
                    alert(`錯誤: ${error.message}`);
                }
            }
        };


        return {
            username,
            email,
            role,
            creationDate,
            roleInChinese,
            formattedCreationDate,
            editing,
            newUsername,
            newEmail,
            password,
            newPassword,
            updateUserInfo,
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

.user-card {
    background-color: #272626;
    padding: 20px;
    color: #fff;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 500px;
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
</style>

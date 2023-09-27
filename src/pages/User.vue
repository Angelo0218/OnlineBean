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
                    <span class="label">密碼:</span>
                    <input v-model="password" placeholder="輸入密碼以確認更改" type="password" />
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
import { useAuthStore } from '../store/auth.js';
import axios from 'axios'; 
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
                    const formatted = date.toLocaleDateString('zh-CN', {
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
                // 檢查用戶輸入
                if (!password.value) {
                    throw new Error('請輸入當前密碼');
                }
                if (!newEmail.value) {
                    throw new Error('請輸入新的電子郵件地址');
                }
                if (!newPassword.value) {
                    throw new Error('請輸入新密碼');
                }
                
                // 發送POST請求到後端更新用戶信息
                const response = await axios.post(`${apiUrl}/updateUserInfo`, {
                    password: password.value,
                    email: newEmail.value,
                    newPassword: newPassword.value,
                });

                // 檢查響應並給出適當的提示
                if (response.status === 200) {
                    console.log('用戶信息更新成功！');
                    // 在這裡，您可以添加其他處理，例如顯示一個成功消息，重定向到其他頁面等。
                }
            } catch (error) {
                console.error('更新用戶信息出錯', error);
                // 在這裡，您可以添加錯誤處理，例如顯示一個錯誤消息給用戶。
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
            updateUserInfo,
        };
    }
}
</script>

<style scoped>
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;

}

.user-card {
    background-color: #ffffff; /* 設定卡片背景顏色 */
    color: #333333; /* 設定文字顏色 */
    border-radius: 15px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.1); /* 調整陰影效果 */
    max-width: 400px;
    width: 100%;
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
    padding: 20px; /* 增加內間距 */
}

.header {
    display: flex;
    justify-content: space-between; /* 使標題和編輯按鈕分開 */
    align-items: center;
    margin-bottom: 20px; /* 增加下間距 */
}

.title {
    font-size: 28px;
    font-weight: 700;
}

.edit-button {
    background-color: #48bb78; /* 設定按鈕背景顏色 */
    color: #ffffff; /* 設定按鈕文字顏色 */
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
}

.edit-button:hover {
    background-color: #38a169; /* 設定按鈕懸停背景顏色 */
}

.info {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.icon {
    font-size: 24px;
    margin-right: 10px;
    color: #48bb78;
}

.label {
    font-weight: 600;
}

.value, input {
    font-weight: 400;
    margin-left: 5px;
}

input {
    padding: 5px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
}

.action-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px; /* 增加上間距 */
}

.save-button {
    background-color: #48bb78;
    color: #ffffff;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
}

.save-button:hover {
    background-color: #38a169;
}
</style>

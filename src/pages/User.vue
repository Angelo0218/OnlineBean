<template>
    <div class="container ">
        <div class="user-card">
            <div class="header">
                <span class="title">用戶資訊</span>
            </div>
            <div class="content">
                <div class="info" v-if="userLevel">
                    <span class="icon">	&#128081;</span> <!-- 星星圖標 -->
                    <span class="label">會員等級:</span>
                    <span class="value">{{ userLevel }}</span>
                </div>
                <div class="info" v-if="username">
                    <span class="icon">&#128100;</span> <!-- 用戶圖標 -->
                    <span class="label">用戶名:</span>
                    <span class="value">{{ username }}</span>
                </div>
                <div class="info" v-if="email">
                    <span class="icon">&#9993;</span> <!-- 郵件圖標 -->
                    <span class="label">電子郵件:</span>
                    <span class="value">{{ email }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watchEffect } from 'vue';
import { useAuthStore } from '../store/auth.js';

export default {
    setup() {
        const authStore = useAuthStore();
        const username = ref(authStore.username);
        const email = ref(authStore.email);
        const userLevel = ref(authStore.userLevel);
        watchEffect(() => {
            username.value = authStore.username;
            email.value = authStore.email;
            userLevel.value = authStore.userLevel;
        });

        return {
            username,
            email,
            userLevel
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
    margin-top: 0; /* 调整顶部边距 */
}

@media screen and (max-width: 640px) {
    .container {
        align-items: start;
        margin-top:20%; /* 移动端设备上调整顶部边距 */
        padding: 10px; /* 增加一些填充，以防止卡片贴近边缘 */
    }

    .user-card {
        border-radius: 10px; /* 调整边框半径 */
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2); /* 调整阴影效果 */
    }

    .title {
        font-size: 22px; /* 调整字体大小 */
    }

    .icon {
        font-size: 20px; /* 调整图标大小 */
    }

    .info {
        margin-bottom: 10px; /* 调整信息块的底部边距 */
    }

    .content {
        padding: 15px; /* 调整内容区域的填充 */
    }
}

.user-card {
    background-color: #1a202c;
    color: #e2e8f0;
    border-radius: 15px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    width: 100%;
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
}

.header {
    background-color: #2d3748;
    padding: 20px;
    position: relative;
}

.title {
    font-size: 28px;
    font-weight: 700;
}

.content {
    padding: 20px;
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

.value {
    font-weight: 400;
    margin-left: 5px;
}
</style>


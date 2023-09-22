<template>
    <div class="container pt-20">
        <div class="user-card">
            <div class="header">
                <span class="title">用戶資訊</span>
            </div>
            <div class="content">
                <div class="info" v-if="username">
                    <span class="label">用戶名:</span>
                    <span class="value">{{ username }}</span>
                </div>
                <div class="info" v-if="email">
                    <span class="label">電子郵件:</span>
                    <span class="value">{{ email }}</span>
                </div>
                <div class="info"></div>
                <span class="label">會員等級:</span>
                <span class="value"></span>
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
        watchEffect(() => {
            username.value = authStore.username;
            email.value = authStore.email;
        });

        return {
            username,
            email,
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
    background-color: #1a202c;
    color: #e2e8f0;
    border-radius: 15px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    width: 100%;
    overflow: hidden;
}

.header {
    background-color: #2d3748;
    padding: 20px;
}

.title {
    font-size: 24px;
    font-weight: 700;
}

.content {
    padding: 20px;
}

.info {
    margin-bottom: 15px;
}

.label {
    font-weight: 600;
}

.value {
    font-weight: 400;
    margin-left: 10px;
}</style>

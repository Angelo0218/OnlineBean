<template>
    <header>
        <nav class="navbar bg-base-100">
            <div class="navbar-start ">
                <a class="btn btn-ghost normal-case text-xl flex items-center max-sm:hidden">
                    <span class="mr-2 "><img src="../assets/Logo.ico" style="width:20px; height:20px;" alt="Logo"></span>
                    ONlineBean
                </a>
                <div class="dropdown">
                    <label tabindex="0" class="btn btn-ghost sm:hidden">
                        <i class="fa-solid fa-bars"></i>
                    </label>
                    <ul tabindex="0"
                        class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><router-link to="/">首頁</router-link></li>
                        <li><router-link to="/plants">線上養殖</router-link></li>
                        <li><router-Link to="/about">關於我們</router-link></li>
                    </ul>
                </div>
            </div>
            <div class="navbar-center max-sm:hidden lg:flex">
                <ul class="menu menu-horizontal px-1">
                    <li><router-link to="/">首頁</router-link></li>
                    <li><router-link to="/plants">線上養殖</router-link></li>
                    <li><router-Link to="/about">關於我們</router-link></li>
                </ul>
            </div>
            <div class="navbar-end">
                <div class="btn-group" v-if="!isAuthenticated">
                    <router-link to="/register" class="btn btn-primary">註冊</router-link>
                    <router-link to="/login" class="btn btn-ghost ml-2">登入</router-link>
                </div>

                <div v-else>
                    <router-link to="/user" class="btn btn-ghost" @mouseover="showUserLevel = true" @mouseleave="showUserLevel = false">
                        <span v-show="!showUserLevel">{{ username }}</span>
                        <span class="user-level" v-show="showUserLevel">
                            <i class="fa fa-star"></i>
                            <span class="text-xs">會員等級:</span> <span class="text-xs">{{ userLevel }}</span>
                        </span>
                    </router-link>
                    <button class="btn btn-primary ml-2" @click="handleLogout">登出</button>
                </div>
            </div>
        </nav>
    </header>
</template>

<script>
import { ref, watchEffect } from 'vue';
import { useAuthStore } from '../store/auth.js';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const authStore = useAuthStore();
        const isAuthenticated = ref(authStore.isAuthenticated);
        const router = useRouter();
        const username = ref(authStore.username);
        const userLevel = ref(authStore.userLevel);
        const showUserLevel = ref(false); // 初始化為 false

        watchEffect(() => {
            isAuthenticated.value = authStore.isAuthenticated;
            username.value = authStore.username;
            userLevel.value = authStore.userLevel;
        });

        const handleLogout = () => {
            authStore.logout();
            router.push('/login');
        }

        return {
            username,
            handleLogout,
            isAuthenticated,
            userLevel,
            showUserLevel // 添加這一行
        };
    }
}
</script>
<style scoped>
.navbar {

    position: fixed;
    top: 0;
    left: 0;
    /* 確保導航欄從屏幕左側開始 */
    width: 100%;
    /* 確保導航欄橫跨整個屏幕的寬度 */
    z-index: 1000;
    /* 確保導航欄始終在其他內容之上 */
}

.user-level {
    color: #ffd700;
    /* 改變等級文字顏色為金色 */
    font-weight: bold;
    /* 加粗等級文字 */
    margin-right: 10px;
    /* 增加與下一個元素的間距 */
}
</style>
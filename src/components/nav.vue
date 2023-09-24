<template>
    <header>
        <nav class="navbar bg-base-100">
            <div class="navbar-start ">
                <router-link to="/" class="btn btn-ghost normal-case text-xl flex items-center max-sm:hidden">
                    <span class="mr-2 "><img src="../assets/Logo.ico" style="width:20px; height:20px;" alt="Logo"></span>
                    ONlineBean
                </router-link>
                <div class="dropdown sm:hidden ">
                    <div tabindex="0" class="btn btn-ghost sm:hidden mobile-menu-btn" @click="toggleMobileDropdown">
                        <i class="fa-solid fa-bars "></i>
                    </div>
                    <ul v-show="showMobileDropdown" tabindex="0"
                        class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><router-link to="/" class="menu-item">首頁</router-link></li>
                        <li><router-link to="/plants" class="menu-item">植物商店</router-link></li>
                        <li><router-link to="/Backpack" class="menu-item">植物背包</router-link></li>
                        <li><router-link to="/about" class="menu-item">關於我們</router-link></li>
                    </ul>
                </div>
            </div>
            <div class="navbar-center max-sm:hidden lg:flex">
                <ul class="menu menu-horizontal px-1">
                    <li><router-link to="/">首頁</router-link></li>
                    <li><router-link to="/plants" >植物商店</router-link></li>
                        <li><router-link to="/Backpack" >植物背包</router-link></li>
                    <li><router-Link to="/about">關於我們</router-link></li>
                </ul>
            </div>
            <div class="navbar-end">
                <div class="btn-group" v-if="!isAuthenticated">
                    <router-link to="/register" class="btn btn-primary">註冊</router-link>
                    <router-link to="/login" class="btn btn-ghost ml-2">登入</router-link>
                </div>
                <div v-else>
                    <div @click="toggleDropdown" class="relative mr-3">
                        <button class="btn btn-ghost flex items-center">
                            <span>{{ username }}</span>
                            <i class="fa-solid fa-chevron-down ml-2"></i>
                        </button>

                        <transition name="slide-fade">
                            <div v-if="showDropdown" class="absolute mt-2  w-28 bg-zinc-900 rounded shadow p-2">
                                <router-link to="/user" class="block hover:bg-gray-700 p-2">會員資訊</router-link>
                                <router-link to="/terms" class="block hover:bg-gray-700 p-2">使用條例</router-link>
                                <button @click="handleLogout"
                                    class="block hover:bg-gray-700 p-2 w-full text-start">登出</button>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>
<script>
import { useAuthStore } from '../store/auth.js';
import { watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
export default {

    setup() {
        const authStore = useAuthStore();
        const isAuthenticated = ref(authStore.isAuthenticated);
        const router = useRouter();
        const username = ref(authStore.username);
        const showMobileDropdown = ref(false);
        const toggleMobileDropdown = () => {
            showMobileDropdown.value = !showMobileDropdown.value;
        };
        watchEffect(() => {
            isAuthenticated.value = authStore.isAuthenticated;
            username.value = authStore.username;  
        });






        const handleLogout = () => {
            authStore.logout();
            router.push('/login'); // 重定向到登录页面
        }

        const showDropdown = ref(false);
        const toggleDropdown = () => {
            showDropdown.value = !showDropdown.value;
        };

        return {
            username,
            handleLogout,
            isAuthenticated,
            showDropdown,
            toggleDropdown,
            toggleMobileDropdown,
            showMobileDropdown
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

.dropdown-content {
    position: absolute;
    top: 100%;
    left: 0;
    transform: translateX(-50%);
    display: none;
}
.menu-item {
    display: block;
    padding: 6px;
    text-align: start;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
}

.menu-item:hover, .menu-item:active {
    background-color: #e6e6e6; /* 您可以根据需要调整这个颜色 */
    color: #000;
}

.mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    /* 設置按鈕寬度 */
    height: 50px;
    /* 設置按鈕高度 */
    padding: 10px;
    /* 增加內邊距 */
    margin: 5px;
    /* 增加外邊距 */
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
    /* 添加背景色過渡效果 */
}

.mobile-menu-btn:hover {
    background-color: #f0f0f0;
    /* 鼠標懸停時的背景色 */
}

.icon {
    font-size: 24px;
    /* 設置圖標大小 */
}

.dropdown-content2 {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    display: none;
}

.dropdown {
    position: relative;
}

.dropdown-content {
    position: absolute;
    top: 100%;
    right: 0;
    display: none;
}

.dropdown:hover .dropdown-content,
.dropdown:focus-within .dropdown-content {
    display: block;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all .3s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
    transform: translateY(-20px);
    opacity: 0;
}</style>
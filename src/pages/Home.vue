<template>
  <div class="hero min-h-screen ">
    <div class="hero-content flex-col sm:flex-row-reverse">
      <img src="../assets/tree.png" class="treeimg rounded-lg " />

      <div>
        <h1 class="text-5xl font-bold ">線上養殖</h1>
        <p class="py-6">「線上養殖，無限可能，輕鬆開展！」</p>
        <router-link class="btn btn-lg btn-active btn-accent max-sm:w-5/6 max-sm:ml-5" to="/plants">立即養殖</router-link>
      </div>
    </div>
    <transition name="fade">
      <div v-if="showWelcome && isAuthenticated && isUserLevelLoaded"
        class="bg-green-200 text-amber-800 mt-129 font-extrabold p-4 rounded-xl shadow-md transition-transform duration-300 transform hover:scale-105">
        {{ welcomeMessage }}
      </div>
    </transition>



  </div>
</template>
<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useAuthStore } from '../store/auth.js';

export default {
  setup() {
    const authStore = useAuthStore();
    const showWelcome = ref(authStore.showWelcomeMessage);
    const isUserLevelLoaded = ref(false); // 新增用來追踪用戶等級數據加載狀態的 ref

    const welcomeMessage = computed(() => {
      if (authStore.userLevel >= 90) {
        return '爸爸好！🧛';
      } else {
        return '登入成功歡迎！';
      }
    });

    onMounted(() => {
      // 假設在某一點用戶等級數據會被加載
      // 在數據加載完成後設置 isUserLevelLoaded 為 true
      isUserLevelLoaded.value = true;

      if (showWelcome.value) {
        setTimeout(() => {
          showWelcome.value = false;
        }, 3000);
      }
    });

    onUnmounted(() => {
      authStore.hideWelcomeMessage();
    });

    return {
      isAuthenticated: authStore.isAuthenticated,
      showWelcome,
      welcomeMessage,
      isUserLevelLoaded
    };
  }
}
</script>



<style>
@media screen and (max-width: 644px) {


  h1 {
    text-align: center;
  }

  p {
    text-align: center;
  }


}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
  {
  opacity: 0;
}

.treeimg {
  width: 9rem;

}
</style>



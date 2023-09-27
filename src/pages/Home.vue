<template>
  <div class="hero min-h-screen ">
    <div class="hero-content flex-col sm:flex-row-reverse">
      <img src="../assets/tree.png" class="treeimg rounded-lg " />

      <div>
        <h1 class="text-5xl font-bold ">線上養殖</h1>
        <p class="py-6">「線上養殖，無限可能，輕鬆開展！」</p>
        <router-link class="btn btn-lg btn-active btn-accent max-sm:w-5/6 max-sm:ml-5" to="/Backpack">立即養殖</router-link>
      </div>
    </div>
    <transition name="fade">
      <div v-if="showWelcome && isAuthenticated"
        class="bg-green-200 text-amber-800  fade2 font-extrabold p-4 rounded-xl shadow-md transition-transform duration-300 transform hover:scale-105">
        {{ welcomeMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useAuthStore } from '../store/auth.js';


export default {
  setup() {
    const authStore = useAuthStore();
    const showWelcome = ref(authStore.showWelcomeMessage);
    const isUserLevelLoaded = ref(false); 

    const welcomeMessage = computed(() => {
      if (authStore.role === 'admin') {
        return '尊敬的管理員 歡迎你！';
      } else {
        return '登入成功歡迎！';
      }
    });

    onMounted(() => {
      // 檢查是否存在有效的 token，如果存在，則不顯示歡迎消息
      if (localStorage.getItem('token')) {
        authStore.showWelcomeMessage = false;
      }

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
.fade2{
  position: relative;
  bottom: -30%;

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



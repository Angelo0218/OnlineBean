<template>
  <div class="hero min-h-screen  ">
    <div class="hero-content flex-col sm:flex-row-reverse">
      <img src="../assets/tree.png" class="max-w-xs rounded-lg" />

      <div>
        <h1 class="text-5xl font-bold ">線上養殖</h1>
        <p class="py-6">「線上養殖，無限可能，輕鬆開展！」</p>
        <router-link class="btn btn-lg btn-active btn-accent max-sm:w-5/6 max-sm:ml-5" to="/plants">立即養殖</router-link>
      </div>
    </div>
    <transition name="fade">
      <div  v-if="showWelcomeMessage && isAuthenticated"
           class="bg-green-200 text-amber-800 mt-129   font-extrabold p-4 rounded-xl shadow-md transition-transform duration-300 transform hover:scale-105">
        登入成功歡迎！
      </div>
    </transition>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../store/auth.js';

export default {
  setup() {
    const authStore = useAuthStore();
    const showWelcomeMessage = ref(true);

    onMounted(() => {
      if (authStore.isAuthenticated) {
        setTimeout(() => {
          showWelcomeMessage.value = false;
        }, 3000);  // 3 seconds
      }
    });

    return { 
      isAuthenticated: authStore.isAuthenticated, 
      showWelcomeMessage 
    };
  }
}
</script>

<style>
.hero {
  margin-top: -30px;
}

@media screen and (max-width: 768px) {
  .hero {
    margin-top: -2rem
  }

  h1 {
    text-align: center;
  }

  p {
    text-align: center;
  }


}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

</style>



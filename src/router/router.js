import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { name: '首頁', path: '/', component: () => import('../pages/Home.vue') },
  { name: '註冊', path: '/register', component: () => import('../pages/Login/Register.vue') },
  { name: '登入', path: '/login', component: () => import('../pages/Login/Login.vue') },
  { name: '關於我們', path: '/about', component: () => import('../pages/About.vue') },
  {
    name: '線上養殖',
    path: '/online/:userPlantId',
    component: () => import('../pages/Online.vue'),
    meta: { requiresAuth: true }
  },

  { name: '選擇植物', path: '/Plants', component: () => import('../pages/Plants.vue'), meta: { requiresAuth: true } },
  { name: '植物背包', path: '/Backpack', component: () => import('../pages/Backpack.vue'), meta: { requiresAuth: true } },
  { name: '增加', path: '/Add', component: () => import('../pages/root/Add.vue') },
  { name: '用戶', path: '/User', component: () => import('../pages/User.vue'), meta: { requiresAuth: true } },
  { name: '使用條例', path: '/Terms', component: () => import('../pages/Terms.vue'), },
]
// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes //路由表
})
import { useAuthStore } from '../store/auth.js';

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // 檢查路由是否需要驗證
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 檢查用戶是否已登錄
    if (!authStore.isAuthenticated) {
      // 如果用戶未登錄，則重定向到登錄頁面
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 儲存訪問的頁面路徑，登錄後可以選擇跳轉回該頁面
      });
    } else if (to.path === '/Add' && authStore.username !== 'Angelo0218') {
      // 如果用戶試圖訪問 "/Add" 但用戶名不是 "Angelo0218"
      next('/'); // 重定向到首頁或任何其他你選擇的頁面
    } else {
      next(); // 繼續導航
    }
  } else {
    next(); // 確保一定要調用 next()
  }
});

export default router
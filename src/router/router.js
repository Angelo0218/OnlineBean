import { createRouter, createWebHistory } from "vue-router";
import NotFound from "../pages/404/NotFound.vue";
import axios from "axios";

const routes = [
  { name: "首頁", path: "/", component: () => import("../pages/Home.vue") },
  {
    name: "註冊",
    path: "/register",
    component: () => import("../pages/Login/Register.vue"),
  },
  {
    name: "登入",
    path: "/login",
    component: () => import("../pages/Login/Login.vue"),
  },
  {
    name: "植物社區",
    path: "/forum",
    component: () => import("../pages/forum.vue"),
    meta: { requiresAuth: true },
  },
  {
    name: "關於我們",
    path: "/about",
    component: () => import("../pages/About.vue"),
  },
  {
    name: "選擇植物",
    path: "/Plants",
    component: () => import("../pages/PlantsShop.vue"),
    meta: { requiresAuth: true },
  },
  {
    name: "植物背包",
    path: "/Backpack",
    component: () => import("../pages/Backpack.vue"),
    meta: { requiresAuth: true },
  },
  {
    name: "線上養殖",
    path: "/online/:userPlantId",
    component: () => import("../pages/ChoosePlant/Online.vue"),
    meta: { requiresAuth: true },
  },
  {
    name: "神秘植物",
    path: "/online666",
    component: () => import("../pages/ChoosePlant/Online666.vue"),
    meta: { requiresAuth: true },
  },
  {
    name: "用戶中心",
    path: "/user",
    component: () => import("../pages/User/UserCenter.vue"),
    meta: { requiresAuth: true },
  },
  {
    name: "增加",
    path: "/Add",
    component: () => import("../pages/root/Add.vue"),
    meta: { requiresAuth: true },
  },
  {
    name: "使用條例",
    path: "/Terms",
    component: () => import("../pages/User/Terms.vue"),
  },
  { path: "/:catchAll(.*)", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes, //路由表
});
import { useAuthStore } from "../store/auth.js";

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // 檢查是否需要重新獲取當前用戶資訊
  if (authStore.isAuthenticated && !authStore.username) {
    try {
      await authStore.fetchCurrentUser(); // 嘗試獲取當前用戶資訊
    } catch (error) {
      console.error("Error fetching current user:", error);
      authStore.logout();
      next({ path: "/login" });
      return;
    }
  }

  if (authStore.isAuthenticated) {
    try {

      if (!authStore.justLoggedIn) {
        authStore.showWelcomeMessage = !authStore.welcomeMessageShown;
      }
      authStore.welcomeMessageShown = true;
      authStore.justLoggedIn = false; // 重置 justLoggedIn 状态
    } catch (error) {
      // 如果 token 無效，登出用戶並重定向到登錄頁面
      console.error("Token is invalid:", error);
      authStore.logout();
      next({ path: "/login" });
    }
  } else {
    // 如果用戶未認證，確保不顯示歡迎消息
    authStore.showWelcomeMessage = false;
  }

  const apiUrl = import.meta.env.VITE_API_URL; // 使用 Vite 環境變量
  // console.log("Username:", authStore.username);
  // 檢查路由是否需要驗證
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 檢查用戶是否已登錄
    if (!authStore.isAuthenticated) {
      // 如果用戶未登錄，則跳到登錄頁面
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    } else if (to.path === "/Add" && authStore.username !== "Angelo0218") {
      // 如果用戶名不是Angelo0218
      next({ path: "/:catchAll(.*)" }); // 跳到 404 頁面
    } else if (to.name === "線上養殖") {
      // 如果是訪問 /online/:userPlantId，檢查 userPlantId 是否屬於該用戶
      try {
        const userPlantId = to.params.userPlantId;
        // 使用 apiUrl 與後端溝通檢查 userPlantId
        await axios.get(`${apiUrl}/api/checkUserPlant/${userPlantId}`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        next();
      } catch (error) {
        console.error("錯誤:", error);
        // 如果後端返回錯誤，則重定向到 404 頁面
        next({ path: "/:catchAll(.*)" });
      }
    } else {
      next(); // 繼續導航
    }
  } else {
    next();
  }
});

export default router;

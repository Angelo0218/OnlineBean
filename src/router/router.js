import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { name: '首頁', path: '/', component: () => import('../pages/Home.vue')},
    { name: '登入', path: '/login', component: () => import('../pages/Login.vue')},
    { name: '關於我們', path: '/about', component: () => import('../pages/About.vue')},
    { name: '線上養殖', path: '/online', component: () => import('../pages/Online.vue')},
    { name: '選擇植物', path: '/Plants', component: () => import('../pages/Plants.vue')},              
  ]
// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes //路由表
})
export default router
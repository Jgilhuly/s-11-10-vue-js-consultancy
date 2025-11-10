import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/services/manage',
    name: 'ServicesManagement',
    component: () => import('../views/ServicesManagement.vue')
  },
  {
    path: '/ai-readiness-quiz',
    name: 'AiReadinessQuiz',
    component: () => import('../views/AiReadinessQuiz.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router


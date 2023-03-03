import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '',
          component: () => import('../views/DashboardProducts.vue')
        },
        {
          path: 'products',
          component: () => import('../views/DashboardProducts.vue')
        },
        {
          path: 'orders',
          component: () => import('../views/DashboardOrders.vue')
        }
      ]
    },
    {
      path: '/login',
      name:'login',
      component: () => import('../views/AccountLogin.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router

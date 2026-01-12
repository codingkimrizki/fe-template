import { createRouter, createWebHistory } from 'vue-router'
import TheLayout from '@/layout/TheLayout.vue'
import adminRoutes from '@/router/routes/admin'
import authRoutes from '@/router/routes/auth'
import dashboardRoutes from '@/router/routes/dashboard'
import masterDataRoutes from '@/router/routes/master'
import { authGuard } from './middleware/authGuard'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: TheLayout,
    redirect: { name: 'Machine Dashboard' },
    meta: { breadcrumb: 'Home' },
    children: [
      ...dashboardRoutes,
      ...masterDataRoutes,
      ...adminRoutes,
      {
        path: '/under-construction',
        name: 'Under Construction',
        component: () => import('@/views/pages/MaintenancePage.vue'),
        meta: {
          requiresAuth: true,
          roles: ['admin', 'staff', 'user'],
          breadcrumb: 'Under Construction',
          showInMenu: false, // Explicitly exclude from menu
        },
      },
      {
        path: '/unauthorized',
        name: 'Unauthorized',
        component: () => import('@/views/pages/PageUnauthorized.vue'),
        meta: {
          showInMenu: false, // Explicitly exclude from menu
        },
      },
    ],
  },
  ...authRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/pages/NotFound.vue'),
    meta: {
      showInMenu: false, // Explicitly exclude from menu
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.beforeEach(authGuard)

router.afterEach(() => NProgress.done())

export default router

export default [
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/pages/RegisterPage.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/pages/LoginPage.vue'),
  },
  {
    path: '/forgot-password',
    name: 'Forgot Password',
    component: () => import('@/views/pages/ForgotPassword.vue'),
  },
  {
    path: '/recovery-password',
    name: 'Recovery Password',
    component: () => import('@/views/pages/RecoveryPassword.vue'),
  },
]

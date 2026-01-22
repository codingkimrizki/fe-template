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
  {
    path: '/survey-form',
    name: 'Start Survey',
    component: () => import('@/views/survey/FormSurvey.vue'),
  },
  {
    path: '/question',
    name: 'Question',
    component: () => import('@/views/survey/QuestionPage.vue'),
  },
  {
    path: '/finish',
    name: 'Finish',
    component: () => import('@/views/survey/ThankYou.vue'),
  },
  {
    path: '/qrcode',
    name: 'qrcode',
    component: () => import('@/components/QrcodeGenerator.vue'),
  },
]

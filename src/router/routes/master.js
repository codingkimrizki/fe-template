export default [
  {
    path: '/result',
    name: 'Dashboard',
    redirect: '/',
    meta: {
      breadcrumb: 'Dashboard',
      showInMenu: true,
      title: 'Dashboard',
      icon: 'DatabaseOutlined',
      roles: ['admin', 'staff'],
    },
    children: [
      {
        path: '/',
        name: 'Result',
        component: () => import('@/views/master/machine/MasterMachine.vue'),
        meta: {
          requiresAuth: false,
          roles: ['admin', 'staff'],
          breadcrumb: 'Result',
          showInMenu: true,
          title: 'Result',
        },
      },
    ],
  },
  {
    path: '/survey-form',
    name: 'survey-form',
    component: () => import('@/components/FormSurvey.vue'),
  },
]

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
      roles: ['admin', 'user'],
    },
    children: [
      {
        path: '/',
        name: 'Result',
        component: () => import('@/views/master/machine/MasterMachine.vue'),
        meta: {
          requiresAuth: false,
          roles: ['admin', 'user'],
          breadcrumb: 'Result',
          showInMenu: true,
          title: 'Result',
        },
      },
    ],
  },
]

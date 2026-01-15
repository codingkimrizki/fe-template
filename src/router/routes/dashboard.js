export default [
  {
    path: '/dashboard',
    name: 'Dashboard',
    redirect: '/',
    meta: {
      breadcrumb: 'Dashboard',
      showInMenu: true,
      title: 'Dashboard',
      icon: 'DashboardOutlined',
      roles: ['admin', 'staff', 'user'],
    },
    children: [
      {
        path: '/',
        name: 'Live Monitoring Dashboard',
        component: () => import('@/views/dashboard/machine/MainDashboard.vue'),
        meta: {
          // requiresAuth: true,
          requiresAuth: false,
          roles: ['admin', 'staff', 'user'],
          breadcrumb: 'Live Monitoring',
          showInMenu: true,
          title: 'Live Monitoring',
        },
      },
      {
        path: '/kanagata',
        name: 'Kanagata Dashboard',
        component: () =>
          import('@/views/dashboard/kanagata/KanagataDashboard.vue'),
        meta: {
          // requiresAuth: true,
          requiresAuth: false,
          roles: ['admin', 'staff', 'user'],
          breadcrumb: 'Kanagata',
          showInMenu: true,
          title: 'Kanagata',
        },
      },
      {
        path: '/operator',
        name: 'Operator Dashboard',
        component: () =>
          import('@/views/dashboard/operator/OperatorDashboard.vue'),
        meta: {
          // requiresAuth: true,
          requiresAuth: false,
          roles: ['admin', 'staff', 'user'],
          breadcrumb: 'Operator',
          showInMenu: true,
          title: 'Operator',
        },
      },
      {
        path: '/spareparts',
        name: 'Sparepart',
        component: () =>
          import('@/views/dashboard/sparepart/InventoryPage.vue'),
        meta: {
          title: 'Sparepart',
          breadcrumb: 'Sparepart',
          showInMenu: true,
        },
      },
    ],
  },
]

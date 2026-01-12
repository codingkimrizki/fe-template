export default [
  {
    path: '/admin',
    name: 'Admin',
    redirect: '/user-management',
    meta: {
      breadcrumb: 'Admin',
      showInMenu: true,
      title: 'Admin',
      icon: 'TeamOutlined',
      roles: ['admin'],
    },
    children: [
      {
        path: '/user-management',
        name: 'User Management',
        component: () => import('@/views/admin/user/UserManagement.vue'),
        meta: {
          // requiresAuth: true,
          requiresAuth: false,
          roles: ['admin'],
          breadcrumb: 'User Management',
          showInMenu: true,
          title: 'User Management',
        },
      },
      {
        path: '/device-manager',
        name: 'Device Manager',
        component: () => import('@/views/admin/device/DeviceManager.vue'),
        meta: {
          // requiresAuth: true,
          requiresAuth: false,
          roles: ['admin'],
          breadcrumb: 'Device Manager',
          showInMenu: true,
          title: 'Device Manager',
        },
      },
    ],
  },
]

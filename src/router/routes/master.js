export default [
  {
    path: '/master-data',
    name: 'Master Data',
    redirect: '/master-machine',
    meta: {
      breadcrumb: 'Master Data',
      showInMenu: true,
      title: 'Master Data',
      icon: 'DatabaseOutlined',
      roles: ['admin', 'staff'],
    },
    children: [
      {
        path: '/master-machine',
        name: ' Master Machine',
        component: () => import('@/views/master/machine/MasterMachine.vue'),
        meta: {
          requiresAuth: true,
          roles: ['admin', 'staff'],
          breadcrumb: 'Machine',
          showInMenu: true,
          title: 'Machine',
        },
      },
      {
        path: '/master-kanagata',
        name: ' Master Kanagata',
        component: () => import('@/views/master/kanagata/MasterKanagata.vue'),
        meta: {
          requiresAuth: true,
          roles: ['admin', 'staff'],
          breadcrumb: 'Kanagata',
          showInMenu: true,
          title: 'Kanagata',
        },
      },
      {
        path: '/master-product',
        name: ' Master Product',
        component: () => import('@/views/master/product/MasterProduct.vue'),
        meta: {
          requiresAuth: true,
          roles: ['admin', 'staff'],
          breadcrumb: 'Product',
          showInMenu: true,
          title: 'Product',
        },
      },
      {
        path: '/master-sparepart',
        name: 'Master Sparepart',
        component: () => import('@/views/master/sparepart/MasterSparepart.vue'),
        meta: {
          requiresAuth: true,
          roles: ['admin', 'staff'],
          breadcrumb: 'Sparepart',
          showInMenu: true,
          title: 'Sparepart',
        },
      },
    ],
  },
]

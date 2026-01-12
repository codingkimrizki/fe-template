<template>
  <a-layout-header class="header">
    <a-flex justify="space-between" align="center" style="height: inherit">
      <a-flex gap="middle" align="center">
        <MenuUnfoldOutlined
          v-if="siderStore.collapsed"
          class="trigger"
          @click="toggleSider"
        />
        <MenuFoldOutlined v-else class="trigger" @click="toggleSider" />

        <!-- Breadcrumb - Only show on larger screens -->
        <a-breadcrumb>
          <a-breadcrumb-item
            v-for="(breadcrumb, index) in breadcrumbs"
            :key="index"
          >
            <router-link
              v-if="index !== breadcrumbs.length - 1"
              :to="breadcrumb.path"
            >
              {{ breadcrumb.name }}
            </router-link>
            <span v-else>{{ breadcrumb.name }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </a-flex>

      <!-- Right section - Translate, Date, and User Menu -->
      <a-flex justify="flex-end" gap="middle" align="center">
        <AppNotification v-if="!isMobile" />

        <MenuOutlined
          v-if="isMobile"
          class="trigger"
          @click="drawerStore.toggleDrawer()"
        />

        <a-dropdown>
          <a-button type="dashed" v-show="!isMobile">
            <UserOutlined /> {{ capitalizeEachWord(authStore.user?.name) }}
          </a-button>
          <!-- Show only icon on mobile -->
          <template #overlay>
            <a-menu>
              <a-menu-item @click="drawerStore.toggleDrawer">
                <a-flex justify="space-between">
                  <span>Settings</span>
                  <SettingOutlined />
                </a-flex>
              </a-menu-item>
              <a-menu-item @click="handleLogout">
                <a-flex justify="space-between">
                  <span>Logout</span>
                  <LogoutOutlined />
                </a-flex>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-flex>
    </a-flex>
  </a-layout-header>
</template>

<script setup>
import { ref, watch, onUnmounted, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'
import { useSiderStore } from '@/stores/sidebar'
import { useAuthStore } from '@/stores/auth'
import { useDrawerStore } from '@/stores/drawer'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import AppNotification from '@/components/AppNotification.vue'

// User data
const siderStore = useSiderStore()
const drawerStore = useDrawerStore()
const authStore = useAuthStore()

const isMobile = ref(window.innerWidth <= 950)

const handleResize = () => {
  isMobile.value = window.innerWidth <= 950
}

// Breadcrumbs
const route = useRoute()
const breadcrumbs = ref([])

const getBreadcrumbs = () => {
  const matchedRoutes = route.matched
  return matchedRoutes.map(route => ({
    name: route.meta.breadcrumb || route.name,
    path: route.path,
  }))
}

breadcrumbs.value = getBreadcrumbs()

watch(route, () => {
  breadcrumbs.value = getBreadcrumbs()
})

const handleLogout = async () => {
  await authStore.logout()
}

const toggleSider = () => {
  if (!siderStore.hidden && !siderStore.isMobile) {
    siderStore.toggleCollapse()
  } else {
    siderStore.toggleHidden()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.trigger {
  font-size: large;
}

.trigger:hover {
  opacity: 0.6;
}

.header {
  padding-left: 20px;
  padding-right: 20px;
  background-color: var(--header-bg);
  color: var(--text-color);
}

@media (max-width: 768px) {
  .header {
    padding-left: 10px;
    padding-right: 10px;
  }

  .trigger {
    font-size: 18px;
  }
}
</style>

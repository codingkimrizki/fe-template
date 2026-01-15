<template>
  <a-layout-sider
    collapsible
    :trigger="null"
    v-model:collapsed="siderStore.collapsed"
    :theme="siderTheme"
    class="sider"
    v-show="!siderStore.hidden"
  >
    <a-flex vertical>
      <a-flex align="center" justify="center" class="logo">
        <a-image :width="80" :src="hrs" :preview="false" />
      </a-flex>
      <div class="menu-container">
        <a-menu
          :theme="siderTheme"
          mode="inline"
          style="border-inline-end: 0px"
          v-if="DEV_MODE || authStore.isAuthenticated"
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
        >
          <template v-for="item in menuItems">
            <a-menu-item
              v-if="
                !item.children &&
                (DEV_MODE || item.role.includes(authStore.user.roleName))
              "
              :key="item.key"
              :to="item.path"
              custom
            >
              <router-link
                :to="item.path"
                style="display: flex; align-items: center"
              >
                <component :is="item.icon" />
                <span class="bold">{{ item.title }}</span>
              </router-link>
            </a-menu-item>

            <template v-else>
              <a-sub-menu
                :key="item.key"
                v-if="DEV_MODE || item.role.includes(authStore.user.roleName)"
              >
                <template #title>
                  <component :is="item.icon" />
                  <span class="bold">{{ item.title }} </span>
                </template>

                <a-menu-item
                  v-for="child in item.children"
                  :key="child.key"
                  :to="child.path"
                  custom
                >
                  <router-link
                    :to="child.path"
                    style="display: flex; align-items: center"
                  >
                    <component :is="child.icon" />
                    <span class="sub-menu-ellipsis">{{ child.title }}</span>
                  </router-link>
                </a-menu-item>
              </a-sub-menu>
            </template>
          </template>
        </a-menu>
      </div>
      <a-flex justify="center" v-if="!siderStore.collapsed"> </a-flex>
    </a-flex>
  </a-layout-sider>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watchEffect, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  UserOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  TeamOutlined,
  FileOutlined,
  CalendarOutlined,
} from '@ant-design/icons-vue'
import { useSiderStore } from '@/stores/sidebar.js'
import { useAuthStore } from '@/stores/auth.js'
import { useThemeStore } from '@/stores/theme.js'
import { useDynamicMenu } from '@/composable/useDynamicMenu'
import hrs from '@/assets/images/hrs.png'

//untuk mode develop, kalau prod nanti false
const DEV_MODE = true

// Menerjemahkan nama icon dari string ke komponen icon
const iconMap = {
  DashboardOutlined,
  UserOutlined,
  DatabaseOutlined,
  FileOutlined,
  CalendarOutlined,
  TeamOutlined,
}

const authStore = useAuthStore()
const siderStore = useSiderStore()
const themeStore = useThemeStore()

const { menus } = useDynamicMenu()

const siderTheme = computed(() => (themeStore.isDarkMode ? 'dark' : 'light'))

const menuItems = ref([])
const selectedKeys = ref([])
const openKeys = ref([])
const route = useRoute()

// Watch for changes in the menu and update if routes change
watchEffect(() => {
  if (menus.value && menus.value.length > 0) {
    menuItems.value = menus.value.map(item => ({
      ...item,
      icon: iconMap[item.icon],
    }))
  }
})

// Function to find key by path
const findKeyByPath = (items, path) => {
  for (const item of items) {
    if (item.path === path) {
      return { key: item.key, parentKey: null }
    }
    if (item.children) {
      const childResult = findKeyByPath(item.children, path)
      if (childResult) {
        return { key: childResult.key, parentKey: item.key }
      }
    }
  }
  return null
}

// Update menu state based on current route
const updateMenuState = () => {
  if (siderStore.collapsed) {
    selectedKeys.value = []
    return
  }
  if (menuItems.value.length > 0) {
    const result = findKeyByPath(menuItems.value, route.path)
    if (result) {
      selectedKeys.value = [result.key]
      if (result.parentKey && !openKeys.value.includes(result.parentKey)) {
        openKeys.value = [...openKeys.value, result.parentKey]
      }
    }
  }
}

// Watch for route changes to update menu state
watch(
  () => route.path,
  () => {
    updateMenuState()
  },
  { immediate: true },
)

// Watch for menu items changes to update menu state (initial load)
watch(
  () => menuItems.value,
  () => {
    updateMenuState()
  },
)

const handleResize = () => {
  if (window.innerWidth < 768) {
    siderStore.setCollapse(true)
    siderStore.setHidden(true)
    siderStore.setIsMobile(true)
  } else {
    siderStore.setHidden(false)
    siderStore.setIsMobile(false)
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.logo {
  margin: 1rem;
}

.logo-name {
  font-size: 14px;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
}

.menu-container {
  height: calc(100vh - 64px);
  overflow-y: auto;
  overflow-x: hidden;
}

.menu-container::-webkit-scrollbar {
  width: 4px;
}

.menu-container::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
}

.menu-container::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.menu-container::-webkit-scrollbar-track {
  background-color: #fafafa;
  border-radius: 10px;
}

.sub-menu-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

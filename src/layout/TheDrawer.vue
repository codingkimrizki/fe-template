<template>
  <a-drawer v-model:open="drawerStore.open" placement="right" :closable="true">
    <template #title>
      <span>Settings</span>
    </template>
    <a-flex vertical gap="large">
      <a-flex justify="space-between" align="center">
        <div>
          <h3>Time</h3>
          <p>{{ dateNow }}</p>
        </div>
      </a-flex>
      <a-flex justify="space-between" align="center">
        <a-space direction="vertical" :size="2">
          <h3>Theme Mode</h3>
          <ThemeToggle />
        </a-space>
        <a-space direction="vertical" :size="2">
          <h3>Fluid / Boxes</h3>
          <a-switch
            v-model:checked="themeStore.isFluid"
            checked-children="Fluid"
            un-checked-children="Boxed"
          />
        </a-space>
      </a-flex>
      <a-flex vertical gap="small">
        <h3>Language</h3>
        <TranslateGoogle />
      </a-flex>
      <a-flex vertical gap="small">
        <ColorPicker v-model="colorPrimary" label="Primary Color" />
        <a-space size="small">
          <a-button
            type="primary"
            @click="themeStore.setPrimaryColor(colorPrimary)"
            >Set color as primary</a-button
          >
          <a-button type="primary" color="blue" @click="handleResetColor">
            <ReloadOutlined /> Reset to default
          </a-button>
        </a-space>
      </a-flex>
      <a-flex vertical gap="small">
        <h3>Font</h3>
        <a-select v-model:value="themeStore.fontFamily">
          <a-select-option value="Poppins, Arial">Poppins</a-select-option>
          <a-select-option value="Manrope, Arial">Manrope</a-select-option>
          <a-select-option value="Nunito, Arial">Nunito</a-select-option>
          <a-select-option value="Plus Jakarta Sans, Arial"
            >Plus Jakarta Sans</a-select-option
          >
        </a-select>
      </a-flex>
      <div>
        <h3 class="bold">Account</h3>
        <a-flex
          justify="space-between"
          align="center"
          class="user-account"
          v-if="authStore.isAuthenticated"
        >
          <a-space size="small">
            <UserOutlined /> {{ capitalizeEachWord(authStore.user.name) }}
          </a-space>
          <a-tag color="#5D866C">
            {{ capitalizeEachWord(authStore.user.roleName) }}</a-tag
          >
        </a-flex>
        <a-button
          danger
          size="large"
          type="primary"
          class="button-logout"
          @click="handleLogout"
        >
          Logout
          <LogoutOutlined />
        </a-button>
      </div>
    </a-flex>
  </a-drawer>
</template>

<script setup>
import { useDrawerStore } from '@/stores/drawer'
import { useAuthStore } from '@/stores/auth'
import { useCurrentDate } from '@/composable/currentDate'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import {
  LogoutOutlined,
  ReloadOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import { useThemeStore } from '@/stores/theme'
import { ref } from 'vue'
import TranslateGoogle from '@/components/TranslateGoogle.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import ColorPicker from '@/components/ColorPicker.vue'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const drawerStore = useDrawerStore()
const { dateNow } = useCurrentDate()

const colorPrimary = ref(themeStore.colorPrimary)

const handleResetColor = () => {
  themeStore.resetPrimaryColor()
  colorPrimary.value = themeStore.defaultColorPrimary
}

const handleLogout = async () => {
  await authStore.logout() // logout dulu
  drawerStore.toggleDrawer()
}
</script>

<style scoped>
.ant-drawer-content-wrapper {
  width: 100px;
}

.button-logout {
  width: 100%;
}

.user-account {
  margin-bottom: 1rem;
}
</style>

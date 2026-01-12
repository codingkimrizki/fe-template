<template>
  <a-flex justify="center" align="center" class="login-container">
    <a-card hoverable class="login-card" :bordered="false">
      <a-flex justify="flex-end" wrap="wrap" style="margin-bottom: 1rem">
        <ThemeToggle />
      </a-flex>
      <LogoTitleApp sub-title="Login with yout account" />
      <a-form :model="form" @finish="loginUser" layout="vertical">
        <a-form-item
          label="Email"
          name="email"
          :rules="[
            {
              type: 'email',
              required: true,
              message: 'Please input your email!',
              trigger: 'blur',
            },
          ]"
        >
          <a-input
            autocomplete="on"
            v-model:value="form.email"
            placeholder="Email"
          />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[
            {
              required: true,
              message: 'Please input your password!',
              trigger: 'blur',
            },
          ]"
        >
          <a-input-password
            autocomplete="new-password"
            v-model:value="form.password"
            placeholder="Password"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            block
            :loading="iconLoading"
          >
            Login
          </a-button>
        </a-form-item>
      </a-form>
      <a-flex justify="center" gap="small" align="center">
        <a-tooltip title="Register" placement="bottom">
          <a-button
            shape="circle"
            @click="router.push('/register')"
            size="large"
          >
            <UserAddOutlined />
          </a-button>
        </a-tooltip>
        <a-tooltip title="Forgot Password" placement="bottom">
          <a-button
            shape="circle"
            @click="router.push('/forgot-password')"
            size="large"
          >
            <LockOutlined />
          </a-button>
        </a-tooltip>
      </a-flex>
    </a-card>
  </a-flex>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { UserAddOutlined, LockOutlined } from '@ant-design/icons-vue'
import router from '@/router'
import LogoTitleApp from '@/components/LogoTitleApp.vue'
const authStore = useAuthStore()
const form = ref({
  email: '',
  password: '',
})
const iconLoading = ref(false)
const loginUser = async () => {
  iconLoading.value = true
  await authStore.login(form.value.email, form.value.password)
  router.push('/')
  iconLoading.value = false
}
</script>

<style scoped>
.login-container {
  height: 100dvh;
  background-color: var(--content-bg);
}

.login-card {
  padding: 5px;
  width: 100%;
  max-width: 500px;
}

.login-card .ant-card-body {
  padding: 0;
}

.a-button {
  width: 100%;
}

.ant-link {
  color: var(--ant-primary-color);
  text-decoration: none;
  font-weight: 600;
}

.ant-link:hover {
  text-decoration: underline;
  /* Underline on hover */
}

.logo-name {
  margin-bottom: 0px;
  font-weight: 800;
  opacity: 0;
  /* Start with hidden */
  transform: scale(0.8);
  /* Mulai dengan ukuran lebih kecil */
  transition:
    opacity 0.8s ease-out,
    transform 0.8s ease-out;
}

.logo-name.intro-active {
  opacity: 1;
  /* Setelah kelas ditambahkan, elemen terlihat */
  transform: scale(1);
  /* Kembali ke ukuran normal */
}

.logo-img:hover {
  cursor: pointer;
}
</style>

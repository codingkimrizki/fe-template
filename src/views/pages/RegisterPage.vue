<template>
  <a-flex justify="center" align="center" class="register-container">
    <a-card hoverable class="register-card">
      <a-flex justify="flex-end" style="margin-bottom: 1rem">
        <ThemeToggle />
      </a-flex>
      <LogoTitleApp sub-title="Fill this form to register new account" />
      <a-form :model="form" @finish="handleRegister" layout="vertical">
        <a-form-item
          label="Username"
          name="name"
          :rules="[
            {
              required: true,
              message: 'Please input your username!',
              trigger: 'change',
            },
            {
              min: 8,
              message: 'Username must be at least 8 characters!',
              trigger: 'blur',
            },
          ]"
        >
          <a-input v-model:value="form.name" placeholder="Username" />
        </a-form-item>

        <a-form-item
          label="Email"
          name="email"
          :rules="[
            {
              required: true,
              message: 'Please input your email!',
              type: 'email',
              trigger: 'change',
            },
          ]"
        >
          <a-input v-model:value="form.email" placeholder="Email" />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[
            {
              required: true,
              message: 'Please input your password!',
              trigger: 'change',
            },
            {
              min: 8,
              message: 'Password must be at least 8 characters!',
              trigger: 'blur',
            },
          ]"
        >
          <a-input-password
            v-model:value="form.password"
            placeholder="Password"
          />
        </a-form-item>

        <a-form-item
          label="Re-type Password"
          name="retype_password"
          :rules="[
            {
              required: true,
              message: 'Please retype your password!',
              trigger: 'change',
              min: 8,
            },
            {
              min: 8,
              message: 'Password must be at least 8 characters!',
              trigger: 'blur',
            },
          ]"
        >
          <a-input-password
            v-model:value="form.retype_password"
            placeholder="Password"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" block>
            Register
          </a-button>
        </a-form-item>
      </a-form>
      <a-flex justify="center" align="center" gap="small">
        <a-tooltip title="Back to login" placement="bottom">
          <a-button shape="circle" size="large" @click="router.push('/login')">
            <UndoOutlined />
          </a-button>
        </a-tooltip>
      </a-flex>
    </a-card>
  </a-flex>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UndoOutlined } from '@ant-design/icons-vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import LogoTitleApp from '@/components/LogoTitleApp.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const form = ref({
  name: '',
  email: '',
  password: '',
  retype_password: '',
})
const errorMessage = ref('')
const router = useRouter()

const handleRegister = async () => {
  if (form.value.password !== form.value.retype_password) {
    errorMessage.value = 'password and retype password do not match'
    return
  }
  await authStore.register(form.value)
  setTimeout(() => {
    router.push('/login')
  }, 2000)
}
</script>

<style scoped>
.register-container {
  height: 100dvh;
  background-color: var(--content-bg);
}

.register-card {
  padding: 5px;
  width: 100%;
  max-width: 500px;
}

.register-card .ant-card-body {
  padding: 0;
}

.a-button {
  width: 100%;
}

.ant-link {
  color: var(--ant-primary-color);
  /* Ant Design default link color */
  text-decoration: none;
  /* Remove underline */
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
</style>

<template>
  <a-flex justify="center" align="center" class="recovery-container">
    <a-card hoverable class="recovery-card" :bordered="false">
      <LogoTitleApp
        sub-title="This link can only be used once to recover your password."
      />
      <a-form
        :model="form"
        @finish="updatePassword"
        layout="vertical"
        :rules="rules"
      >
        <a-form-item label="Password" name="password">
          <a-input-password
            v-model:value="form.password"
            placeholder=""
            class="input-forgot-password"
            autocomplete="new-password"
          />
        </a-form-item>
        <a-form-item label="Retype Password" name="retypePassword">
          <a-input-password
            v-model:value="form.retypePassword"
            placeholder=""
            class="input-forgot-password"
            autocomplete="new-password"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            block
            :loading="iconLoading"
          >
            Submit
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
import LogoTitleApp from '@/components/LogoTitleApp.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UndoOutlined } from '@ant-design/icons-vue'
import router from '@/router'

const authStore = useAuthStore()
const route = useRoute()
const token = route.query.token
const iconLoading = ref(false)

const form = ref({
  password: null,
  retypePassword: null,
})

const rules = {
  password: [
    {
      required: true,
      message: 'Please input your password',
      trigger: 'change',
    },
    {
      min: 8,
      message: 'Password must be at least 8 characters',
      trigger: 'change',
    },
  ],
  retypePassword: [
    {
      required: true,
      message: 'Please confirm your password',
      trigger: 'change',
    },
    {
      validator: (rule, value) => {
        if (!value) {
          return Promise.reject('Please confirm your password')
        } else if (value !== form.value.password) {
          return Promise.reject('Passwords do not match')
        }
        return Promise.resolve()
      },
      trigger: ['change', 'blur'],
    },
  ],
}

const updatePassword = async () => {
  iconLoading.value = true
  await authStore.recoverPassword({
    token,
    password: form.value.password,
  })
  iconLoading.value = false
}
</script>

<style scoped>
.input-forgot-password {
  width: 100%;
  min-width: 400px;
}

.recovery-container {
  height: 100dvh;
  background-color: var(--content-bg);
}

.recovery-card {
  padding: 5px;
  width: 100%;
  max-width: 500px;
}

.recovery-card .ant-card-body {
  padding: 0;
}
</style>

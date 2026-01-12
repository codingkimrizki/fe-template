<template>
  <a-flex justify="center" align="center" class="forgot-container">
    <a-card hoverable class="forgot-card" :bordered="false">
      <a-flex justify="flex-end" wrap="wrap" style="margin-bottom: 1rem">
        <ThemeToggle />
      </a-flex>
      <LogoTitleApp sub-title="Recover your account" />
      <a-form
        :model="form"
        @finish="recoverAccount"
        layout="vertical"
        :rules="rules"
      >
        <a-form-item label="Email" name="email">
          <a-input
            v-model:value="form.email"
            placeholder="user@example.com"
            class="input-email"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            block
            :loading="iconLoading"
          >
            Send recovery link to email
          </a-button>
        </a-form-item>
      </a-form>
      <a-flex justify="center" align="center" gap="small">
        <a-tooltip title="Back to login" placement="bottom">
          <a-button shape="circle" size="large" @click="router.push('/login')"
            ><UndoOutlined
          /></a-button>
        </a-tooltip>
      </a-flex>
    </a-card>
  </a-flex>
</template>

<script setup>
import LogoTitleApp from '@/components/LogoTitleApp.vue'
import router from '@/router'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { UndoOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const authStore = useAuthStore()
const iconLoading = ref(false)
const form = ref({
  email: null,
})
const rules = {
  email: [
    {
      required: true,
      message: 'Please input your email',
      trigger: 'change',
    },
    {
      type: 'email',
      message: 'Please enter a valid email address',
      trigger: ['change', 'blur'],
    },
  ],
}

const recoverAccount = async () => {
  iconLoading.value = true
  await authStore.requestRecoveryAccount(form.value.email)
  iconLoading.value = false
}
</script>

<style scoped>
.forgot-container {
  height: 100dvh;
  background-color: var(--content-bg);
}

.forgot-card {
  padding: 5px;
  width: 100%;
  max-width: 500px;
}

.forgot-card .ant-card-body {
  padding: 0;
}

.a-button {
  width: 100%;
}

.input-email {
  width: 100%;
  min-width: 400px;
}
</style>

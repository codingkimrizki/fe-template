// src/stores/auth.js
import { defineStore } from 'pinia'
import api from '@/axios/interceptor'
import { notification, message } from 'ant-design-vue'
import { h } from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    accessToken: null,
    recoveryCooldown: 0,
    lastRecoveryTime: null,
  }),

  persist: {
    key: 'auth',
    storage: localStorage,
  },

  actions: {
    // 🔑 Login user
    async login(email, password) {
      try {
        const { data, status } = await api.post('/auth/login', {
          email,
          password,
        })

        if (status === 200) {
          this.user = data.user
          this.isAuthenticated = true
          this.accessToken = data?.accessToken
          notification.success({
            message: 'Login Success',
            description: `Welcome back, ${capitalizeEachWord(data.user?.name)}`,
          })
        }
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            'An error occurred. Please try again.',
        )
        console.error('Login failed:', error)
      }
    },

    // 🚪 Logout user
    async logout() {
      try {
        await api.post('/auth/logout')
        router.push('/login')
        this.$reset()
        notification.success({
          message: 'Logout Success',
          description: 'See you again',
        })
      } catch (error) {
        console.error('Logout failed:', error)
      }
    },

    // 📧 Kirim email recovery dengan cooldown
    async requestRecoveryAccount(email) {
      // Cek apakah masih cooldown
      if (this.recoveryCooldown > 0) {
        const minutes = Math.ceil(this.recoveryCooldown / 60)
        message.warning(
          `Please wait ${minutes} minute(s) before requesting again.`,
        )
        return
      }

      try {
        const { status } = await api.post('/auth/forgot-password', { email })

        if (status === 200) {
          notification.success({
            message: 'Recovery link sent to your email.',
            placement: 'topRight',
          })

          // Set cooldown 2 menit
          this.setRecoveryCooldown(120)
        }
      } catch (error) {
        console.error('Request recovery account failed:', error)
        message.error(
          error.response?.data?.message || 'Failed to send recovery email.',
        )
      }
    },

    // 🕒 Set waktu cooldown
    setRecoveryCooldown(seconds) {
      this.recoveryCooldown = seconds
      this.lastRecoveryTime = Date.now()

      // Hitung mundur setiap detik
      const timer = setInterval(() => {
        if (this.recoveryCooldown > 0) {
          this.recoveryCooldown--
        } else {
          clearInterval(timer)
        }
      }, 1000)
    },

    // 👤 Register new user
    async register(data) {
      try {
        // eslint-disable-next-line no-unused-vars
        const { retype_password, ...userData } = data
        const response = await api.post('/auth/register', userData)
        if (response.status === 201) {
          notification.success({
            message: 'Success created your account',
            description: `Wait a seconds it won't take long to direct you to login page`,
            placement: 'topRight',
            duration: 1.5,
            icon: h(LoadingOutlined, {
              style: 'color: #108ee9',
            }),
          })
        }
      } catch (error) {
        if (error.response.status === 409) {
          notification.error({
            message: `Registration Failed`,
            description: error.response.data.message,
            duration: 4,
          })
        } else {
          notification.error({
            message: 'Server Error',
          })
        }
        console.error('Error while register account', error)
      }
    },

    //  Recover password
    async recoverPassword(data) {
      try {
        const response = await api.post('/auth/reset-password', data)
        if (response.status === 200) {
          notification.success({
            message: 'Success reset your password',
            description: 'Wait a seconds you will be redirected to login page',
            placement: 'topRight',
            duration: 1.5,
            icon: h(LoadingOutlined, {
              style: 'color: #108ee9',
            }),
          })
        }
        router.push('/login')
      } catch (error) {
        if (error.response.status === 400) {
          notification.error({
            message: `Invalid token`,
            description: `Token already used or expired`,
          })
        } else {
          notification.error({
            message: `Server Error`,
          })
        }
        console.error('Reset password failed', error)
      }
    },
  },

  getters: {
    isAdmin: state => state.user.roleName === 'admin',
    isStaff: state => state.user.roleName === 'staff',
    isUser: state => state.user.roleName === 'user',
  },
})

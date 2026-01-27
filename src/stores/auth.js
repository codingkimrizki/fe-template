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
    // Login user
    async login(email, password) {
      try {
        const { data, status } = await api.post('/users/login', {
          email,
          password,
        })

        if (status === 200) {
          // this.user = data.user
          this.user = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
          }
          this.isAuthenticated = true
          console.log('authStore.user.role:', this.user.role)
          console.log('typeof role:', typeof this.user.role)

          this.accessToken = data?.accessToken
          console.log('data.user:', data.user)
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

    //Logout user
    async logout() {
      console.log('ACCESS TOKEN SAAT LOGOUT:', this.accessToken)

      try {
        await api.post('/users/logout', null, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        })

        // bersihin state
        this.$reset()
        localStorage.removeItem('auth')

        router.push('/login')

        notification.success({
          message: 'Logout Success',
          description: 'See you again 👋',
        })
      } catch (error) {
        console.error('Logout failed:', error)

        // optional UX improvement
        notification.error({
          message: 'Logout Failed',
          description: error.response?.data?.message || 'Something went wrong',
        })

        // fallback: tetap logout di FE
        this.$reset()
        localStorage.removeItem('auth')
        router.push('/login')
      }
    },

    // Register new user
    async register(data) {
      try {
        // eslint-disable-next-line no-unused-vars
        const { retype_password, ...userData } = data
        console.log('Sending to backend:', userData)
        const response = await api.post('/users/register', userData)
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
        if (error.response?.status === 409) {
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

    // Kirim email recovery dengan cooldown
    async forgotPassword(email) {
      try {
        await api.post('/users/forgotPassword', { email })

        notification.success({
          message: 'Email sent',
          description: 'Check your email to reset password',
        })
      } catch (err) {
        notification.error({
          message: 'Failed',
          description: err.response?.data?.message || 'Email not found',
        })
        throw err
      }
    },

    //  Recover password
    async resetPassword({ token, newPassword }) {
      try {
        await api.post('/users/resetPassword', {
          token,
          newPassword,
        })

        notification.success({
          message: 'Password updated',
          description: 'Please login again',
        })

        router.push('/login')
      } catch (err) {
        notification.error({
          message: 'Reset failed',
          description:
            err.response?.data?.message || 'Invalid or expired token',
        })
        throw err
      }
    },
  },

  getters: {
    isAdmin: state => state.user.roleName === 'admin',
    isStaff: state => state.user.roleName === 'staff',
    isUser: state => state.user.roleName === 'user',
  },
})

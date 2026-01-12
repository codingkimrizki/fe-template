import { useAuthStore } from '@/stores/auth'

export async function authGuard(to, from, next) {
  const authStore = useAuthStore()

  if (to.name === 'Login' && authStore.isAuthenticated)
    return next({ path: '/' })

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) return next({ name: 'Login' })
    if (to.meta.roles && !to.meta.roles.includes(authStore.user?.roleName))
      return next({ name: 'Unauthorized' })
  }

  next()
}

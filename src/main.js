import '@/assets/css/style.css'
import 'ant-design-vue/dist/reset.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia().use(piniaPluginPersistedstate))
app.use(router)
app.use(Antd)
app.mount('#app')

router.beforeEach((to, from, next) => {
  const mainTitle = 'IoT Molding'
  const pageTitle =
    typeof to.meta.breadcrumb === 'string' ? to.meta.breadcrumb : to.name
  document.title = `${pageTitle} - ${mainTitle}`
  next()
})

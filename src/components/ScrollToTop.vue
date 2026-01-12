<template>
  <a-tooltip title="Scroll to top" v-if="showButton" placement="left">
    <a-float-button type="primary" class="scroll-to-top" @click="scrollToTop">
      <template #icon>
        <UpCircleOutlined />
      </template>
    </a-float-button>
  </a-tooltip>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { UpCircleOutlined } from '@ant-design/icons-vue'

const showButton = ref(false)

let contentElement = null

// Function to handle scroll event
const handleScroll = () => {
  if (contentElement) {
    const scrollTop = contentElement.scrollTop
    const clientHeight = contentElement.clientHeight
    showButton.value = scrollTop > clientHeight * 0.8
  }
}

const scrollToTop = () => {
  if (contentElement) {
    contentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}

onMounted(() => {
  contentElement = document.querySelector('.content-scroll')
  if (contentElement) {
    contentElement.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (contentElement) {
    contentElement.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
.scroll-to-top {
  bottom: 24px;
  right: 24px;
}
</style>

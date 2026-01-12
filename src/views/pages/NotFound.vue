<template>
  <a-flex
    justify="center"
    align="center"
    gap="large"
    class="wrapper-not-found"
    vertical
  >
    <a-image :src="notFound" :width="500" :preview="false" />
    <span class="large">There is anything you can find here ?</span>
    <a-button type="primary" @click="goBack">Back to Previous</a-button>
  </a-flex>
</template>

<script setup>
import { useRouter } from 'vue-router'
import notFound from '@/assets/images/404.png'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.wrapper-not-found {
  height: 100dvh;
}
</style>

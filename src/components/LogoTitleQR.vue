<template>
  <a-flex justify="center" align="center" gap="small" vertical>
    <a-flex
      justify="center"
      align="center"
      gap="large"
      class="logo-img"
      wrap="wrap"
    >
      <a-image :src="hrs" :width="100" :preview="false" />
      <h2 :class="{ 'logo-name': true, 'intro-active': isActive }">
        Hirose Quick Response Code<br />
        Generator
      </h2>
    </a-flex>
    <a-typography-text
      type="secondary"
      style="font-size: 1rem; margin-bottom: 1rem"
    >
      {{ subTitle }}
      <slot name="subTitle" />
    </a-typography-text>
    <slot name="footer" />
  </a-flex>
</template>

<script setup>
import hrs from '@/assets/images/hrs.png'
import { onMounted, ref } from 'vue'
const isActive = ref(false)

defineProps({
  subTitle: String,
})

onMounted(() => {
  // Set `isActive` menjadi true setelah mount untuk memicu animasi
  setTimeout(() => {
    isActive.value = true
  }, 100)
})
</script>

<style scoped>
.logo-name {
  margin-bottom: 0px;
  font-weight: 800;
  opacity: 0;
  transform: scale(0.8);
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

<template>
  <a-row
    class="flex flex-col items-center justify-center min-h-screen px-4 py-6"
    :class="{ dark: isDark }"
    :style="{
      backgroundColor: 'var(--content-bg)',
      color: 'var(--text-color)',
    }"
  >
    <div class="flex flex-col items-center gap-6">
      <logoTitleQr subTitle="Type or paste your link below " />
      <a-input
        :value="link"
        @input="e => (link = e.target.value)"
        placeholder="Your link"
        size="large"
        class="w-full max-w-md rounded-3xl shadow-md"
      />

      <a-button
        type="primary"
        size="large"
        block
        @click="generateQR"
        class="w-full max-w-md rounded-3xl shadow-md hover:scale-105 transform transition duration-200"
      >
        Generate QR
      </a-button>

      <canvas
        v-if="showQR"
        ref="canvas"
        class="qr w-56 h-56 md:w-64 md:h-64 rounded-2xl shadow-lg p-3"
      >
      </canvas>

      <a-button
        v-if="showQR"
        type="default"
        :href="qrData"
        download="qrcode.png"
        size="large"
        block
        class="w-full max-w-md rounded-xl shadow-lg bg-white text-purple-700 font-bold hover:bg-purple-100 hover:scale-105 transform transition duration-200"
      >
        Download QR
      </a-button>
    </div>
  </a-row>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import QRCode from 'qrcode'
import { message } from 'ant-design-vue'
import logoTitleQr from './LogoTitleApp.vue'

const link = ref('')
const qrData = ref('')
const canvas = ref(null)
const showQR = ref(false)

const generateQR = async () => {
  const currentLink = link.value.trim()
  console.log('Link saat generate:', `"${currentLink}"`)

  if (!currentLink) {
    message.error('Isi link dulu!')
    return
  }

  // 1. tampilkan canvas dulu
  showQR.value = true
  await nextTick() // tunggu Vue render canvas

  try {
    await QRCode.toCanvas(canvas.value, currentLink, { width: 200 })
    qrData.value = canvas.value.toDataURL()
    showQR.value = true
  } catch (err) {
    console.error('Error generate QR:', err)
    message.error('Gagal generate QR')
  }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');

.font-archivo-black {
  font-family: 'Archivo Black', sans-serif;
}

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
</style>

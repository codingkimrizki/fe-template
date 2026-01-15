<template>
  <div class="flex flex-col items-center justify-center px-4">
    <h4
      :class="[
        'font-bold font-sans text-center',
        isMobile ? 'text-2xl' : 'text-4xl',
      ]"
    >
      Responsible Business Alliance Ethic Portal
    </h4>

    <p
      :class="[
        'mt-2 text-center text-gray-500',
        isMobile ? 'text-sm' : 'text-lg',
      ]"
    >
      Masukan anda akan membantu kami untuk terus menyempurnakan sistem yang ada
    </p>
  </div>

  <div class="mt-5 flex justify-center px-4">
    <a-card
      :class="[
        'w-full max-w-3xl shadow-lg rounded-2xl bg-white transition-all',
        isMobile ? 'p-4' : 'p-6',
      ]"
      bordered
    >
      <div class="flex items-start gap-3">
        <BadgeInfo class="w-5 h-5 mt-0.5 stroke-gray-400 flex-shrink-0" />
        <div class="space-y-2">
          <h3 :class="['font-bold', isMobile ? 'text-sm' : 'text-base']">
            Kebijakan Privasi
          </h3>
          <p :class="['text-gray-700', isMobile ? 'text-xs' : 'text-sm']">
            Jawaban Anda akan dijaga kerahasiaannya dan hanya digunakan untuk
            meningkatkan kualitas pelayanan kami
          </p>
        </div>
      </div>

      <div class="pt-4 mt-4 border-t border-gray-300">
        <h4 :class="['font-medium mb-2', isMobile ? 'text-sm' : 'text-base']">
          Hal yang akan dilakukan:
        </h4>
        <ul
          :class="[
            'text-gray-700 space-y-1 list-disc list-inside',
            isMobile ? 'text-xs' : 'text-sm',
          ]"
        >
          <li>Melakukan Pengisian Formulir dengan Jawaban "Ya" atau "Tidak"</li>
          <li>Memberikan Saran dan Masukan Kepada Kami</li>
          <li>Estimasi pengerjaan sekitar 3–5 menit</li>
        </ul>
      </div>
    </a-card>
  </div>

  <a-divider class="w-full max-w-3xl mx-auto my-6" />

  <div class="flex justify-center px-4">
    <a-button
      @click="props.nextStep"
      type="primary"
      :class="['bg-blue-500 hover:bg-blue-600', isMobile ? 'w-full' : '']"
    >
      Mulai
    </a-button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  nextStep: Function,
})

const isMobile = ref(false)

const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 640 // tailwind sm
}

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile)
})
</script>

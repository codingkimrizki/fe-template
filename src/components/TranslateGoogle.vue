<template>
  <GoogleTranslateSelect
    default-language-code="en"
    default-page-language-code="en"
    :fetch-browser-language="false"
    trigger="click"
  />
</template>

<script setup>
import GoogleTranslateSelect from '@google-translate-select/vue3' // Sesuaikan ke versi Vue 3
</script>

<template>
  <div>
    <a-divider orientation="left">
      <span class="x-large">Firmware List</span>
    </a-divider>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <FirmwareWidget />
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <FirmwareList />
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import FirmwareList from './components/FirmwareList.vue'
import FirmwareWidget from './components/FirmwareWidget.vue'
</script>

<style scoped></style>

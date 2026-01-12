<template>
  <div>
    <a-divider orientation="left">
      <span class="x-large">Master Machine</span>
    </a-divider>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <MachineWidget />
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <MachineList />
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import MachineList from './component/MachineList.vue'
import MachineWidget from './component/MachineWidget.vue'
</script>

<style scoped></style>

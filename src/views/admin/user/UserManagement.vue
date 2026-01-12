<template>
  <div>
    <a-divider orientation="left">
      <span class="x-large">User Management</span>
    </a-divider>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <UserWidget />
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <UserList />
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import UserList from './components/UserList.vue'
import UserWidget from './components/UserWidget.vue'
</script>

<style scoped></style>

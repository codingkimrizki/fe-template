<template>
  <a-flex justify="center" align="center" style="height: 80vh" vertical>
    <a-image
      src="/src/assets/images/unauthorized.png"
      :preview="false"
      :width="500"
    />
    <span class="notes"
      >This page is guarded by system, and you don't have an access to it
    </span>
  </a-flex>
</template>

<script setup></script>

<style scoped>
.error-code {
  font-size: 40px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.notes {
  font-size: 20px;
}
</style>

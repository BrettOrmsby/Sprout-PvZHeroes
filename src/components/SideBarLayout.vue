<template>
  <div class="side-bar-container">
    <SideBar />
    <div class="main-content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SideBar from './SideBar.vue'
</script>

<style scoped>
.side-bar-container {
  display: flex;
  justify-content: center;
  align-content: center;
}
.side-bar-container .main-content {
  flex-shrink: 1;
  min-width: 0;
  width: 100%;
}
@media screen and (max-width: 650px) {
  .side-bar-container {
    display: block;
  }
  .side-bar-container :deep(.side-bar) {
    display: none;
  }
}
</style>

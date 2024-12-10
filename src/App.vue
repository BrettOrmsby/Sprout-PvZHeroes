<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from '@/components/TheHeader.vue'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import ProgressBar from 'primevue/progressbar'
import states from '@/store/states'
</script>

<template>
  <Toast />
  <ConfirmDialog style="margin: var(--block-space); max-width: 500px" />
  <ProgressBar v-if="states.loadingRoute" mode="indeterminate"></ProgressBar>
  <TheHeader />
  <RouterView />
</template>

<style scoped>
.p-progressbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1005;
  width: 100%;
  height: 4px;
  border-radius: 0;
}
</style>

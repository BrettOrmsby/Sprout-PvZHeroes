<script setup lang="ts">
import { watch } from 'vue'
import { RouterView } from 'vue-router'
import { ConfirmDialog, ProgressBar, Toast } from 'primevue'
import TheHeader from '@/components/TheHeader.vue'
import useAuthUser from '@/composables/UseAuthUser'
import { useHeartStore } from '@/store/hearts'
import states from '@/store/states'
const { isSignedIn } = useAuthUser()
const hearts = useHeartStore()
watch(isSignedIn, (newVal) => {
  if (newVal) {
    hearts.load()
  } else {
    hearts.hearts = []
  }
})
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

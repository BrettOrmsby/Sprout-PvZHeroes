<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import { ConfirmDialog, ProgressBar, Toast } from 'primevue'
import TheHeader from '@/components/TheHeader.vue'
import useAuthUser from '@/composables/UseAuthUser'
import { useHeartStore } from '@/store/hearts'
import { useNotificationsStore } from '@/store/notifications'
import { useStatesStore } from '@/store/states'
import { useUserSettingsStore } from './store/userSettings'

const { isSignedIn } = useAuthUser()
const hearts = useHeartStore()
const notifications = useNotificationsStore()
const userSettings = useUserSettingsStore()
const states = useStatesStore()

const loadUserData = (isSignedIn: boolean) => {
  if (isSignedIn) {
    hearts.load()
    notifications.loadUnreadCount()
    userSettings.load()
  } else {
    hearts.hearts = []
    notifications.unreadNotificationsCount = 0
    userSettings.$reset()
  }
}
watch(isSignedIn, (newVal) => loadUserData(newVal))
onMounted(() => loadUserData(isSignedIn.value))
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

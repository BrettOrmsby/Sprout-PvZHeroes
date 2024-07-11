<script setup lang="ts">
import { RouterView } from "vue-router";
import TheHeader from "@/components/TheHeader.vue";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
</script>

<template>
  <Toast />
  <ConfirmDialog style="margin: var(--block-space); max-width: 500px" />
  <TheHeader />
  <Suspense>
    <RouterView />
    <template #fallback>
      <ProgressSpinner />
    </template>
  </Suspense>
</template>

<style scoped></style>

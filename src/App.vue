<script setup lang="ts">
import { RouterView } from "vue-router";
import TheHeader from "@/components/TheHeader.vue";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
</script>

<template>
  <Toast />
  <TheHeader />
  <Suspense>
    <RouterView />

    <template #fallback>
      <ProgressSpinner />
    </template>
  </Suspense>
</template>

<style scoped></style>

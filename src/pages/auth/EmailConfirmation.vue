<template>
  <main>
    <h1>Thanks for registering!</h1>
    <p>
      Please confirm your email to finishing registering<span v-if="email"
        >: {{ email }}</span
      ><span v-else>.</span>
    </p>
  </main>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";

const route = useRoute();

const email = route.query.email;
</script>

<style scoped></style>

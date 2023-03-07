<script lang="ts">
export default {
  name: "HeroImage",
};
</script>

<template>
  <img
    :src="
      hero?.image ||
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2Mws3H+DwADFgG1iNKJ/QAAAABJRU5ErkJggg=='
    "
    :alt="name"
  />
</template>

<script lang="ts" setup>
import getHero from "@/lib/getHero";
import { computed } from "vue";

const props = defineProps<{ name: string }>();
const hero = computed(() => getHero(props.name));
</script>

<style scoped></style>

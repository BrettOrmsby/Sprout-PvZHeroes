<script lang="ts">
export default {
  name: "HeroModal",
};
</script>

<template>
  <Dialog
    :modal="true"
    v-model:visible="states.heroModel.show"
    :header="hero.name"
  >
    <img :src="hero.image" :alt="hero.name" />
  </Dialog>
</template>

<script lang="ts" setup>
import heroData from "@/assets/heros.json";
import states from "@/store/states";
import { computed } from "vue";
import Dialog from "primevue/dialog";
import type { Hero } from "@/lib/types";

const hero = computed<Hero>(
  () =>
    [...heroData.plants, ...heroData.zombies].find(
      (e) => e.name === states.heroModel.hero
    ) as Hero
);
</script>

<style scoped></style>

<script lang="ts">
export default {
  name: "AddCards",
};
</script>

<template>
  <div>
    <h2>Library</h2>
    <CardTable :isInDeck="false" :cards="cards" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import deck from "@/store/deck";
import heroData from "@/assets/heros.json";
import plants from "@/assets/plants.json";
import zombies from "@/assets/zombies.json";
import type { Card, Hero } from "@/lib/types";
import CardTable from "./CardTable.vue";

const isPlant = computed(() =>
  heroData.plants.some((e) => e.name === deck.hero)
);

const cards = computed(
  () =>
    (isPlant.value ? plants : zombies).filter(
      (e) =>
        e.class !== "Removed" && e.set !== "token" && e.set !== "superpower"
    ) as Card[]
);
</script>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--inline-block-spacing);
}
</style>

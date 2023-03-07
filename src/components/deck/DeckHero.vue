<script lang="ts">
export default {
  name: "DeckHero",
};
</script>

<template>
  <img :src="hero.image" :alt="hero.name" />
  <img :src="ult.image" :alt="ult.name" />
  <img
    v-for="card in alt"
    :key="card.name"
    :src="card.image"
    :alt="card.image"
  />
</template>

<script lang="ts" setup>
import getCard from "@/lib/getCard";
import heroData from "@/assets/heros.json";
import superpowers from "@/assets/superpowers.json";
import deck from "@/store/deck";
import { computed } from "vue";
import type { Card, Hero } from "@/lib/types";

const hero = computed<Hero>(
  () =>
    [...heroData.plants, ...heroData.zombies].find(
      (e) => e.name === deck.hero
    ) as Hero
);

const ult = computed(() => {
  return superpowers.find(
    (e) => e.name === hero.value.mainSuperPower
  ) as unknown as Card;
});

const alt = computed(() => {
  return hero.value.altSuperPowers.map((e) => getCard(e));
});
</script>

<style scoped></style>

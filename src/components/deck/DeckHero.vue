<script lang="ts">
export default {
  name: "DeckHero",
};
</script>

<template>
  <div class="hero-banner">
    <img
      class="class"
      :src="'/images/classes/' + hero.class[0].toLowerCase() + '.png'"
      :alt="hero.class[0]"
    />
    <img :src="hero.image" :alt="hero.name" class="hero" @click="openModal" />
    <img
      class="class"
      :src="'/images/classes/' + hero.class[1].toLowerCase() + '.png'"
      :alt="hero.class[1]"
    />
  </div>
</template>

<script lang="ts" setup>
import heroData from "@/assets/heros.json";
import deck from "@/store/deck";
import states from "@/store/states";
import { computed } from "vue";
import type { Hero } from "@/lib/types";

const hero = computed<Hero>(
  () =>
    [...heroData.plants, ...heroData.zombies].find(
      (e) => e.name === deck.hero
    ) as Hero
);

const colours: Record<string, string> = {
  Guardian: "#492F1C",
  Kabloom: "#A03732",
  "Mega-Grow": "#64A65B",
  Smarty: "#A3A2A4",
  Solar: "#D6D848",

  Beastly: "#4771A6",
  Brainy: "#91398D",
  Crazy: "#6331B9",
  Hearty: "#9B762C",
  Sneaky: "#3A3939",
};

const openModal = () => {
  states.heroModel.hero = hero.value.name;
  states.heroModel.show = true;
};
</script>

<style scoped>
.hero-banner {
  padding: var(--content-padding);
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: linear-gradient(
    to right,
    v-bind("colours[hero.class[0]]") 50%,
    v-bind("colours[hero.class[1]]") 50%
  );
}
.hero {
  width: 25%;
  height: auto;
  cursor: pointer;
  border-radius: 100%;
}
.class {
  width: 10%;
}
</style>

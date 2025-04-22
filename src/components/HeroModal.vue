<template>
  <Dialog
    :draggable="false"
    :modal="true"
    v-model:visible="states.heroModal.show"
    style="max-width: 500px; width: 100%; margin: var(--block-space)"
  >
    <template #header>
      <div class="header-container p-dialog-title">
        {{ hero.name }}
        <img
          v-for="className in hero.class"
          :key="className"
          class="class"
          :src="`/images/classes/${className.toLowerCase()}.png`"
          :alt="className"
        />
      </div>
    </template>
    <img :src="hero.image" :alt="hero.name" class="hero" />
    <p class="flavour">
      <em>{{ hero.description }}</em>
    </p>

    <div class="super-power-container">
      <img
        v-for="name in superPowers"
        :key="name"
        :alt="name"
        :src="getCard(name).image"
        @click="openCardModal(name)"
        class="super-power"
      />
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Dialog } from 'primevue'
import getCard from '@/lib/getCard'
import states from '@/store/states'
import heroData from '@/content/heros.json'
import type { Hero } from '@/lib/types'

const hero = computed<Hero>(
  () =>
    [...heroData.plants, ...heroData.zombies].find((e) => e.name === states.heroModal.hero) as Hero,
)

const superPowers = computed(() => [hero.value.mainSuperPower, ...hero.value.altSuperPowers])

const openCardModal = (card: string) => {
  states.cardModal.card = card
  states.cardModal.show = true
}
</script>

<style scoped>
.hero {
  display: block;
  margin: 0 auto;
  width: 40%;
}
.class {
  width: 1em;
  margin-left: var(--inline-space);
}
.header-container {
  display: flex;
  align-items: center;
}
.super-power-container {
  display: flex;
  align-items: baseline;
  justify-content: space-around;
  flex-wrap: wrap;
}
.super-power {
  width: 20%;
  min-width: 75px;
  cursor: pointer;
  transition: transform var(--p-transition-duration) ease;
}
.super-power:hover,
.super-power:focus {
  transform: scale(1.05);
}
.flavour {
  color: var(--p-text-muted-color);
}
</style>

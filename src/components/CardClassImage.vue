<template>
  <img
    v-if="card.name === 'Zom-Bats'"
    class="class"
    src="/images/classes/brainy.png"
    alt="Brainy"
  />
  <img
    v-if="card.name === 'Impfinity Clone'"
    class="class"
    src="/images/classes/sneaky.png"
    alt="Sneaky"
  />
  <img
    v-if="card.name === 'Hothead'"
    class="class"
    src="/images/classes/kabloom.png"
    alt="Kabloom"
  />
  <span v-if="card.class === 'Removed'" style="color: var(--p-primary-400)">Removed</span>
  <img
    v-else-if="card.class"
    class="class"
    :src="'/images/classes/' + card.class.toLowerCase() + '.png'"
    :alt="card.class"
  />
  <template v-else>
    <img
      v-for="cardClass of getMainSuperClasses(card)"
      :key="cardClass"
      class="class"
      :src="'/images/classes/' + cardClass.toLowerCase() + '.png'"
      :alt="card.class"
    />
  </template>
  <img
    v-if="card.name === 'Octo-Pet'"
    class="class"
    src="/images/classes/sneaky.png"
    alt="Sneaky"
  />
</template>

<script lang="ts" setup>
import heros from '@/content/heros.json'
import type { Card } from '@/lib/types'

defineProps<{ card: Card }>()
const getMainSuperClasses = (superpower: Card) => {
  return [...heros.plants, ...heros.zombies].find(
    (hero) => hero.mainSuperPower === superpower.name,
  )!.class
}
</script>

<style scoped>
.class {
  width: 1em;
}
</style>

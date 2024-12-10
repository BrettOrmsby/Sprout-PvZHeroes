<template>
  <footer class="footer">
    <span>{{ cardsInDeck.length }}/40</span>
    <span>
      <Badge :value="basics + 'C'" class="common" v-tooltip.top="'Commons'" />
      <Badge :value="uncommons.toString() + 'U'" class="uncommon" v-tooltip.top="'Uncommons'" />
      <Badge :value="rares.toString() + 'R'" class="rare" v-tooltip.top="'Rares'" />
      <Badge
        :value="superRares.toString() + 'S'"
        class="super-rare"
        v-tooltip.top="'Super-Rares'"
      />
      <Badge :value="legendarys.toString() + 'L'" class="legendary" v-tooltip.top="'Legendarys'" />
      <Badge :value="events.toString() + 'E'" class="event" v-tooltip.top="'Events'" />
    </span>
    <span class="image-text" v-tooltip.left="'Deck Cost'">
      {{ sparks.toLocaleString() }}<img src="/images/assets/spark.png" alt="spark" />
    </span>
  </footer>
</template>

<script lang="ts" setup>
import calculateSparkCost from '@/lib/calculateSparkCost'
import getCard from '@/lib/getCard'
import type { Card } from '@/lib/types'
import deck from '@/store/deck'
import Badge from 'primevue/badge'
import { computed } from 'vue'

const cardsInDeck = computed(() => {
  const deckCards = []
  for (const key in deck.list) {
    const card = getCard(key)
    for (let i = 0; i < deck.list[key]; i++) {
      deckCards.push(card)
    }
  }
  return deckCards
})

const countInDeck = (key: keyof Card, value: number | string | null) => {
  const number = cardsInDeck.value.reduce((prev, curr) => {
    if (curr[key] === value) {
      return 1 + prev
    } else {
      return prev
    }
  }, 0)
  return number
}

const basics = computed(() => countInDeck('rarity', 'common'))
const uncommons = computed(() => countInDeck('rarity', 'uncommon'))
const rares = computed(() => countInDeck('rarity', 'rare'))
const superRares = computed(() => countInDeck('rarity', 'super-rare'))
const legendarys = computed(() => countInDeck('rarity', 'legendary'))
const events = computed(() => countInDeck('rarity', 'event'))

const sparks = computed(() => {
  return cardsInDeck.value
    .map((card) => calculateSparkCost(card))
    .reduce((prev, curr) => prev + curr, 0)
})
</script>

<style scoped>
.footer {
  width: 100%;
  color: var(--p-text-muted-color);
  padding: var(--block-space);
  position: sticky;
  bottom: 0;
  left: 0;
  background-color: var(--p-content-background);
  border-top: 1px var(--p-content-border-color) solid;
  z-index: 1004;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.type-container {
  display: flex;
}
.image-text {
  display: flex;
  align-items: center;
}

.image-text img {
  width: 1em;
  height: 1em;
  display: inline;
  margin-left: 0.1em;
}
.p-badge {
  margin-right: var(--inline-space);
  font-size: 0.5em;
  padding: 0 0.25em;
  border-radius: 100em;
}
.common {
  background-color: #f5f5dc;
}
.uncommon {
  background-color: #959a9d;
}
.rare {
  background-color: #ea9c45;
}
.super-rare {
  background-color: #885cd5;
}
.legendary {
  background: linear-gradient(to bottom right, #a158dc, #f462f4, #f3ea94, #c5f882, #5ba3f0);
}
.event {
  background-color: #e66d59;
}
</style>

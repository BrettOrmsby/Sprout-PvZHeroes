<template>
  <footer class="footer">
    <span>{{ summary.totalCards }}/40</span>
    <span>
      <Badge
        v-for="badge in badgeMeta"
        :key="badge.key"
        :value="summary.counts[badge.key] + badge.label"
        :class="badge.cssClass"
        v-tooltip.top="badge.tooltip"
      />
    </span>
    <span class="image-text" v-tooltip.left="'Deck Cost'">
      {{ summary.totalCost.toLocaleString() }}<img src="/images/assets/spark.png" alt="spark" />
    </span>
  </footer>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Badge } from 'primevue'
import calculateSparkCost from '@/lib/calculateSparkCost'
import getCard from '@/lib/getCard'
import { useDeckStore } from '@/store/deck'

const deck = useDeckStore()

const summary = computed(() => {
  const counts: Record<string, number> = {
    common: 0,
    uncommon: 0,
    rare: 0,
    'super-rare': 0,
    legendary: 0,
    event: 0,
  }
  let totalCost = 0
  let totalCards = 0

  for (const [name, quantity] of Object.entries(deck.list)) {
    const card = getCard(name)
    counts[card.rarity] += quantity
    totalCost += quantity * calculateSparkCost(card)
    totalCards += quantity
  }

  return { counts, totalCost, totalCards }
})

const badgeMeta = [
  { key: 'common', label: 'C', cssClass: 'common', tooltip: 'Commons' },
  { key: 'uncommon', label: 'U', cssClass: 'uncommon', tooltip: 'Uncommons' },
  { key: 'rare', label: 'R', cssClass: 'rare', tooltip: 'Rares' },
  { key: 'super-rare', label: 'S', cssClass: 'super-rare', tooltip: 'Super-Rares' },
  { key: 'legendary', label: 'L', cssClass: 'legendary', tooltip: 'Legendaries' },
  { key: 'event', label: 'E', cssClass: 'event', tooltip: 'Events' },
]
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
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  color: black;
  font-size: 0.5em;
  padding: 0 0.25em;
  border-radius: 100em;
  background: var(--rarity-background);
}
</style>

<template>
  <Dialog
    header="Suggested Packs"
    :draggable="false"
    :modal="true"
    v-model:visible="states.suggestedPackModal"
    style="max-width: 500px; width: 100%; margin: var(--block-space)"
  >
    <div class="pack-list">
      <div v-for="pack of sortedPacks" :key="pack.set" class="pack-item">
        <img :src="`/images/packs/${pack.set}.png`" :alt="pack.set" class="pack-image" />
        <div>
          <h3>{{ packNames[pack.set] }}</h3>
          <span class="image-text">
            {{ Math.floor(pack.sparks).toLocaleString() }}
            <img src="/images/assets/spark.png" alt="spark" v-tooltip.bottom="'Sparks'" />
          </span>
        </div>
      </div>
    </div>
    <Panel header="How are Sparks Calculated?" toggleable :collapsed="true">
      <p>
        Hero probabilities are ignored in premium packs. Each card in the set is separated by
        rarity, and then the rarities are averaged by sparks. If the card is in the deck, then the
        craft spark cost is used; otherwise, the recycle cost is used. Then the expected sparks are
        calculated from the probability of rarities appearing in packs and their average sparks.
      </p>
    </Panel>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { Dialog, Panel } from 'primevue'
import { getAllCardsIterator } from '@/lib/getCard'
import calculateSparkCost, { calculateSparkScraps } from '@/lib/calculateSparkCost'
import { useStatesStore } from '@/store/states'
import { useDeckStore } from '@/store/deck'

const states = useStatesStore()
const deck = useDeckStore()

type Sets = 'premium' | 'galactic' | 'colossal' | 'triassic'
type Rarities = 'uncommon' | 'rare' | 'super-rare' | 'legendary'
type PackItem = {
  set: Sets
  sparks: number
}
const sortedPacks = ref<PackItem[]>([])

const packNames: Record<Sets, string> = {
  premium: 'Premium',
  galactic: 'Galactic Gardens',
  colossal: 'Colossal Fossils',
  triassic: 'Triassic Triumph',
}

type RaritySummary = {
  sparks: number
  cardsCount: number
}

const createDefaultPackSummary = (): Record<Rarities, RaritySummary> => {
  return {
    uncommon: { sparks: 0, cardsCount: 0 },
    rare: { sparks: 0, cardsCount: 0 },
    'super-rare': { sparks: 0, cardsCount: 0 },
    legendary: { sparks: 0, cardsCount: 0 },
  }
}

const averageSparks = (raritySummary: RaritySummary) => {
  if (raritySummary.cardsCount == 0) return 0 // Should never happen
  return raritySummary.sparks / raritySummary.cardsCount
}

const calculatePacks = () => {
  const packsData: Record<Sets, Record<Rarities, RaritySummary>> = {
    premium: createDefaultPackSummary(),
    galactic: createDefaultPackSummary(),
    colossal: createDefaultPackSummary(),
    triassic: createDefaultPackSummary(),
  }

  for (const card of getAllCardsIterator()) {
    if (!['premium', 'galactic', 'colossal', 'triassic'].includes(card.set)) continue
    const raritySummary = packsData[card.set as Sets][card.rarity as Rarities]
    raritySummary.cardsCount += 1
    if (deck.list.hasOwnProperty(card.name)) {
      raritySummary.sparks += calculateSparkCost(card)
    } else {
      raritySummary.sparks += calculateSparkScraps(card)
    }
  }

  sortedPacks.value = []
  for (const set in packsData) {
    const pack = packsData[set as Sets]
    let sparks = 0
    const expectedUncommons = 5 - 0.3 - 0.1
    sparks += expectedUncommons * averageSparks(pack.uncommon)
    sparks += averageSparks(pack.rare)
    sparks += 0.3 * averageSparks(pack['super-rare'])
    sparks += 0.1 * averageSparks(pack.legendary)

    sortedPacks.value.push({
      set: set as Sets,
      sparks,
    })
  }
  sortedPacks.value.sort((a, b) => b.sparks - a.sparks)
}

watchEffect(() => {
  // Only re-compute packs when the modal is opened
  // we do not use a computed for when the deck is edited
  if (states.suggestedPackModal) {
    calculatePacks()
  }
})
</script>

<style scoped>
.pack-list {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--block-space);
  flex-direction: column;
}
.pack-item {
  display: flex;
  align-items: center;
  gap: var(--inline-space);
  width: 100%;
}

.pack-item h3 {
  margin-top: 0;
  margin-bottom: var(--inline-space);
}

.pack-image {
  height: 10vh;
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

.p-panel {
  margin-top: var(--block-space);
}

.p-panel p {
  margin: 0;
}
</style>

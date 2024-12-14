<template>
  <div>
    <h2>Library</h2>

    <Tabs ref="tabview1" :value="hero.class[0]" scrollable>
      <TabList>
        <Tab
          v-for="(_, key) in cardByClass"
          :key="key"
          :value="key"
          as="div"
          class="class-container"
          :class="{ invalidClass: !hero.class.includes(key) }"
        >
          <img class="class" :src="'/images/classes/' + key.toLowerCase() + '.png'" :alt="key" />
          <span>{{ key }}</span>
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-for="(value, key) in cardByClass" :key="key" :value="key">
          <div class="library-container">
            <PVZCardWithMenu
              v-for="card in value.sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name))"
              :key="card.name"
              :isInDeck="false"
              :card="card"
              :class="`${
                states.deckFilter.cardsMatchingFilter.includes(card.name) && 'highlighted'
              } ${
                states.deckFilter.hideCards &&
                !states.deckFilter.cardsMatchingFilter.includes(card.name) &&
                'hidden'
              }`"
            />
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import deck from '@/store/deck'
import states from '@/store/states'
import heroData from '@/assets/heros.json'
import plants from '@/assets/plants.json'
import zombies from '@/assets/zombies.json'
import getHero from '@/lib/getHero'
import type { Card } from '@/lib/types'
import PVZCardWithMenu from './PVZCardWithMenu.vue'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'

const hero = computed(() => getHero(deck.hero))
const isPlant = computed(() => heroData.plants.some((e) => e.name === deck.hero))

const cards = computed(
  () =>
    (isPlant.value ? plants : zombies).filter(
      (e) => e.class !== 'Removed' && e.set !== 'token' && e.set !== 'superpower',
    ) as Card[],
)

const cardByClass = computed(() => {
  const cardClassObj: Record<string, Card[]> = {}
  for (const card of cards.value) {
    if (!cardClassObj[card.class]) {
      cardClassObj[card.class] = [card]
    } else {
      cardClassObj[card.class].push(card)
    }
  }
  return cardClassObj
})
</script>

<style scoped>
.invalidClass:not(.p-tab-active) {
  opacity: var(--p-disabled-opacity);
}

.class-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: var(--inline-space);
}
.class {
  height: 1em;
  width: 1em;
}

.library-container {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: var(--block-space);
  padding: var(--block-space);
  justify-content: flex-start;
}
:deep(.hidden) {
  display: none;
}
:deep(.highlighted) {
  outline-offset: 4px;
  outline: 2px solid var(--p-yellow-400);
}
</style>

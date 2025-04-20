<template>
  <div>
    <h2>Library</h2>

    <Tabs ref="tabview1" :value="hero.class[0]" scrollable>
      <TabList>
        <Tab
          v-for="(_, className) in cardsByClass"
          :key="className"
          :value="className"
          as="div"
          class="class-container"
          :class="{ invalidClass: !hero.class.includes(className) }"
        >
          <img
            class="class"
            :src="'/images/classes/' + className.toLowerCase() + '.png'"
            :alt="className"
          />
          <span>{{ className }}</span>
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-for="(cards, className) in cardsByClass" :key="className" :value="className">
          <div class="library-container">
            <PVZCardWithMenu
              v-for="card in cards"
              :key="card.name"
              :isInDeck="false"
              :card="card"
              :class="{
                highlighted: states.deckFilter.cardsMatchingFilter.includes(card.name),
                hidden:
                  states.deckFilter.hideCards &&
                  !states.deckFilter.cardsMatchingFilter.includes(card.name),
              }"
            />
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primevue'
import PVZCardWithMenu from './PVZCardWithMenu.vue'
import getHero from '@/lib/getHero'
import { useDeckStore } from '@/store/deck'
import states from '@/store/states'
import heroData from '@/content/heros.json'
import plants from '@/content/plants.json'
import zombies from '@/content/zombies.json'
import type { Card } from '@/lib/types'

const deck = useDeckStore()

const hero = computed(() => getHero(deck.hero))
const isPlant = computed(() => heroData.plants.some((e) => e.name === deck.hero))

const cards = computed(
  () =>
    (isPlant.value ? plants : zombies).filter(
      (e) => e.class !== 'Removed' && e.set !== 'token' && e.set !== 'superpower',
    ) as Card[],
)

const cardsByClass = computed(() => {
  const cardClassObj: Record<string, Card[]> = {}
  for (const card of cards.value) {
    if (!cardClassObj[card.class]) {
      cardClassObj[card.class] = [card]
    } else {
      cardClassObj[card.class].push(card)
    }
  }
  // Now sort the cards by cost then name
  for (const key in cardClassObj) {
    cardClassObj[key] = cardClassObj[key].sort(
      (a, b) => a.cost - b.cost || a.name.localeCompare(b.name),
    )
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

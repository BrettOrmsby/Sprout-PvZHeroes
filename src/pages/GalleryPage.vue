<template>
  <CardModal />
  <HeroModal />
  <Dialog
    v-model:visible="isHighlighterVisible"
    header="Highlighter"
    style="max-width: 300px; width: 100%; margin: var(--block-space)"
  >
    <HighlightPopover :is-title-visible="false" />
  </Dialog>
  <main>
    <h1>Gallery</h1>
    <div class="hero-container">
      <Avatar
        v-for="hero in [...heroData.plants, ...heroData.zombies]"
        size="xlarge"
        shape="circle"
        :image="hero.image"
        @click="showHero(hero.name)"
        class="clickable"
        :key="hero.name"
      />
    </div>
    <div>
      <div class="side-cards-container">
        <SideBar />
        <div class="main-content">
          <Toolbar>
            <template #start>
              <Button
                @click="() => (isHighlighterVisible = !isHighlighterVisible)"
                severity="secondary"
                badgeSeverity="contrast"
                label="Highlighter"
                :badge="states.deckFilter.cardsMatchingFilter.length.toString()"
              >
                <template #icon="iconClass">
                  <Highlighter :class="iconClass.class" />
                </template>
              </Button>
            </template>
            <template #end>
              <Button
                v-for="cardClass in Object.keys(cardByClass)"
                severity="secondary"
                :aria-label="cardClass"
                :key="cardClass"
                @click="() => scrollTo(cardClass)"
              >
                <template #icon="iconClass">
                  <img
                    class="class"
                    :class="iconClass.class"
                    :src="'/images/classes/' + cardClass.toLowerCase() + '.png'"
                    :alt="cardClass"
                  />
                </template>
              </Button>
            </template>
          </Toolbar>
          <template v-for="(value, key) in cardByClass" :key="key">
            <h2 :id="`title-${key}`">
              <img
                class="class"
                :src="'/images/classes/' + key.toLowerCase() + '.png'"
                :alt="key"
              />
              <span>{{ key }}</span>
            </h2>
            <div class="card-group">
              <div
                v-for="card in value.sort(
                  (a, b) => a.cost - b.cost || a.name.localeCompare(b.name),
                )"
                :key="card.name"
              >
                <PVZCard
                  :is-valid="true"
                  :card="card"
                  :amount="4"
                  @click="showCard(card.name)"
                  :class="{
                    highlighted: states.deckFilter.cardsMatchingFilter.includes(card.name),
                    hidden:
                      states.deckFilter.hideCards &&
                      !states.deckFilter.cardsMatchingFilter.includes(card.name),
                  }"
                />
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <ScrollTop />
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Avatar, Button, Dialog, ScrollTop, Toolbar } from 'primevue'
import { Highlighter } from 'lucide-vue-next'
import PVZCard from '@/components/PVZCard.vue'
import CardModal from '@/components/CardModal.vue'
import HeroModal from '@/components/HeroModal.vue'
import TheFooter from '@/components/TheFooter.vue'
import HighlightPopover from '@/components/HighlightPopover.vue'
import SideBar from '@/components/SideBar.vue'
import states from '@/store/states'
import heroData from '@/content/heros.json'
import plants from '@/content/plants.json'
import zombies from '@/content/zombies.json'
import type { Card } from '@/lib/types'

const isHighlighterVisible = ref(false)

const cards = computed(
  () =>
    [...plants, ...zombies].filter(
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

const scrollTo = (cardClass: string) => {
  document.getElementById(`title-${cardClass}`)?.scrollIntoView({ behavior: 'smooth' })
}

const showCard = (card: string) => {
  states.cardModal.card = card
  states.cardModal.show = true
}

const showHero = (hero: string) => {
  states.heroModel.hero = hero
  states.heroModel.show = true
}
</script>

<style scoped>
main {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}
h1 {
  text-align: center;
  font-size: 3em;
}

.hero-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--inline-space);
  flex-wrap: wrap;
  margin-bottom: var(--block-space);
}
.clickable {
  cursor: pointer;
}

.p-toolbar {
  position: sticky;
  top: calc(var(--block-space) * 4);
  z-index: 10;
  margin: 0 auto;
  width: 100%;
  flex-wrap: nowrap;
  overflow: scroll;
}
:deep(.p-toolbar-end) {
  display: flex;
  gap: var(--inline-space);
  justify-content: center;
  align-items: center;
  overflow: scroll;
  flex-shrink: 0;
}

.side-cards-container {
  display: flex;
  justify-content: center;
  align-content: center;
}
.side-cards-container .main-content {
  flex-shrink: 1;
  min-width: 0;
}
@media screen and (max-width: 650px) {
  .side-cards-container {
    display: block;
  }
  .side-cards-container :deep(.side-bar) {
    display: none;
  }
}

h2 {
  font-size: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--inline-space);
  margin-top: calc(var(--block-space) * 2);
  margin-bottom: var(--block-space);
  scroll-margin-top: calc(var(--block-space) * 9);
}
.class {
  height: 1em;
  width: 1em;
}
.card-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--block-space);
  justify-content: center;
  align-items: stretch;
}
:deep(.amount) {
  display: none;
}
:deep(.card-container) {
  width: 100%;
  height: 100%;
}
:deep(.highlighted) {
  outline-offset: 4px;
  outline: 2px solid var(--p-yellow-400);
}
:deep(.hidden),
:deep(div:has(> .hidden)) {
  display: none;
}
</style>

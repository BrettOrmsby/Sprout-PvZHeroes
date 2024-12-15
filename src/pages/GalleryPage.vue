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
          <img class="class" :src="'/images/classes/' + key.toLowerCase() + '.png'" :alt="key" />
          <span>{{ key }}</span>
        </h2>
        <div class="card-group">
          <DeferredContent
            v-for="card in value.sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name))"
            :key="card.name"
          >
            <PVZCard
              :key="card.name"
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
          </DeferredContent>
        </div>
      </template>
    </div>
    <ScrollTop />
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import PVZCard from '@/components/PVZCard.vue'
import CardModal from '@/components/CardModal.vue'
import HeroModal from '@/components/HeroModal.vue'
import TheFooter from '@/components/TheFooter.vue'
import HighlightPopover from '@/components/HighlightPopover.vue'
import states from '@/store/states'
import heroData from '@/assets/heros.json'
import plants from '@/assets/plants.json'
import zombies from '@/assets/zombies.json'
import { computed, ref } from 'vue'
import type { Card } from '@/lib/types'
import Avatar from 'primevue/avatar'
import Dialog from 'primevue/dialog'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import ScrollTop from 'primevue/scrolltop'
import { Highlighter } from 'lucide-vue-next'

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
  max-width: 900px;
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
:deep(.card-container) {
  width: 100%;
  height: 100%;
}
deferredcontent:has(.hidden),
:deep(.hidden) {
  display: none;
}
:deep(.highlighted) {
  outline-offset: 4px;
  outline: 2px solid var(--p-yellow-400);
}
</style>

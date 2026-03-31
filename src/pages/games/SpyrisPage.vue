<template>
  <main>
    <h1><HatGlasses />Spyris</h1>
    <HowToPlayModal />
    <GuessSymbolModal />
    <template v-if="spyris.gameState === 'won'">
      <h2>You won in {{ spyris.MAX_GUESSES - spyris.guessesRemaining }} guesses!</h2>
      <FullCardRender :card="answerCardRender" />
    </template>
    <template v-else-if="spyris.gameState === 'lost'">
      <h2>You lost!</h2>
      <FullCardRender :card="answerCardRender" />
    </template>
    <template v-else>
      <GameCardRender />
      <div class="game-bar">
        <div class="guesses-remaining">{{ spyris.guessesRemaining }} guesses left</div>
        <Button severity="secondary" size="small" @click="spyris.isHowToPlayOpen = true"
          >How to Play</Button
        >
        <Button
          severity="primary"
          size="small"
          @click="spyris.isSymbolModalOpen = true"
          :disabled="spyris.guessesRemaining === 1"
          >Guess Symbol</Button
        >
      </div>
      <KeyboardButtons />
      <NameInput />
    </template>
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import { Button } from 'primevue'
import { HatGlasses } from '@lucide/vue'
import TheFooter from '@/components/TheFooter.vue'
import { useSpyrisStore } from '@/store/games/spyris'
import GameCardRender from '@/components/spyris/GameCardRender.vue'
import KeyboardButtons from '@/components/spyris/KeyboardButtons.vue'
import HowToPlayModal from '@/components/spyris/HowToPlayModal.vue'
import NameInput from '@/components/spyris/NameInput.vue'
import FullCardRender from '@/components/FullCardRender.vue'
import { computed, watch } from 'vue'
import type { Card, CardRenderData, CardType, ClassName, Rarity } from '@/lib/types'
import GuessSymbolModal from '@/components/spyris/GuessSymbolModal.vue'
import dayjs from 'dayjs'
import plants from '@/content/plants.json'
import zombies from '@/content/zombies.json'

const spyris = useSpyrisStore()

// TODO: import the cards, filter out tokens? supers? removed?
const START_DATE = new Date('2026-03-30')
const allCards = ([...plants, ...zombies] as Card[]).filter(
  (card) => card.class !== 'Removed' && card.set !== 'token' && card.set !== 'superpower',
)
const suffledCards = shuffle(allCards, 111)
const dayNumber = dayjs(Date.now()).diff(START_DATE, 'days')
const card = suffledCards[dayNumber % allCards.length]
if (card.name !== spyris.answer.name) {
  // Restart the game
  spyris.setCard(suffledCards[dayNumber % allCards.length])
}

const answerCardRender = computed(
  (): CardRenderData => ({
    className: spyris.answer.class.toLowerCase() as ClassName,
    name: spyris.answer.name,
    type: normalizeCardType(spyris.answer.type),
    tribes: spyris.answer.tribes,
    abilities: spyris.answer.abilities
      .replace(/<b>(.+?)<\/b>/g, '**$1**')
      .replace(/\{\{(.+?)\}\}/g, (substr) => {
        if (substr.includes(':')) {
          return substr.split(':')[0].slice(2)
        } else {
          return substr
        }
      }),
    set: spyris.answer.set === 'event' ? '' : spyris.answer.set,
    flavour: spyris.answer.flavour,
    rarity: spyris.answer.rarity as Rarity,
    strengthImg: 'strength',
    healthImg: 'heart',
    cost: spyris.answer.cost,
    strength: spyris.answer.strength ?? 0,
    health: spyris.answer.health ?? 0,

    img: '',
    imgWidth: 0,
    imgXOffset: 0,
    imgYOffset: 0,
    backgroundColour: 'transparent',
  }),
)

function normalizeCardType(type: string): CardType {
  if (type === 'Plant' || type === 'Zombie') return 'fighter'
  if (type === 'Trick') return 'trick'
  return 'environment'
}

watch(
  () => spyris.gameState,
  () => window.scrollTo({ top: 0 }),
)

// Source - https://stackoverflow.com/a/53758827
// Posted by Ulf Aslak
// Retrieved 2026-03-30, License - CC BY-SA 4.0
function shuffle<T>(array: T[], seed: number): T[] {
  let m = array.length,
    t,
    i
  while (m) {
    i = Math.floor(random(seed) * m--)
    t = array[m]
    array[m] = array[i]
    array[i] = t
    ++seed
  }
  return array
}
// Not completely random, but good enough
function random(seed: number) {
  const x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}
</script>

<style scoped>
main {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  flex-direction: column;
  gap: var(--block-space);
  display: flex;
  align-items: center;
}
h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--inline-space);
  margin: 0;
}
h1 svg {
  color: var(--p-primary-400);
  width: 1em;
  height: 1em;
  flex-shrink: 0;
}
h2 {
  margin: 0;
}
.game-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--inline-space);
}
.guesses-remaining {
  color: var(--p-text-muted-color);
}
.card-container {
  margin-top: -90px;
}
</style>

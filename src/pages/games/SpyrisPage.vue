<template>
  <main>
    <h1><HatGlasses />Spyris - Day {{ spyris.dayNumber }}</h1>
    <HowToPlayModal />
    <GuessSymbolModal />
    <template v-if="spyris.gameState === 'won'">
      <h2>
        You won in {{ spyris.MAX_GUESSES - spyris.guessesRemaining }} guess<span
          v-if="spyris.MAX_GUESSES - spyris.guessesRemaining !== 1"
          >es</span
        >!
      </h2>
      <FullCardRender :card="answerCardRender" />
      <p class="done-message">Come back tomorrow for a new card!</p>
    </template>
    <template v-else-if="spyris.gameState === 'lost'">
      <h2>You lost!</h2>
      <FullCardRender :card="answerCardRender" />
      <p class="done-message">Come back tomorrow for a new card!</p>
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
import { computed, onMounted, watch } from 'vue'
import type { CardRenderData, CardType, ClassName, Rarity } from '@/lib/types'
import GuessSymbolModal from '@/components/spyris/GuessSymbolModal.vue'

const spyris = useSpyrisStore()

onMounted(spyris.init)
watch(
  () => spyris.gameState,
  () => window.scrollTo({ top: 0 }),
)

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
.done-message {
  margin-top: 0;
}
</style>

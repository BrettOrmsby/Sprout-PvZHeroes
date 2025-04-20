<template>
  <h2>Draw Simulator</h2>
  <Message v-if="cardsInDeck < 8"> Your deck must have at least eight cards to begin. </Message>
  <div v-else>
    <div class="restart-container">
      <Button label="Restart" @click="restartDeck">
        <template #icon="iconClass">
          <Grid2X2 :class="iconClass.class" />
        </template>
      </Button>
    </div>
    <TransitionGroup name="card" tag="div" class="draw-container">
      <div v-for="(card, index) of draw" :key="card.identifier" class="card-draw-container">
        <PVZCard
          :card="getCard(card.cardName)"
          :is-valid="true"
          :amount="0"
          @click="viewCard(card.cardName)"
        />
        <Button
          :disabled="!card.hasMulligan"
          @click="mulligan(index)"
          :aria-label="`Mulligan card ${index + 1}`"
        >
          <template #icon="iconClass">
            <RotateCw :class="iconClass.class" />
          </template>
        </Button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Button, Message } from 'primevue'
import { Grid2X2, RotateCw } from 'lucide-vue-next'
import PVZCard from '@/components/PVZCard.vue'
import getCard from '@/lib/getCard'
import states from '@/store/states'
import { useDeckStore } from '@/store/deck'

type DrawCard = {
  cardName: string
  identifier: number
}
type MulliganCard = DrawCard & { hasMulligan: boolean }

const deck = useDeckStore()
const shuffledDeck = ref<DrawCard[]>([])
const draw = ref<MulliganCard[]>([])

const cardsInDeck = computed(() => Object.values(deck.list).reduce((prev, curr) => prev + curr, 0))

let uniqueIndexCount = 0
const restartDeck = () => {
  const deckCards = Object.entries(deck.list)
    .flatMap(([card, amount]) => Array(amount).fill(card))
    .map((cardName) => ({ cardName, identifier: uniqueIndexCount++ }))
  shuffle(deckCards)

  draw.value = deckCards.splice(0, 4).map((card) => ({ ...card, hasMulligan: true }))
  shuffledDeck.value = deckCards
}

const mulligan = (index: number) => {
  // You cannot get the same card back
  // the following adds the card back to deck
  // shuffledDeck.value.push(draw.value[index].cardName)

  shuffle(shuffledDeck.value)
  const newCard = shuffledDeck.value.shift()!

  draw.value[index] = { ...newCard, hasMulligan: false }
}

onMounted(restartDeck)
watch(() => deck.list, restartDeck)

function shuffle(array: DrawCard[]) {
  let m = array.length,
    t,
    i
  while (m) {
    i = Math.floor(Math.random() * m--)
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }
}

const viewCard = (card: string) => {
  states.cardModal.card = card
  states.cardModal.show = true
}
</script>

<style scoped>
.p-message {
  margin: 0 auto;
  width: fit-content;
}
:deep(.amount) {
  display: none;
}
:deep(.card-image) {
  max-height: 100px;
  max-width: 100px;
  height: auto;
  width: auto;
}

h2,
.restart-container {
  text-align: center;
}

.draw-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  margin: 0 auto;
  margin-top: var(--block-space);
  gap: var(--block-space);
  width: fit-content;
}

.card-draw-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  gap: var(--inline-space);
}

.card-container {
  width: fit-content;
}

.card-leave-active,
.card-leave-to {
  display: none;
}

.card-enter-active,
.card-enter-from {
  -webkit-animation: rotate-scale-down 0.2s linear both;
  animation: rotate-scale-down 0.2s linear both;
}

@-webkit-keyframes rotate-scale-down {
  0% {
    -webkit-transform: scale(1) rotateZ(0);
    transform: scale(1) rotateZ(0);
  }
  50% {
    -webkit-transform: scale(0.5) rotateZ(180deg);
    transform: scale(0.5) rotateZ(180deg);
  }
  100% {
    -webkit-transform: scale(1) rotateZ(360deg);
    transform: scale(1) rotateZ(360deg);
  }
}
@keyframes rotate-scale-down {
  0% {
    -webkit-transform: scale(1) rotateZ(0);
    transform: scale(1) rotateZ(0);
  }
  50% {
    -webkit-transform: scale(0.5) rotateZ(180deg);
    transform: scale(0.5) rotateZ(180deg);
  }
  100% {
    -webkit-transform: scale(1) rotateZ(360deg);
    transform: scale(1) rotateZ(360deg);
  }
}
</style>

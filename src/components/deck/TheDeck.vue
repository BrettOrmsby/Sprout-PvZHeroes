<template>
  <h2>Deck</h2>
  <Message v-if="cards.length === 0" :severity="'warn'" :closable="false"
    >The Deck Is Empty</Message
  >
  <div v-else class="library-container">
    <template v-if="deck.isUsersDeck">
      <PVZCardWithMenu
        v-for="card in cards"
        :key="card.name"
        :isInDeck="true"
        :card="card"
        :class="{
          highlighted: states.deckFilter.cardsMatchingFilter.includes(card.name),
          hidden:
            states.deckFilter.hideCards &&
            !states.deckFilter.cardsMatchingFilter.includes(card.name),
        }"
      />
    </template>
    <template v-else>
      <PVZCard
        v-for="card in cards"
        :key="card.name"
        :card="card"
        :amount="deck.list[card.name]"
        :isValid="true"
        :class="{
          highlighted: states.deckFilter.cardsMatchingFilter.includes(card.name),
          hidden:
            states.deckFilter.hideCards &&
            !states.deckFilter.cardsMatchingFilter.includes(card.name),
        }"
        @click="showCard(card.name)"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { Message } from 'primevue'
import PVZCardWithMenu from '@/components/deck/PVZCardWithMenu.vue'
import PVZCard from '@/components/PVZCard.vue'
import getCard from '@/lib/getCard'
import states from '@/store/states'
import { useDeckStore } from '@/store/deck'
import { useUserStore } from '@/store/user'

const user = useUserStore()
const deck = useDeckStore()

const cards = computed(() =>
  Object.keys(deck.list)
    .map((e) => getCard(e))
    .sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name)),
)

const showCard = (card: string) => {
  states.cardModal.card = card
  states.cardModal.show = true
}

onBeforeRouteUpdate(async (to) => {
  const deck = useDeckStore()
  const isLoadDeckError = await deck.loadId(to.params.id.toString())
  if (isLoadDeckError) {
    const router = useRouter()
    router.replace({ name: '404' })
  }

  const isUserLoadError = await user.loadFromId(deck.creator)
  if (isUserLoadError) {
    const router = useRouter()
    router.replace({ name: '404' })
  }

  document.title = `${deck.name} • Sprout`
  states.deckFilter.hideCards = false
  states.deckFilter.cardsMatchingFilter = []
})
</script>

<style scoped>
.library-container {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: var(--block-space);
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

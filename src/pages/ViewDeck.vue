<template>
  <CardModal />
  <HeroModal />
  <DeckHeader />
  <main>
    <div class="side-deck-container">
      <SideBar />
      <div class="main-content">
        <DeckToolbar />
        <TheDeck />
        <AddCards v-if="isUsersDeck" />
      </div>
    </div>
    <Divider />
    <DeckCharts />
    <Divider />
    <DrawSimulator />
  </main>
  <DeckFooter />
  <TheFooter />
</template>

<script lang="ts" setup>
import useAuthUser from '@/composables/UseAuthUser'
import { useDeckStore } from '@/store/deck'
import { computed } from 'vue'
import SideBar from '@/components/SideBar.vue'
import DeckHeader from '@/components/deck/DeckHeader.vue'
import TheDeck from '@/components/deck/TheDeck.vue'
import AddCards from '@/components/deck/AddCards.vue'
import CardModal from '@/components/CardModal.vue'
import HeroModal from '@/components/HeroModal.vue'
import DeckFooter from '@/components/deck/DeckFooter.vue'
import DrawSimulator from '@/components/deck/DrawSimulator.vue'
import DeckCharts from '@/components/deck/DeckCharts.vue'
import DeckToolbar from '@/components/deck/DeckToolbar.vue'
import TheFooter from '@/components/TheFooter.vue'
import Divider from 'primevue/divider'
import throwError from '@/lib/throwError'
import useSupabase from '@/composables/UseSupabase'
import useHoverShortcut from '@/composables/useHoverShortcut'

const deck = useDeckStore()

useHoverShortcut({
  Digit1: {
    selector: '[data-card-name][data-can-add=true]',
    command(element: Element) {
      const cardName = element.getAttribute('data-card-name')!
      const newAmount = deck.list[cardName] ? deck.list[cardName] + 1 : 1
      const newList = { ...deck.list, [cardName]: newAmount }
      deck.update({
        list: newList,
        is_complete: Object.values(newList).reduce((prev, curr) => prev + curr, 0) === 40,
      })
    },
  },
  Digit2: {
    selector: '[data-card-name][data-can-remove=true]',
    command(element: Element) {
      const cardName = element.getAttribute('data-card-name')!

      const newAmount = deck.list[cardName] - 1
      const newList = { ...deck.list, [cardName]: newAmount }
      if (newList[cardName] === 0) {
        delete newList[cardName]
      }
      deck.update({
        list: newList,
        is_complete: Object.values(newList).reduce((prev, curr) => prev + curr, 0) === 40,
      })
    },
  },
})

const { id } = useAuthUser()
const isUsersDeck = computed(() => id.value === deck.creator)
</script>

<style scoped>
main {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.overflow {
  overflow: scroll;
}
h1,
h2 {
  text-align: center;
}

.side-deck-container {
  display: flex;
  justify-content: center;
  align-content: center;
}
.side-deck-container .main-content {
  flex-shrink: 1;
  min-width: 0;
}
@media screen and (max-width: 700px) {
  .side-deck-container {
    display: block;
  }
  .side-deck-container :deep(.side-bar) {
    display: none;
  }
}
.deck-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--inline-space);
  justify-content: center;
  align-items: stretch;
}

main {
  margin-top: 0;
}
</style>

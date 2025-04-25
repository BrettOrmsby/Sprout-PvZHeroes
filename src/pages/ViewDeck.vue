<template>
  <CardModal />
  <HeroModal />
  <DeckHeader />
  <main>
    <SideBarLayout>
      <DeckToolbar />
      <TheDeck />
      <AddCards v-if="deck.isUsersDeck" />
    </SideBarLayout>
    <Divider />
    <DeckCharts />
    <Divider />
    <DrawSimulator />
  </main>
  <DeckFooter />
  <TheFooter />
</template>

<script lang="ts" setup>
import { Divider } from 'primevue'
import DeckHeader from '@/components/deck/DeckHeader.vue'
import SideBarLayout from '@/components/SideBarLayout.vue'
import TheDeck from '@/components/deck/TheDeck.vue'
import AddCards from '@/components/deck/AddCards.vue'
import CardModal from '@/components/CardModal.vue'
import HeroModal from '@/components/HeroModal.vue'
import DeckFooter from '@/components/deck/DeckFooter.vue'
import DrawSimulator from '@/components/deck/DrawSimulator.vue'
import DeckCharts from '@/components/deck/DeckCharts.vue'
import DeckToolbar from '@/components/deck/DeckToolbar.vue'
import TheFooter from '@/components/TheFooter.vue'
import useHoverShortcut from '@/composables/useHoverShortcut'
import { useDeckStore } from '@/store/deck'

const deck = useDeckStore()

const isComplete = (list: Record<string, number>) =>
  Object.values(list).reduce((prev, curr) => prev + curr, 0) === 40
useHoverShortcut({
  Digit1: {
    selector: '[data-card-name][data-can-add=true]',
    command(element: Element) {
      const cardName = element.getAttribute('data-card-name')!
      const newAmount = deck.list[cardName] ? deck.list[cardName] + 1 : 1
      const newList = { ...deck.list, [cardName]: newAmount }
      deck.update({
        list: newList,
        is_complete: isComplete(newList),
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
        is_complete: isComplete(newList),
      })
    },
  },
})
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

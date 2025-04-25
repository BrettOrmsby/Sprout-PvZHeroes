<template>
  <CardModal />
  <main>
    <h1>Comparing {{ deck.name }}</h1>
    <CompareInput :id="id" v-model="toInput" />
    <SideBarLayout>
      <template v-for="(value, key) in comparison" :key="key">
        <h2>
          <span v-if="key === 'both'">Shared in Both Decks</span
          ><span v-else
            >Unique to
            <RouterLink :to="{ name: 'ViewDeck', params: { id: key } }">{{
              getDeck(key as string).name
            }}</RouterLink></span
          >
          ({{ getListCount(value) }})
        </h2>
        <Message v-if="Object.values(value).length === 0" :severity="'warn'" :closable="false"
          >No Unique Cards</Message
        >
        <div v-else class="card-group">
          <PVZCard
            v-for="card in sortList(value)"
            :key="card.name"
            :is-valid="true"
            :card="card"
            :amount="value[card.name]"
            @click="showCard(card.name)"
          />
        </div>
      </template>
    </SideBarLayout>
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { Message } from 'primevue'
import PVZCard from '@/components/PVZCard.vue'
import CardModal from '@/components/CardModal.vue'
import CompareInput from '@/components/CompareInput.vue'
import TheFooter from '@/components/TheFooter.vue'
import SideBarLayout from '@/components/SideBarLayout.vue'
import getCard from '@/lib/getCard'
import { useCompareStore, useDeckStore } from '@/store/deck'
import states from '@/store/states'

defineProps<{ id: string; to: string }>()

const deck = useDeckStore()
const compareDeck = useCompareStore()

const getDeck = (id: string) => (deck.id === id ? deck : compareDeck)
const getListCount = (list: Record<string, number>) =>
  Object.values(list).reduce((a, b) => a + b, 0)
const sortList = (list: Record<string, number>) =>
  Object.keys(list)
    .map((e) => getCard(e))
    .sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name))

const comparison = computed(() => {
  const comparison = {
    [deck.id]: {} as Record<string, number>,
    [compareDeck.id]: {} as Record<string, number>,
    both: {} as Record<string, number>,
  }

  for (const [name, amount] of Object.entries(deck.list)) {
    if (name in compareDeck.list) {
      if (compareDeck.list[name] < amount) {
        comparison[deck.id][name] = amount - compareDeck.list[name]
        comparison.both[name] = compareDeck.list[name]
      } else if (compareDeck.list[name] === amount) {
        comparison.both[name] = compareDeck.list[name]
      }
    } else {
      comparison[deck.id][name] = amount
    }
  }

  for (const [name, amount] of Object.entries(compareDeck.list)) {
    if (name in deck.list) {
      if (deck.list[name] < amount) {
        comparison[compareDeck.id][name] = amount - deck.list[name]
        comparison.both[name] = deck.list[name]
      }
    } else {
      comparison[compareDeck.id][name] = amount
    }
  }

  return comparison
})

const showCard = (card: string) => {
  states.cardModal.card = card
  states.cardModal.show = true
}

const toInput = ref('https://sprout-deckbuider.vercel.app/deck/' + compareDeck.id)

onBeforeRouteUpdate(async (to) => {
  const router = useRouter()
  const deck = useDeckStore()
  const compareDeck = useCompareStore()

  try {
    const [deckError, compareError] = await Promise.all([
      deck.loadId(to.params.id.toString()),
      compareDeck.loadId(to.params.to.toString()),
    ])
    if (deckError || compareError) {
      throw new Error()
    }
    document.title = `Compare ${deck.name} to ${compareDeck.name} • Sprout`
  } catch {
    router.replace({ name: '404' })
  }
})
</script>

<style scoped>
main {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}
h1,
h2 {
  text-align: center;
}
.p-message {
  margin: 0 auto;
  width: fit-content;
}

.card-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--block-space);
  justify-content: center;
  align-items: stretch;
}

a {
  color: var(--p-primary-color);
  transition: var(--p-form-field-transition-duration);
  text-decoration: none;
}
a:hover {
  color: var(--p-primary-hover-color);
}
</style>

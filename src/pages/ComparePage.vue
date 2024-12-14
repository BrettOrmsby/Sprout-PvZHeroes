<template>
  <CardModal />
  <main>
    <h1>Comparing {{ deck.name }}</h1>
    <CompareInput :id="id" v-model="toInput" />

    <template v-for="(value, key) in comparison" :key="key">
      <h2>
        <span v-if="key === 'both'">Shared in Both Decks</span
        ><span v-else
          >Unique to
          <RouterLink :to="{ name: 'ViewDeck', params: { id: key } }">{{
            getDeck(key as string).name
          }}</RouterLink></span
        >
        ({{ Object.values(value).reduce((prev, curr) => prev + curr, 0) }})
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
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import CompareInput from '@/components/CompareInput.vue'
import Message from 'primevue/message'
import PVZCard from '@/components/PVZCard.vue'
import CardModal from '@/components/CardModal.vue'
import TheFooter from '@/components/TheFooter.vue'
import { ref, computed } from 'vue'
import getCard from '@/lib/getCard'
import deck, { compareDeck } from '@/store/deck'
import states from '@/store/states'
import { onBeforeRouteUpdate } from 'vue-router'
import useSupabase from '@/composables/UseSupabase'

defineProps<{ id: string; to: string }>()

const getDeck = (id: string) => (deck.id === id ? deck! : compareDeck!)

const sortList = (list: Record<string, number>) =>
  Object.keys(list)
    .map((e) => getCard(e))
    .sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name))

const comparison = computed(() => {
  const comparison = {
    [deck.id]: {} as Record<string, number>,
    [compareDeck.id]: {},
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
  const { supabase } = useSupabase()
  const { data, error } = await supabase.from('decks').select().eq('id', to.params.id).single()

  if (error) {
    return { name: '404' }
  } else {
    Object.assign(deck, data)
  }

  const { data: compare, error: compareError } = await supabase
    .from('decks')
    .select()
    .eq('id', to.params.to)
    .single()

  if (compareError) {
    return { name: '404' }
  } else {
    Object.assign(compareDeck, compare)
  }
  document.title = `Compare ${data.name} to ${compare.name} • Sprout`
})
</script>

<style scoped>
main {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
h1,
h2 {
  text-align: center;
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

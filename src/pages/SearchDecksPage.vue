<template>
  <main>
    <h1>Search <span class="primary-color">Decks</span></h1>
    <form
      :key="reloadForm"
      @submit.prevent="
        router.push({
          name: 'SearchDecks',
          query: {
            ...form,
            showIncomplete: form.showIncomplete.toString(),
            cards: form.cards.map((e) => e.name),
          },
        })
      "
    >
      <label for="deckName">Deck Name</label>
      <InputText id="deckName" type="text" placeholder="Heal Midrose" v-model="form.name" />
      <span id="heroLabel">Hero</span>
      <HeroSelect
        v-model="form.hero as any"
        aria-labelledby="heroLabel"
        showClear
        class="hero-picker"
      />
      <label for="cards">Includes Cards</label>
      <AutoComplete
        v-model="form.cards"
        optionLabel="name"
        :suggestions="cardSuggestions"
        @complete="searchCards"
        forceSelection
        multiple
        fluid
        inputId="cards"
      >
        <template #option="slotProps">
          <div class="autocomplete-item">
            <img :alt="slotProps.option.name" :src="slotProps.option.image" />
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
        <template #chip="slotProps">
          <Chip
            :label="slotProps.value.name"
            :image="slotProps.value.image"
            removable
            @remove="
              () => (form.cards = form.cards.filter((card) => card.name !== slotProps.value.name))
            "
          />
        </template>
      </AutoComplete>
      <router-link :to="{ name: 'QueryHelp' }" class="help-message">
        <Button label="Query Help" link />
      </router-link>
      <label for="show-incomplete">Show Incomplete Decks</label>
      <ToggleSwitch inputId="show-incomplete" v-model="form.showIncomplete" />
      <label for="search">Search</label>
      <SelectButton
        inputId="search"
        v-model="form.search"
        :options="['All', 'Your Decks', 'Liked Decks']"
      />
      <span id="sort">Sort</span>
      <div class="order-container">
        <Select :options="['Name', 'Recently Edited', 'Created', 'Likes']" v-model="form.sort" />
        <Select :options="['Ascending', 'Descending']" v-model="form.order" />
      </div>
      <Button type="submit" label="Search">
        <template #icon="iconClass">
          <Search :class="iconClass.class" />
        </template>
      </Button>
      <Button
        label="Clear"
        severity="secondary"
        @click.prevent="
          () =>
            Object.assign(form, {
              name: '',
              hero: null,
              showIncomplete: false,
              cards: [],
              sort: 'Name',
              order: 'Ascending',
            }) && reloadForm++
        "
      >
        <template #icon="iconClass">
          <X :class="iconClass.class" />
        </template>
      </Button>
    </form>

    <h2>Results</h2>
    <div v-if="isSearching" class="deck-container">
      <Skeleton v-for="i in paginatorAmount" :key="i" height="175px" class="deck-skeleton" />
    </div>
    <div v-else-if="results.length > 0">
      <div class="deck-container">
        <DeckCard v-for="deck of results" :key="deck.name" :deck="deck" showVisibility />
      </div>
      <Paginator
        :first="firstValue"
        @page="
          (pageState) =>
            router.push({
              name: 'SearchDecks',
              query: {
                ...form,
                showIncomplete: form.showIncomplete.toString(),
                cards: form.cards.map((e) => e.name),
                page: pageState.page + 1,
              },
            })
        "
        :rows="paginatorAmount"
        :totalRecords="totalRecords"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      />
    </div>
    <Message v-else :severity="'warn'" :closable="false"> No Decks Found </Message>
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  AutoComplete,
  type AutoCompleteCompleteEvent,
  Button,
  Chip,
  InputText,
  Message,
  Paginator,
  Select,
  SelectButton,
  Skeleton,
  ToggleSwitch,
} from 'primevue'
import { Search, X } from 'lucide-vue-next'
import DeckCard from '@/components/DeckCard.vue'
import HeroSelect from '@/components/HeroSelect.vue'
import TheFooter from '@/components/TheFooter.vue'
import useSupabase from '@/composables/UseSupabase'
import useAuthUser from '@/composables/UseAuthUser'
import getCard from '@/lib/getCard'
import generateQuery from '@/lib/parse-query/generateQuery'
import doesMatchQuery from '@/lib/matchQuery'
import throwError from '@/lib/throwError'
import { useHeartStore } from '@/store/hearts'
import plants from '@/content/plants.json'
import zombies from '@/content/zombies.json'
import type { Card, Deck } from '@/lib/types'

const route = useRoute()
const router = useRouter()
const { supabase } = useSupabase()
const { id, isSignedIn } = useAuthUser()
const reloadForm = ref(0)

const form = reactive({
  name: route.query.name?.toString() || '',
  hero: route.query.hero?.toString() || null,
  showIncomplete: route.query.showIncomplete === 'true',
  cards: (
    ((route.query.cards && typeof route.query.cards === 'string'
      ? [route.query.cards]
      : route.query.cards) || []) as string[]
  ).map((card) => getCard(card)) as Card[],
  sort: route.query.sort?.toString() || 'Name',
  order: route.query.order?.toString() || 'Ascending',
  search: route.query.search?.toString() || 'All',
})
const cardSuggestions = ref<Card[]>([])
const cards = [
  ...plants.sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name)),
  ...zombies.sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name)),
] as Card[]
const searchCards = (event: AutoCompleteCompleteEvent) => {
  if (!event.query.trim().length) {
    cardSuggestions.value = [...cards]
  } else {
    const { query } = generateQuery(event.query)
    cardSuggestions.value = cards.filter((card) => {
      return (
        card.class !== 'Removed' &&
        card.set !== 'token' &&
        card.set !== 'superpower' &&
        doesMatchQuery(card, query) &&
        !form.cards.includes(card)
      )
    })
  }
}

const paginatorAmount = 20
const isSearching = ref(true)
const results = ref<Deck[]>([])
const totalRecords = ref(0)
const firstValue = computed(
  () => ((parseInt(route.query.page as string) || 1) - 1) * paginatorAmount,
)

const search = async () => {
  isSearching.value = true

  let query = supabase
    .rpc('get_decks_with_heart_counts')
    .ilike('name', `%${(route.query.name || '').toString().replace(/ /g, '%')}%`)
  if (!route.query.showIncomplete || route.query.showIncomplete === 'false') {
    query = query.eq('is_complete', true)
  }
  if (route.query.hero) {
    query = query.eq('hero', route.query.hero)
  }
  const cards =
    (route.query.cards && typeof route.query.cards === 'string'
      ? [route.query.cards]
      : route.query.cards) || []
  for (const card of cards) {
    query = query.gte(`list->>${card}`, 1)
  }

  const orders: Record<string, string> = {
    Name: 'name',
    'Recently Edited': 'last_updated',
    Created: 'created_at',
    Likes: 'hearts',
  }

  if (route.query.search === 'Your Decks') {
    if (isSignedIn.value) {
      query = query.eq('creator', id.value)
    } else {
      results.value = []
      totalRecords.value = 0
      isSearching.value = false
      return
    }
  } else if (route.query.search === 'Liked Decks') {
    const hearts = useHeartStore()
    query = query.in('id', hearts.hearts)
  }

  const { data, error, count } = await query
    .order(orders[route.query.sort?.toString() || 'Name'] as string, {
      ascending: route.query.order ? route.query.order === 'Ascending' : true,
    })
    .range(firstValue.value, firstValue.value + paginatorAmount - 1)

  if (error) {
    throwError(error)
    isSearching.value = false
    return
  }

  results.value = data as Deck[]
  totalRecords.value = count as number
  isSearching.value = false
}

watch(() => route.query, search)
onMounted(search)
</script>

<style scoped>
main {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
.primary-color {
  color: var(--p-primary-400);
}

h1,
h2 {
  text-align: center;
}

form {
  max-width: 500px;
  margin: 0 auto;
}
label,
#heroLabel,
#sort {
  display: block;
  margin-bottom: var(--inline-space);
}

.error {
  margin-top: var(--inline-space);
  margin-bottom: var(--block-space);
  color: var(--p-red-300);
  display: block;
}

.p-inputtext,
.p-select,
.p-autocomplete,
.card-list-textarea {
  width: 100%;
}
.p-toggleswitch {
  display: block;
}

:is(
    .p-inputtext,
    .order-container,
    .p-autocomplete,
    .hero-picker,
    .card-list-textarea,
    .p-toggleswitch,
    .p-selectbutton
  ):has(+ :not(:is(small, .help-message))) {
  margin-bottom: var(--block-space);
}

.order-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--inline-space);
}

.p-button + .p-button {
  margin-left: var(--inline-space);
}

.autocomplete-item {
  display: flex;
  align-items: center;
  gap: var(--inline-space);
}
.autocomplete-item img {
  width: 2em;
  height: 100%;
}

.help-message .p-button {
  padding: 0;
  margin-top: var(--inline-space);
  margin-bottom: var(--block-space);
}

.p-message {
  margin: 0 auto;
  width: fit-content;
}
.deck-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--inline-space);
  justify-content: center;
  align-items: stretch;
}

.deck-skeleton {
  max-width: 400px;
  border-radius: (--p-card-border-radius);
}
:deep(.p-paginator) {
  margin-top: var(--block-space);
}
</style>

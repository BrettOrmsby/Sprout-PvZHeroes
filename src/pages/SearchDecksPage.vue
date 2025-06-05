<template>
  <main>
    <FilterModal />
    <!--
    <SelectButton
        inputId="search"
        v-model="form.search"
        :options="['All', 'Your Decks', 'Liked Decks']"
      />
    -->
    <h1>Search <span class="primary-color">Decks</span></h1>
    <div class="search-bar">
      <div class="left">
        <Select
          inputId="search"
          v-model="deckFilters.searchTarget"
          :options="['All Decks', 'Your Decks', 'Liked Decks']"
        />
        <InputGroup>
          <InputText
            type="text"
            v-model="deckFilters.searchTerm"
            @keydown.enter="searchWithTerm"
            placeholder="Search for a deck"
          />
          <Button @click="searchWithTerm">
            <template #icon="iconClass">
              <Search :class="iconClass.class" />
            </template>
          </Button>
        </InputGroup>
      </div>
      <div class="right">
        <Button @click="deckFilters.isModalVisible = true" label="Filters" aria-label="Filters">
          <template #icon="iconClass">
            <ListFilter :class="iconClass.class" />
          </template>
        </Button>
        <Button @click="togglePopover" label="Sort" aria-label="Sort">
          <template #icon="iconClass">
            <ArrowUpNarrowWide :class="iconClass.class" />
          </template>
        </Button>
        <Popover ref="sortPopover">
          <div style="display: flex; flex-direction: column; gap: var(--inline-space)">
            <span style="font-weight: bold">Sort By</span>
            <template v-for="(sortOption, id) in sortOptions" :key="id">
              <label :for="id"
                ><RadioButton
                  v-model="deckFilters.sortOption"
                  :input-id="id"
                  name="sortOption"
                  :value="sortOption"
                  style="margin-right: var(--inline-space)"
                />{{ sortOption }}</label
              >
            </template>
            <Divider style="margin: 0" />
            <span style="font-weight: bold">Sort Direction</span>
            <template v-for="(sortDirection, id) in sortDirectionOptions" :key="id">
              <label :for="id"
                ><RadioButton
                  v-model="deckFilters.sortDirection"
                  :input-id="id"
                  name="sortDirection"
                  :value="sortDirection"
                  style="margin-right: var(--inline-space)"
                />{{ sortDirection }}</label
              >
            </template>
          </div>
        </Popover>
      </div>
    </div>

    <h2>Results</h2>
    <div v-if="isSearching" class="deck-container">
      <Skeleton v-for="i in paginatorAmount" :key="i" height="175px" class="deck-skeleton" />
    </div>
    <Message v-else-if="isSearchError" severity="error"> Failed to load decks. </Message>
    <Message v-else-if="results.length < 1" severity="warn"> No Decks Found </Message>
    <div v-else>
      <div class="deck-container">
        <DeckCard v-for="deck of results" :key="deck.name" :deck="deck" showVisibility />
      </div>
      <Paginator
        :first="firstValue"
        @page="paginate"
        :rows="paginatorAmount"
        :totalRecords="totalRecords"
        :template="{
          '475px': 'PrevPageLink PageLinks NextPageLink',
          default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
        }"
      />
    </div>
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Button,
  Divider,
  InputGroup,
  InputText,
  Message,
  type PageState,
  Paginator,
  Popover,
  RadioButton,
  Skeleton,
  Select,
} from 'primevue'
import { ArrowUpNarrowWide, ListFilter, Search } from 'lucide-vue-next'
import DeckCard from '@/components/DeckCard.vue'
import FilterModal from '@/components/searchdecks/FilterModal.vue'
import TheFooter from '@/components/TheFooter.vue'
import useSupabase from '@/composables/UseSupabase'
import useAuthUser from '@/composables/UseAuthUser'
import throwError from '@/lib/throwError'
import { useDeckFilters } from '@/store/deckFilters'
import { useHeartStore } from '@/store/hearts'
import type { Deck } from '@/lib/types'

const route = useRoute()
const router = useRouter()
const { supabase } = useSupabase()
const { id, isSignedIn } = useAuthUser()
const deckFilters = useDeckFilters()

const sortOptions = {
  name: 'Name',
  recentlyEdited: 'Recently Edited',
  created: 'Created',
  likes: 'Likes',
}
const sortDirectionOptions = { ascending: 'Ascending', descending: 'Descending' }
const sortPopover = ref()
const togglePopover = (event: Event) => {
  sortPopover.value.toggle(event)
}

const paginatorAmount = 20
const isSearching = ref(true)
const isSearchError = ref(false)
const results = ref<Deck[]>([])
const totalRecords = ref(0)
const firstValue = computed(
  () => ((parseInt(route.query.page as string) || 1) - 1) * paginatorAmount,
)

const paginate = (pageState: PageState) =>
  router.push({
    name: 'SearchDecks',
    query: {
      ...deckFilters.queryParams,
      page: pageState.page + 1,
    },
  })

const searchWithTerm = () => {
  router.push({
    name: 'SearchDecks',
    query: deckFilters.queryParams,
  })
}

const search = async () => {
  isSearching.value = true
  isSearchError.value = false
  const query = supabase
    .rpc('get_decks_with_heart_counts')
    .ilike('name', `%${deckFilters.name.replace(/ /g, '%')}%`)
  if (deckFilters.searchTerm) {
    query.or(
      `name.ilike.%${deckFilters.searchTerm.replace(/ /g, '%')}%,hero.ilike.%${deckFilters.searchTerm.replace(/ /g, '%') || ''}%,list->>${deckFilters.searchTerm}.gte.1`,
    )
  }
  if (deckFilters.show === 'Complete Decks') {
    query.eq('is_complete', true)
  }
  if (deckFilters.hero) {
    query.eq('hero', deckFilters.hero)
  }

  for (const card of deckFilters.cards) {
    query.gte(`list->>${card.name}`, 1)
  }

  const orders: Record<string, string> = {
    Name: 'name',
    'Recently Edited': 'last_updated',
    Created: 'created_at',
    Likes: 'hearts',
  }

  if (deckFilters.searchTarget === 'Your Decks') {
    if (isSignedIn.value) {
      query.eq('creator', id.value)
    } else {
      results.value = []
      totalRecords.value = 0
      isSearching.value = false
      return
    }
  } else if (deckFilters.searchTarget === 'Liked Decks') {
    const hearts = useHeartStore()
    query.in('id', hearts.hearts)
  }

  const { data, error, count } = await query
    .order(orders[deckFilters.sortOption] ?? 'name', {
      ascending: deckFilters.sortDirection === 'Ascending',
    })
    .range(firstValue.value, firstValue.value + paginatorAmount - 1)

  if (error) {
    throwError(error)
    isSearchError.value = true
    isSearching.value = false
    return
  }

  results.value = data as Deck[]
  totalRecords.value = count as number
  isSearching.value = false
}

watch(() => route.query, search, { immediate: true })
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

.search-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--block-space);
  width: 100%;
}
.left,
.right {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--block-space);
}
@media (max-width: 600px) {
  .search-bar {
    flex-direction: column;
  }
  .left,
  .right {
    justify-content: center;
  }
}
.p-select {
  width: 170px;
  flex-shrink: 0;
  flex-grow: 0;
}

.p-inputgroup {
  max-width: 500px;
  margin: 0 auto;
}

:deep(.p-button) {
  flex-shrink: 0;
}

:deep(.p-popover-content) {
  display: flex;
  flex-direction: column;
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

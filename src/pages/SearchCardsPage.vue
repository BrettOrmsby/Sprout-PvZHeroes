<template>
  <CardModal />
  <main>
    <h1>Search <span class="primary-color">Cards</span></h1>
    <div class="help-links">
      <Button asChild v-slot="slotProps" aria-label="a">
        <RouterLink
          to="/query-help"
          style="text-decoration: none"
          :class="(slotProps as Record<string, string>).class"
        >
          <SearchCode class="p-button-icon p-button-icon-left" />
          <span class="p-button-label">Query Help</span></RouterLink
        >
      </Button>
      <Button asChild v-slot="slotProps" aria-label="a">
        <RouterLink
          to="/search/cards/advanced"
          style="text-decoration: none"
          :class="(slotProps as Record<string, string>).class"
        >
          <Filter class="p-button-icon p-button-icon-left" />
          <span class="p-button-label">Advanced Search</span></RouterLink
        >
      </Button>
    </div>
    <SideBarLayout>
      <InputGroup>
        <InputText type="text" v-model="query" placeholder="Search Query" />
        <InputGroupAddon>
          {{ matchingCards.length }}&nbsp;Card<span v-if="matchingCards.length > 1"
            >s</span
          ></InputGroupAddon
        >
      </InputGroup>
      <div class="errors" v-if="parsedQuery.errors.length > 0">
        <Message severity="error" v-for="(error, index) in parsedQuery.errors" :key="index">{{
          error.message
        }}</Message>
      </div>
      <Message v-else-if="matchingCards.length === 0" :severity="'warn'" :closable="false">
        No Cards Found
      </Message>
      <div v-else class="card-group">
        <div v-for="card in matchingCards" :key="card.name">
          <PVZCard :is-valid="true" :card="card" :amount="4" @click="showCard(card.name)" />
        </div>
      </div>
    </SideBarLayout>
    <ScrollTop />
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button, InputGroup, InputGroupAddon, InputText, Message, ScrollTop } from 'primevue'
import { Filter, SearchCode } from 'lucide-vue-next'
import PVZCard from '@/components/PVZCard.vue'
import TheFooter from '@/components/TheFooter.vue'
import CardModal from '@/components/CardModal.vue'
import SideBarLayout from '@/components/SideBarLayout.vue'
import generateQuery from '@/lib/parse-query/generateQuery'
import doesMatchQuery from '@/lib/matchQuery'
import states from '@/store/states'
import plants from '@/content/plants.json'
import zombies from '@/content/zombies.json'
import superpowers from '@/content/superpowers.json'
import heroData from '@/content/heroes.json'
import type { Card } from '@/lib/types'

const route = useRoute()
const router = useRouter()

const query = ref(route.query.query?.toString() || '')

const allCards: Card[] = [
  ...plants,
  ...zombies,
  ...superpowers.flatMap((superPower) => {
    const hero = heroData.find((hero) => hero.mainSuperPower === superPower.name)!
    return [
      { ...superPower, class: hero.class[0] },
      { ...superPower, class: hero.class[1] },
    ]
  }),
]

const parsedQuery = computed(() => generateQuery(query.value))
const matchingCards = computed(() => {
  // Manage duplicate cards with two classes
  const duplicates: Record<string, boolean> = {
    'Octo-Pet': false,
    'Zom-Bats': false,
    'Impfinity Clone': false,
    Hothead: false,
  }
  for (const superpower of superpowers) {
    duplicates[superpower.name] = false
  }
  const duplicateNames = Object.keys(duplicates)
  return (
    allCards.filter((card) => {
      if (!doesMatchQuery(card, parsedQuery.value.query)) {
        return false
      }
      if (duplicateNames.includes(card.name)) {
        if (duplicates[card.name as keyof typeof duplicates]) {
          return false
        }
        duplicates[card.name as keyof typeof duplicates] = true
      }
      return true
    }) as Card[]
  ).sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name))
})

watch(matchingCards, (newVal) => {
  if (newVal.length > 0) {
    states.cardHover = newVal[0].name
  }
})
watch(query, (newVal) => {
  document.title = (newVal || 'Search Cards') + ' • Sprout'
  router.push({ name: 'SearchCards', query: { query: newVal } })
})
onMounted(() => {
  if (matchingCards.value.length > 0) {
    states.cardHover = matchingCards.value[0].name
  }
  document.title = (query.value || 'Search Cards') + ' • Sprout'
})

const showCard = (card: string) => {
  states.cardModal.card = card
  states.cardModal.show = true
}
</script>

<style scoped>
main {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}
.primary-color {
  color: var(--p-primary-400);
}

h1 {
  text-align: center;
}
.help-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--inline-space);
  margin-bottom: var(--block-space);
}

.p-inputgroup {
  margin-bottom: var(--block-space);
  position: sticky;
  top: calc(var(--block-space) * 4);
  z-index: 10;
  flex-wrap: nowrap;
  overflow: scroll;
}

.p-message {
  width: 100%;
}
.errors {
  display: flex;
  gap: var(--inline-space);
  flex-direction: column;
}
.card-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--block-space);
  justify-content: center;
  align-items: stretch;
}
:deep(.card-container) {
  width: 100%;
  height: 100%;
  position: relative;
}
:deep(.amount) {
  display: none;
}
</style>

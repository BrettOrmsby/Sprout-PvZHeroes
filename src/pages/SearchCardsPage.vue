<template>
  <CardModal />
  <main>
    <h1>Search <span class="primary-color">Cards</span></h1>
    <div class="side-cards-container">
      <SideBar />
      <div class="main-content">
        <Toolbar>
          <template #center>
            <InputText type="text" v-model="query" placeholder="Search Query" />
          </template>
          <template #end>
            <Tag value="Primary"
              ><span
                >{{ matchingCards.length }}&nbsp;Card<span v-if="matchingCards.length > 1"
                  >s</span
                ></span
              ></Tag
            >
          </template>
        </Toolbar>
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
      </div>
    </div>
    <ScrollTop />
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, watch } from 'vue'
import type { Card } from '@/lib/types'
import generateQuery from '@/lib/parse-query/generateQuery'
import doesMatchQuery from '@/lib/matchQuery'
import plants from '@/content/plants.json'
import zombies from '@/content/zombies.json'
import Toolbar from 'primevue/toolbar'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import ScrollTop from 'primevue/scrolltop'
import Tag from 'primevue/tag'
import SideBar from '@/components/SideBar.vue'
import PVZCard from '@/components/PVZCard.vue'
import TheFooter from '@/components/TheFooter.vue'
import states from '@/store/states'
import CardModal from '@/components/CardModal.vue'
const route = useRoute()
const router = useRouter()

const query = computed({
  get() {
    return route.query.query?.toString() || ''
  },
  set(value) {
    router.push({ name: 'SearchCards', query: { query: value } })
  },
})
const parsedQuery = computed(() => generateQuery(query.value))
const matchingCards = computed(() => {
  // Manage duplicate cards with two classes
  const duplicates = {
    'Octo-Pet': false,
    'Zom-Bats': false,
    'Impfinity Clone': false,
    Hothead: false,
  }
  const duplicateNames = Object.keys(duplicates)
  return (
    [...plants, ...zombies].filter((card) => {
      if (duplicateNames.includes(card.name)) {
        if (duplicates[card.name as keyof typeof duplicates]) {
          return false
        }
        duplicates[card.name as keyof typeof duplicates] = true
      }
      return doesMatchQuery(card, parsedQuery.value.query)
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

.p-toolbar {
  margin-bottom: var(--block-space);
  position: sticky;
  top: calc(var(--block-space) * 4);
  z-index: 10;
  flex-wrap: nowrap;
  overflow: scroll;
  width: 100%;
}

:deep(:is(.p-inputtext, .p-toolbar-center)) {
  width: 100%;
}

.side-cards-container {
  display: flex;
  justify-content: center;
  align-content: center;
}
.side-cards-container .main-content {
  flex-shrink: 1;
  min-width: 0;
  width: 100%;
}
@media screen and (max-width: 650px) {
  .side-cards-container {
    display: block;
  }
  .side-cards-container :deep(.side-bar) {
    display: none;
  }
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

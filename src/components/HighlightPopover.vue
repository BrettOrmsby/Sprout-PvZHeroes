<template>
  <div>
    <h2 v-if="isTitleVisible">Card Highlighter</h2>

    <form @submit.prevent="() => {}">
      <label for="query">Query</label>
      <InputText
        id="query"
        type="text"
        :invalid="states.deckFilter.errors.length > 0"
        v-model="states.deckFilter.textQuery"
        autocapitalize="off"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
      />
      <div class="errors" v-if="states.deckFilter.errors.length">
        <Message severity="error" v-for="(error, index) in states.deckFilter.errors" :key="index">{{
          error.message
        }}</Message>
      </div>

      <label for="hideUnhighlighted">Hide Unhighlighted Cards</label>
      <ToggleSwitch inputId="hideUnhighlighted" v-model="states.deckFilter.hideCards" />
    </form>
    <router-link :to="{ name: 'QueryHelp' }">
      <Button label="Query Help" link />
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import { Button, InputText, Message, ToggleSwitch } from 'primevue'
import generateQuery from '@/lib/parse-query/generateQuery'
import doesMatchQuery from '@/lib/matchQuery'
import { useStatesStore } from '@/store/states'
import zombies from '@/content/zombies.json'
import plants from '@/content/plants.json'
import type { Card } from '@/lib/types'

const { isTitleVisible } = defineProps<{ isTitleVisible?: boolean }>()

const states = useStatesStore()
const cards = [...plants, ...zombies] as Card[]

onMounted(() => update(states.deckFilter.textQuery))

watch(() => states.deckFilter.textQuery, update)

function update(newVal: string) {
  const result = generateQuery(newVal)
  states.deckFilter.errors = result.errors
  if (newVal.length === 0 || result.query.query.length === 0) {
    states.deckFilter.cardsMatchingFilter = []
  } else {
    states.deckFilter.cardsMatchingFilter = cards
      .filter((e) => doesMatchQuery(e, result.query))
      .map((e) => e.name)
  }
}
</script>

<style scoped>
h2 {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 30ch;
  white-space: nowrap;
  margin-bottom: var(--block-space);
  margin-top: 0;
}

.errors {
  margin-top: var(--inline-space);
  margin-bottom: var(--block-space);
  display: flex;
  gap: var(--inline-space);
  flex-direction: column;
}

.p-button {
  padding: 0;
}
</style>

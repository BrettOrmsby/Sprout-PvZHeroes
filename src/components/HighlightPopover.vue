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
      <div class="errors">
        <Message severity="error" v-for="(error, index) in states.deckFilter.errors" :key="index">{{
          error.message
        }}</Message>
      </div>

      <label for="hideUnhighlighted">Hide Unhighlighted Cards</label>
      <ToggleSwitch inputId="hideUnhighlighted" v-model="states.deckFilter.hideCards" />
    </form>
    <router-link :to="{ name: 'HighlightHelp' }">
      <Button label="Highlight Help" link />
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import states from '@/store/states'
import { watch } from 'vue'
import InputText from 'primevue/inputtext'
import ToggleSwitch from 'primevue/toggleswitch'
import Message from 'primevue/message'
import Button from 'primevue/button'

import generateQuery from '@/lib/parse-query/generateQuery'
import type { Card } from '@/lib/types'
import zombies from '@/content/zombies.json'
import plants from '@/content/plants.json'
import doesMatchQuery from '@/lib/matchQuery'

const { isTitleVisible } = defineProps<{ isTitleVisible?: boolean }>()

const cards = [...plants, ...zombies] as Card[]

watch(
  () => states.deckFilter.textQuery,
  (newVal) => {
    const result = generateQuery(newVal)
    states.deckFilter.errors = result.errors
    if (newVal.length === 0 || result.query.length === 0) {
      states.deckFilter.cardsMatchingFilter = []
    } else {
      states.deckFilter.cardsMatchingFilter = cards
        .filter((e) => doesMatchQuery(e, result.query))
        .map((e) => e.name)
    }
  },
)
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

label,
#heroLabel {
  display: block;
  margin-bottom: var(--inline-space);
}

.errors {
  margin-top: var(--inline-space);
  margin-bottom: var(--block-space);
  display: flex;
  gap: var(--inline-space);
  flex-direction: column;
}

.p-inputtext,
.p-textarea,
.card-list-textarea {
  width: 100%;
}

.p-inputtext:has(+ :not(.errors)),
.p-toggleswitch {
  margin-bottom: var(--block-space);
}

.p-button {
  padding: 0;
}
</style>

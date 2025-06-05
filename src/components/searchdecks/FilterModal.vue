<template>
  <Dialog
    :draggable="false"
    :modal="true"
    v-model:visible="deckFilters.isModalVisible"
    style="max-width: 500px; width: 100%; margin: var(--block-space)"
    header="Filters"
  >
    <form @submit.prevent="submit">
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
            @remove="removeCard(slotProps.value.name)"
          />
        </template>
      </AutoComplete>
      <router-link :to="{ name: 'QueryHelp' }" class="help-message">
        <Button label="Query Help" link />
      </router-link>

      <label for="show">Show</label>
      <Select inputId="show" v-model="form.show" :options="['Complete Decks', 'All Decks']" />

      <Button type="submit" label="Search">
        <template #icon="iconClass">
          <Search :class="iconClass.class" />
        </template>
      </Button>
      <Button label="Reset" severity="secondary" @click.prevent="deckFilters.reset">
        <template #icon="iconClass">
          <X :class="iconClass.class" />
        </template>
      </Button>
    </form>
  </Dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import {
  AutoComplete,
  type AutoCompleteCompleteEvent,
  Button,
  Chip,
  Dialog,
  InputText,
  Select,
} from 'primevue'
import { Search, X } from 'lucide-vue-next'
import HeroSelect from '@/components/HeroSelect.vue'
import generateQuery from '@/lib/parse-query/generateQuery'
import doesMatchQuery from '@/lib/matchQuery'
import { useDeckFilters } from '@/store/deckFilters'
import plants from '@/content/plants.json'
import zombies from '@/content/zombies.json'
import type { Card } from '@/lib/types'

const deckFilters = useDeckFilters()
const form = reactive(deckFilters.getFormValues())

const submit = () => deckFilters.setFormValues(form)

const removeCard = (cardName: string) => {
  form.cards = form.cards.filter((card) => card.name !== cardName)
}

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
watch(
  () => deckFilters.isModalVisible,
  () => deckFilters.isModalVisible && Object.assign(form, deckFilters.getFormValues()),
)
</script>

<style scoped>
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

:is(.p-inputtext, .p-autocomplete, .hero-picker, .card-list-textarea, .p-select):has(
    + :not(:is(small, .help-message))
  ) {
  margin-bottom: var(--block-space);
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
</style>

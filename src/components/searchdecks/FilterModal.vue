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
      <HeroSelect v-model="form.hero as any" aria-labelledby="heroLabel" showClear />

      <span id="classLabel">Class</span>
      <ClassSelect v-model="form.heroClass as any" aria-labelledby="classLabel" showClear />

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
        placeholder="Peashooter"
        class="no-margin"
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
      <router-link :to="{ name: 'QueryHelp' }">
        <Button label="Query Help" link class="help" />
      </router-link>

      <label>Sparks Cost</label>
      <div class="spark-container">
        Between
        <InputNumber
          v-model="form.sparksMin"
          inputId="min"
          :min="0"
          :max="160000"
          fluid
          :useGrouping="false"
          locale="en-US"
        />
        and
        <InputNumber
          v-model="form.sparksMax"
          inputId="minmax"
          :min="0"
          :max="160000"
          fluid
          :useGrouping="false"
          locale="en-US"
        />
      </div>

      <span id="showLabel">Show</span>
      <Select
        v-model="form.show"
        :options="['Complete Decks', 'All Decks']"
        aria-labelledby="showLabel"
      />

      <div class="button-container">
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
      </div>
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
  InputNumber,
  Select,
} from 'primevue'
import { Search, X } from 'lucide-vue-next'
import HeroSelect from '@/components/HeroSelect.vue'
import ClassSelect from '@/components/ClassSelect.vue'
import generateQuery from '@/lib/parse-query/generateQuery'
import doesMatchQuery from '@/lib/matchQuery'
import { useDeckFilters } from '@/store/deckFilters'
import plants from '@/content/plants.json'
import zombies from '@/content/zombies.json'
import type { Card } from '@/lib/types'

const deckFilters = useDeckFilters()
const form = reactive({ ...deckFilters.formFilters })

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
  () => deckFilters.isModalVisible && Object.assign(form, deckFilters.formFilters),
)
</script>

<style scoped>
.spark-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--inline-space);
  margin-bottom: var(--block-space);
}
.spark-container .p-inputnumber {
  margin: 0 !important;
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

.no-margin {
  margin: 0 !important;
}
.help {
  padding: 0;
  margin-top: var(--inline-space);
  margin-bottom: var(--block-space);
  width: fit-content;
}

.button-container {
  display: flex;
  gap: var(--inline-space);
}
</style>

<template>
  <main>
    <h1>Create a Deck</h1>
    <form @submit.prevent="createDeck()">
      <label for="name">Name</label>
      <InputText
        id="name"
        type="text"
        v-model="deckInfo.name"
        :class="{ 'p-invalid': showNameError }"
        :aria-invalid="showNameError"
        aria-describedby="invalidName"
        maxlength="50"
        @blur="checkNameError"
      />
      <small v-if="showNameError" id="invalidName" class="error">Must include a name.</small>

      <span id="heroLabel">Hero</span>
      <HeroSelect v-model="deckInfo.hero" aria-labelledby="heroLabel" />

      <label for="description">Description</label>
      <Textarea
        id="description"
        :autoResize="true"
        v-model="deckInfo.description"
        maxlength="150"
      />

      <label for="deckList">Deck List (optional)</label>
      <CardListTextArea
        id="deckList"
        v-model:is-error="isCardListError"
        v-model="deckInfo.list"
        :hero="deckInfo.hero"
      />

      <span id="visibility">Visibility</span>
      <Select
        aria-labelledby="visibility"
        v-model="deckInfo.isPrivate"
        :options="visibilityOptions"
        option-label="label"
        option-value="value"
      />

      <Button label="Create" type="submit" :loading="loading" />
    </form>
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, InputText, Select, Textarea } from 'primevue'
import CardListTextArea from '@/components/CardListTextArea.vue'
import HeroSelect from '@/components/HeroSelect.vue'
import TheFooter from '@/components/TheFooter.vue'
import useSupabase from '@/composables/UseSupabase'
import useAuthUser from '@/composables/UseAuthUser'
import calculateSparkCost from '@/lib/calculateSparkCost'
import getCard from '@/lib/getCard'
import throwError from '@/lib/throwError'

const visibilityOptions = [
  { label: 'Public', value: false },
  { label: 'Private', value: true },
]

const router = useRouter()
const { supabase } = useSupabase()
const { id } = useAuthUser()

const showNameError = ref(false)
const isCardListError = ref(false)
const loading = ref(false)

interface DeckInfo {
  name: string
  hero: string
  description: string
  list: Record<string, number>
  isPrivate: boolean
}
const deckInfo = reactive<DeckInfo>({
  name: '',
  hero: 'Green Shadow',
  description: '',
  list: {},
  isPrivate: false,
})

const checkNameError = () => {
  if (deckInfo.name.trim() === '') {
    showNameError.value = true
    return true
  }
  showNameError.value = false
  return false
}

const createDeck = async () => {
  if (checkNameError() || isCardListError.value) {
    return
  }
  loading.value = true

  const { error, data } = await supabase
    .from('decks')
    .insert({
      creator: id.value,
      name: deckInfo.name,
      hero: deckInfo.hero,
      description: deckInfo.description,
      is_private: deckInfo.isPrivate,
      is_complete:
        Object.values(deckInfo.list).reduce((prev: number, curr: number) => prev + curr, 0) === 40,
      list: deckInfo.list,
      sparks: Object.entries(deckInfo.list).reduce(
        (sum, [card, quantity]) => sum + quantity * calculateSparkCost(getCard(card)),
        0,
      ),
    })
    .select('id')
    .single()

  loading.value = false

  if (error) {
    throwError(error)
    return
  }
  router.push({ name: 'ViewDeck', params: { id: data.id } })
}
</script>

<style scoped>
main {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.p-button {
  display: flex;
  width: fit-content;
}
</style>

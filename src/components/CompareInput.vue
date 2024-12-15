<template>
  <div>
    <form @submit.prevent="compareDecks()">
      <label for="url">Enter the deck URL of the comparison or search your decks.</label>
      <InputGroup>
        <InputText
          v-if="!isSignedIn"
          id="url"
          type="text"
          placeholder="Deck URL"
          v-model="to"
          :class="{ 'p-invalid': isCompareDeckError }"
        />
        <AutoComplete
          v-else
          v-model="toAutoComplete"
          optionLabel="id"
          :suggestions="filteredDecks"
          @complete="search"
          :invalid="isCompareDeckError"
          placeholder="Deck URL"
          id="url"
          :showEmptyMessage="false"
        >
          <template #option="slotProps">
            <div class="deck-select-container">
              <img
                :alt="slotProps.option.hero"
                :src="getHero(slotProps.option.hero).image"
                class="hero-image"
              />
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template></AutoComplete
        >
        <Button :loading="isCompareDeckLoading" label="Compare" type="submit" />
      </InputGroup>
      <small v-if="isCompareDeckError" class="error">{{ compareDeckErrorMessage }}</small>
    </form>
  </div>
</template>

<script lang="ts" setup>
import InputText from 'primevue/inputtext'
import InputGroup from 'primevue/inputgroup'
import AutoComplete, { type AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import Button from 'primevue/button'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import useSupabase from '@/composables/UseSupabase'
import useAuthUser from '@/composables/UseAuthUser'
import type { Deck } from '@/lib/types'
import throwError from '@/lib/throwError'
import getHero from '@/lib/getHero'

const props = defineProps<{ id: string }>()
const to = defineModel<string>({ default: '' })

const { supabase } = useSupabase()
const { isSignedIn, id } = useAuthUser()
const router = useRouter()

const filteredDecks = ref()
const decks = ref<Deck[]>([])
const toAutoComplete = computed({
  get() {
    return to.value
  },
  set(deck: Deck | string) {
    if (typeof deck === 'string') {
      to.value = deck
    } else if (deck.id) {
      to.value = `https://sprout-deckbuider.vercel.app/deck/${deck.id}`
    } else {
      to.value = ''
    }
  },
})

toAutoComplete.value
const isDeckLoadAttempted = ref(false)
const search = (event: AutoCompleteCompleteEvent) => {
  if (!isDeckLoadAttempted.value) {
    isDeckLoadAttempted.value = true
    loadDecks()
  }
  if (decks.value.length === 0) {
    return
  }

  filteredDecks.value = decks.value.filter((deck) =>
    deck.name.toLowerCase().includes(event.query.toLowerCase()),
  )
}

const loadDecks = async () => {
  const { data, error } = await supabase
    .from('decks')
    .select('*')
    .order('created_at', { ascending: false })
    .eq('creator', id.value)
    .limit(4)
    .returns<Deck[]>()

  if (error) {
    throwError(error)
  } else {
    decks.value = data
  }
}

const compareDeckErrorMessage = ref('')
const isCompareDeckError = ref(false)
const isCompareDeckLoading = ref(false)
const compareDecks = async () => {
  console.log(to)
  const toId = to.value.split('/')[to.value.split('/').length - 1]

  if (toId === props.id) {
    isCompareDeckError.value = true
    compareDeckErrorMessage.value = 'Decks must be different.'
    return
  }

  isCompareDeckLoading.value = true
  try {
    const { error } = await supabase.from('decks').select('id').eq('id', toId).single()

    if (error) {
      throw error
    }
    isCompareDeckError.value = false
    router.push({ name: 'Compare', params: { id: props.id, to: toId } })
  } catch (_) {
    isCompareDeckError.value = true
    compareDeckErrorMessage.value = 'Deck does not exist.'
  } finally {
    isCompareDeckLoading.value = false
  }
}
</script>

<style scoped>
.error {
  margin-top: var(--inline-space);
  color: var(--p-red-300);
  display: block;
}

label {
  display: block;
  margin-bottom: var(--inline-space);
}

.hero-image {
  height: 2em;
  margin-right: var(--inline-space);
}

.deck-select-container {
  display: flex;
  align-items: center;
}
</style>

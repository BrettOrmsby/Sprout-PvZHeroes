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
        maxlength="50"
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

      <label for="visibility">Make Private</label>
      <ToggleSwitch inputId="visibility" v-model="deckInfo.isPrivate" />

      <Button label="Create" type="submit" :loading="loading" />
    </form>
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, InputText, Textarea, ToggleSwitch } from 'primevue'
import CardListTextArea from '@/components/CardListTextArea.vue'
import HeroSelect from '@/components/HeroSelect.vue'
import TheFooter from '@/components/TheFooter.vue'
import useSupabase from '@/composables/UseSupabase'
import useAuthUser from '@/composables/UseAuthUser'
import throwError from '@/lib/throwError'

const router = useRouter()
const { supabase } = useSupabase()
const { id } = useAuthUser()

const showNameError = ref(false)
const isCardListError = ref(false)
const loading = ref(false)
const deckInfo = ref({
  name: '',
  hero: 'Green Shadow',
  description: '',
  list: {} as Record<string, number>,
  isPrivate: false,
})

const createDeck = async () => {
  if (deckInfo.value.name.trim() === '') {
    showNameError.value = true
    return
  } else {
    showNameError.value = false
  }
  if (isCardListError.value) {
    return
  }
  loading.value = true

  const { error, data } = await supabase
    .from('decks')
    .insert({
      creator: id.value,
      name: deckInfo.value.name,
      hero: deckInfo.value.hero,
      description: deckInfo.value.description,
      is_private: deckInfo.value.isPrivate,
      is_complete:
        Object.values(deckInfo.value.list).reduce(
          (prev: number, curr: number) => prev + curr,
          0,
        ) === 40,
      list: deckInfo.value.list,
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

label,
#heroLabel {
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
.p-textarea,
.card-list-textarea {
  width: 100%;
}

:is(.p-inputtext, .p-select, .p-textarea, .p-toggleswitch, .card-list-textarea):has(+ :not(small)) {
  margin-bottom: var(--block-space);
}

.p-button {
  display: flex;
  width: fit-content;
}
</style>

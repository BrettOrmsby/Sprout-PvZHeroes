<template>
  <Dialog
    :draggable="false"
    :modal="true"
    v-model:visible="states.editModal"
    style="max-width: 500px; width: 100%; margin: var(--block-space)"
  >
    <template #header>
      <h2>Editing {{ deck.name }}</h2>
    </template>

    <form @submit.prevent="updateDeck()">
      <label for="name">Name</label>
      <InputText
        id="name"
        type="text"
        v-model="newInfo.name"
        :class="{ 'p-invalid': showNameError }"
        maxlength="50"
        autofocus
        @blur="checkNameError"
      />
      <small v-if="showNameError" id="invalidName" class="error">Must include a name.</small>

      <label for="description">Description</label>
      <Textarea id="description" :autoResize="true" v-model="newInfo.description" maxlength="150" />

      <label for="deckList">Deck List</label>
      <CardListTextArea
        id="deckList"
        v-model:is-error="isCardListError"
        v-model="newInfo.list"
        :hero="deck.hero"
      />

      <span id="visibility">Visibility</span>
      <Select
        aria-labelledby="visibility"
        v-model="newInfo.is_private"
        :options="visibilityOptions"
        option-label="label"
        option-value="value"
      />

      <div class="footer">
        <Button
          label="Cancel"
          @click="closeModal"
          severity="secondary"
          :disabled="isDeleting || isLoading"
        />
        <Button
          :loading="isDeleting"
          label="Delete"
          @click="deleteDeck"
          severity="danger"
          :aria-expanded="isConfirmVisible"
          :aria-controls="isConfirmVisible ? 'confirm' : undefined"
          :disabled="isLoading"
        />
        <Button :loading="isLoading" label="Update" type="submit" :disabled="isDeleting" />
      </div>
    </form>
  </Dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Dialog, InputText, Select, Textarea, useConfirm } from 'primevue'
import CardListTextArea from '@/components/CardListTextArea.vue'
import useSupabase from '@/composables/UseSupabase'
import throwError from '@/lib/throwError'
import { useStatesStore } from '@/store/states'
import { useDeckStore } from '@/store/deck'

const visibilityOptions = [
  { label: 'Public', value: false },
  { label: 'Private', value: true },
]
const states = useStatesStore()
const deck = useDeckStore()

const { supabase } = useSupabase()

const newInfo = reactive({
  name: '',
  description: '',
  is_private: false,
  list: {} as Record<string, number>,
})

const showNameError = ref(false)
const isCardListError = ref(false)
const isLoading = ref(false)

const closeModal = () => (states.editModal = false)

const checkNameError = () => {
  if (newInfo.name.trim() === '') {
    showNameError.value = true
    return true
  }
  showNameError.value = false
  return false
}

const updateDeck = async () => {
  if (checkNameError() || isCardListError.value) {
    return
  }

  isLoading.value = true
  await deck.update(newInfo)

  isLoading.value = false
  states.editModal = false
}

const router = useRouter()
const isDeleting = ref(false)
const confirm = useConfirm()
const isConfirmVisible = ref(false)
const deleteDeck = () => {
  confirm.require({
    message: `Are you sure you want to delete ${deck.name}? This action cannot be undone.`,
    header: 'Confirm Delete',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    async accept() {
      isDeleting.value = true
      const { error } = await supabase.from('decks').delete().eq('id', deck.id)

      if (error) {
        isDeleting.value = false
        throwError(error)
        return
      }

      states.editModal = false
      router.push({ name: 'Home' })
    },
    onShow: () => {
      isConfirmVisible.value = true
    },
    onHide: () => {
      isConfirmVisible.value = false
    },
  })
}

watch(
  () => states.editModal,
  () => {
    Object.assign(newInfo, {
      name: deck.name,
      description: deck.description,
      is_private: deck.is_private,
      list: { ...deck.list },
    })
    showNameError.value = false
    isCardListError.value = false
  },
)
</script>

<style scoped>
h2 {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 30ch;
  white-space: nowrap;
  margin: 0;
}

.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--inline-space);
}
</style>

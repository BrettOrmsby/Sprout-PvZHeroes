<template>
  <Dialog
    :modal="true"
    :draggable="false"
    v-model:visible="isCompareModalOpen"
    style="max-width: 500px; width: 100%; margin: var(--block-space)"
    header="Compare"
  >
    <CompareInput :id="deck.id" />
  </Dialog>
  <Toolbar>
    <template #start>
      <Button
        v-if="deck.isUsersDeck"
        @click="states.editModal = true"
        severity="secondary"
        label="Settings"
        :disabled="isDuplicationLoading"
        v-tooltip.bottom="{ value: 'Settings', showDelay: 1000, hideDelay: 300 }"
      >
        <template #icon="iconClass">
          <Cog :class="iconClass.class" />
        </template>
      </Button>
      <Button
        @click="copyDeck"
        severity="secondary"
        label="Copy"
        :disabled="isDuplicationLoading"
        v-tooltip.bottom="{ value: 'Copy Deck', showDelay: 1000, hideDelay: 300 }"
      >
        <template #icon="iconClass">
          <Paperclip :class="iconClass.class" />
        </template>
      </Button>
      <Button
        v-if="isSignedIn"
        @click="duplicateDeck"
        severity="secondary"
        label="Duplicate"
        :loading="isDuplicationLoading"
        v-tooltip.bottom="{ value: 'Duplicate Deck', showDelay: 1000, hideDelay: 300 }"
      >
        <template #icon="iconClass">
          <Copy :class="iconClass.class" />
        </template>
      </Button>
      <Button
        severity="secondary"
        label="Compare"
        @click="() => (isCompareModalOpen = true)"
        :disabled="isDuplicationLoading"
        v-tooltip.bottom="{ value: 'Compare Deck', showDelay: 1000, hideDelay: 300 }"
      >
        <template #icon="iconClass">
          <Repeat :class="iconClass.class" />
        </template>
      </Button>
      <Button
        @click="(event) => highlighter.toggle(event)"
        severity="secondary"
        badgeSeverity="contrast"
        label="Highlighter"
        :disabled="isDuplicationLoading"
        :badge="numberMatchingCardsInDeck"
        v-tooltip.bottom="{ value: 'Highlighter', showDelay: 1000, hideDelay: 300 }"
      >
        <template #icon="iconClass">
          <Highlighter :class="iconClass.class" />
        </template>
      </Button>
      <Popover ref="highlighter">
        <HighlightPopover />
      </Popover>
    </template>
  </Toolbar>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Dialog, Popover, Toolbar } from 'primevue'
import { Cog, Copy, Highlighter, Paperclip, Repeat } from 'lucide-vue-next'
import CompareInput from '@/components/CompareInput.vue'
import HighlightPopover from '@/components/HighlightPopover.vue'
import useAuthUser from '@/composables/UseAuthUser'
import useSupabase from '@/composables/UseSupabase'
import throwError from '@/lib/throwError'
import { useDeckStore } from '@/store/deck'
import { useToast } from 'primevue/usetoast'
import states from '@/store/states'
import type { Deck } from '@/lib/types'

const deck = useDeckStore()

const { id, isSignedIn } = useAuthUser()
const { supabase } = useSupabase()
const router = useRouter()

const highlighter = ref()
const numberMatchingCardsInDeck = computed(() => {
  let matchingAmount = 0
  for (const [card, amount] of Object.entries(deck.list)) {
    if (states.deckFilter.cardsMatchingFilter.includes(card)) {
      matchingAmount += amount
    }
  }
  return matchingAmount.toString()
})

const isCompareModalOpen = ref(false)

const toast = useToast()
const copyDeck = async () => {
  try {
    await navigator.clipboard.writeText(
      Object.entries(deck.list)
        .map(([card, amount]) => {
          return amount + ' ' + card
        })
        .join('\n'),
    )
    toast.add({
      severity: 'success',
      summary: 'Deck Copied',
      detail: 'Your deck has been copied to the clipboard.',
      life: 3000,
    })
  } catch (_) {
    toast.add({
      severity: 'error',
      summary: 'Failed to Copy',
      detail: 'Your deck could not be copied to the clipboard.',
      life: 3000,
    })
  }
}

const isDuplicationLoading = ref(false)
const duplicateDeck = async () => {
  isDuplicationLoading.value = true
  const duplicateDeck = {
    is_complete: deck.is_complete,
    hero: deck.hero,
    description: deck.description,
    list: deck.list,
    creator: id.value,
    is_private: true,
    name: (deck.name + ' (Duplicate)').substring(0, 50),
  } as Deck

  const { error, data } = await supabase.from('decks').insert(duplicateDeck).select('id').single()

  if (error) {
    throwError(error)
    return
  }
  isDuplicationLoading.value = false
  router.push({ name: 'ViewDeck', params: { id: data.id } })
}
</script>

<style scoped>
.p-toolbar {
  margin: 0 auto;
  width: fit-content;
}
:deep(.p-toolbar-start) {
  display: flex;
  gap: var(--inline-space);
  justify-content: center;
  align-items: center;
}

.p-toolbar :deep(.p-button-label) {
  display: none;
}
@media screen and (min-width: 950px) {
  .p-toolbar :deep(.p-button-label) {
    display: inline-block;
  }
}

:deep(:is(.p-toolbar-center, .p-toolbar-end)) {
  display: none;
}
</style>

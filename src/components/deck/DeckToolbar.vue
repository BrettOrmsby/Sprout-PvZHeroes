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
  <Menubar :model="menuItems" breakpoint="300px">
    <template #item="{ item, hasSubmenu }">
      <Button
        v-if="item?.show?.() ?? true"
        :label="item.label as string"
        :loading="item.label === 'Duplicate' && isDuplicationLoading"
        :disabled="item.label !== 'Duplicate' && isDuplicationLoading"
        :aria-label="item.label as string"
        :badge="item.badge?.()"
        :badgeSeverity="item.badgeSeverity"
        text
        @click="item.onClick"
        v-tooltip.bottom="{ value: item.tooltip, showDelay: 1000, hideDelay: 300 }"
        severity="contrast"
      >
        <template #icon="icon"><component :is="item.iconComponent" :class="icon.class" /></template>
        <template v-if="hasSubmenu">
          <component :is="item.iconComponent" class="p-button-icon p-button-icon-left hide-small" />
          <span v-if="hasSubmenu" class="hide-small">{{ item.label }}</span>
          <ChevronDown v-if="hasSubmenu" class="p-button-icon p-button-icon-right" />
        </template>
      </Button>
    </template>
  </Menubar>
  <Popover ref="highlighter">
    <HighlightPopover />
  </Popover>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Dialog, Menubar, Popover } from 'primevue'
import type { MenuItem, MenuItemCommandEvent } from 'primevue/menuitem'
import {
  ChevronDown,
  CircleEllipsis,
  Cog,
  Copy,
  Highlighter,
  PackageOpen,
  Paperclip,
  Repeat,
} from 'lucide-vue-next'
import CompareInput from '@/components/CompareInput.vue'
import HighlightPopover from '@/components/HighlightPopover.vue'
import useAuthUser from '@/composables/UseAuthUser'
import useSupabase from '@/composables/UseSupabase'
import throwError from '@/lib/throwError'
import { useDeckStore } from '@/store/deck'
import { useToast } from 'primevue/usetoast'
import { useStatesStore } from '@/store/states'
import type { Deck } from '@/lib/types'

const deck = useDeckStore()
const states = useStatesStore()

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
  } catch {
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

const menuItems: MenuItem[] = [
  {
    visible: () => deck.isUsersDeck,
    label: 'Settings',
    iconComponent: Cog,
    command: () => (states.editModal = true),
    tooltip: 'Settings',
  },
  {
    label: 'Compare',
    iconComponent: Repeat,
    command: () => (isCompareModalOpen.value = true),
    tooltip: 'Compare Deck',
  },
  {
    label: 'Highlighter',
    iconComponent: Highlighter,
    command: (event: MenuItemCommandEvent) => highlighter.value.toggle(event.originalEvent),
    tooltip: 'Highlighter',
    badgeSeverity: 'contrast',
    badge: () => numberMatchingCardsInDeck.value,
  },
  {
    label: 'More',
    iconComponent: CircleEllipsis,
    items: [
      {
        label: 'Copy',
        iconComponent: Paperclip,
        command: copyDeck,
        tooltip: 'Copy Deck',
      },
      {
        visible: () => isSignedIn.value,
        label: 'Duplicate',
        iconComponent: Copy,
        command: duplicateDeck,
        tooltip: 'Duplicate Deck',
      },
      {
        label: 'Packs',
        iconComponent: PackageOpen,
        command: () => (states.suggestedPackModal = true),
        tooltip: 'Suggested Packs',
      },
    ],
  },
]
</script>

<style scoped>
.p-menubar {
  margin: 0 auto;
  width: fit-content;
}
:deep(.p-menubar-submenu) {
  min-width: unset;
}

.p-menubar :deep(:not(.p-menubar-submenu .p-button-label):is(.p-button-label)) {
  display: none;
}
.hide-small {
  display: none;
}
@media screen and (min-width: 650px) {
  .p-menubar :deep(.p-button-label) {
    display: inline-block !important;
  }
  .hide-small {
    display: block;
  }
}
</style>

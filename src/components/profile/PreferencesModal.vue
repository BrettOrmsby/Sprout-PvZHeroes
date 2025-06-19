<template>
  <CardModal />
  <Dialog
    :draggable="false"
    :modal="true"
    v-model:visible="isOpen"
    style="max-width: 900px; width: 100%; margin: var(--block-space)"
    header="User Preferences"
  >
    <span id="cardView">Card View</span>
    <Select
      aria-labelledby="cardView"
      v-model="userSettings.cardViewSettings.card_view"
      :options="cardViewOptions"
      option-label="label"
      option-value="value"
      fluid
    />
    <span>Include Extras for Text Views</span>
    <label for="showStats"
      ><Checkbox v-model="intermediateCheckboxes" inputId="showStats" value="show_stats" />
      Stats</label
    >
    <label for="showCost"
      ><Checkbox v-model="intermediateCheckboxes" inputId="showCost" value="show_cost" />
      Cost</label
    >
    <label for="showSet"
      ><Checkbox v-model="intermediateCheckboxes" inputId="showSet" value="show_set" /> Set</label
    >

    <span id="showRealStats">Show Real Stats on Sidebar and When Viewing Card</span>
    <Select
      aria-labelledby="showRealStats"
      v-model="userSettings.show_real_stats"
      :options="showRealStatsOptions"
      option-label="label"
      option-value="value"
      fluid
    />

    <Button label="Update" @click="updateCardView" :loading="isUpdating" />
    <h2>Preview Changes</h2>
    <SideBarLayout>
      <CardContainer>
        <PVZCard
          v-for="card in exampleCards"
          :key="card.name"
          :is-valid="true"
          :card="card"
          :amount="exampleDeck[card.name]"
          @click="showCard(card.name)"
        />
      </CardContainer>
    </SideBarLayout>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { Button, Checkbox, Dialog, Select } from 'primevue'
import CardModal from '@/components/CardModal.vue'
import CardContainer from '@/components/CardContainer.vue'
import PVZCard from '@/components/PVZCard.vue'
import SideBarLayout from '@/components/SideBarLayout.vue'
import throwError from '@/lib/throwError'
import { useUserSettingsStore } from '@/store/userSettings'
import states from '@/store/states'
import getCard from '@/lib/getCard'

const userSettings = useUserSettingsStore()

const isOpen = defineModel('open', { default: false, required: true })
const isUpdating = ref(false)
const hasUpdated = ref(false)

const cardViewOptions = [
  { label: 'Image', value: 'image' },
  {
    label: 'Text',
    value: 'text',
  },
  {
    label: 'Full Text',
    value: 'full_text',
  },
]
const showRealStatsOptions = [
  { label: 'Show Real Stats', value: true },
  {
    label: 'Hide Real Stats',
    value: false,
  },
]

const intermediateCheckboxes = computed({
  get() {
    return (['show_stats', 'show_set', 'show_cost'] as const).filter(
      (key) => userSettings.cardViewSettings[key],
    )
  },
  set(value: ('show_stats' | 'show_set' | 'show_cost')[]) {
    for (const key of ['show_stats', 'show_set', 'show_cost'] as const) {
      userSettings.cardViewSettings[key] = value.includes(key)
    }
  },
})

const updateCardView = async () => {
  isUpdating.value = true
  const error = await userSettings.update({
    show_real_stats: userSettings.show_real_stats,
    ...userSettings.cardViewSettings,
  })
  isUpdating.value = false
  if (error) {
    throwError(error)
  } else {
    hasUpdated.value = true
    isOpen.value = false
  }
}

watch(isOpen, () => {
  if (isOpen.value) {
    userSettings.backup()
  } else if (hasUpdated.value) {
    hasUpdated.value = false
  } else {
    userSettings.restore()
  }
})

const showCard = (card: string) => {
  states.cardModal.card = card
  states.cardModal.show = true
}
const exampleDeck: Record<string, number> = {
  'Pea Pod': 3,
  Torchwood: 4,
  'Black-Eyed Pea': 3,
  'Fire Peashooter': 1,
  'Sweet Pea': 1,
  'Cosmic Pea': 1,
  Fertilize: 1,
  Flourish: 1,
  'Grow-Shroom': 4,
  'The Podfather': 4,
  Skyshooter: 1,
  'Gatling Pea': 2,
  'Pod Fighter': 1,
  'Snow Pea': 4,
  Brainana: 1,
  Threepeater: 4,
  Repeater: 2,
  'Onion Rings': 1,
  'Bananasaurus Rex': 1,
}
const exampleCards = Object.keys(exampleDeck)
  .map((e) => getCard(e))
  .sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name))
</script>

<style scoped>
label,
span {
  display: block;
  margin-bottom: var(--inline-space);
}

.p-select,
label:has(.p-checkbox-input):last-of-type {
  margin-bottom: var(--block-space);
}
</style>

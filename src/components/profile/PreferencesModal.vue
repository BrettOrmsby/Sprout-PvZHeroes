<template>
  <CardModal />
  <Dialog
    :draggable="false"
    :modal="true"
    v-model:visible="isOpen"
    style="mx-width: 900px; width: 100%; margin: var(--block-space)"
    header="User Preferences"
    ><span id="cardView">Card View</span>
    <InputGroup>
      <Select
        aria-labelledby="cardView"
        v-model="userSettings.cardView"
        :options="cardViewOptions"
        option-label="label"
        option-value="value"
      />
      <Button label="Update" @click="updateCardView" :loading="isUpdatingCardView" />
    </InputGroup>
    <h2>Example Deck</h2>
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
import { ref, watch } from 'vue'
import { Button, Dialog, InputGroup, Select } from 'primevue'
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
const initialCardView = ref(userSettings.cardView)
const isUpdatingCardView = ref(false)
const hasUpdatedCardView = ref(false)

const cardViewOptions = [
  { label: 'Image', value: 'image' },
  {
    label: 'Text',
    value: 'text',
  },
]

const updateCardView = async () => {
  if (userSettings.cardView === initialCardView.value) {
    isOpen.value = false
    return
  }

  isUpdatingCardView.value = true
  const error = await userSettings.update({
    card_view: userSettings.cardView as 'image' | 'text',
  })
  isUpdatingCardView.value = false
  if (error) {
    throwError(error)
  } else {
    hasUpdatedCardView.value = true
    isOpen.value = false
  }
}

watch(isOpen, () => {
  if (isOpen.value) {
    initialCardView.value = userSettings.cardView
  } else if (hasUpdatedCardView.value) {
    hasUpdatedCardView.value = false
  } else {
    userSettings.cardView = initialCardView.value
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
span:has(+ :is(.p-select, .p-inputgroup)) {
  display: block;
  margin-bottom: var(--inline-space);
}
</style>

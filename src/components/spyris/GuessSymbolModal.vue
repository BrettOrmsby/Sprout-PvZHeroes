<template>
  <Dialog
    :draggable="false"
    :modal="true"
    v-model:visible="spyris.isSymbolModalOpen"
    style="max-width: 500px; width: 100%; margin: var(--block-space)"
    header="Guess a Symbol"
  >
    <InputText v-model="filter" aria-label="Search" placeholder="Search" />
    <div class="ability-image-list">
      <Button
        v-for="imgName of filteredAbilities"
        :key="imgName"
        :disabled="spyris.guesses.includes(imgName)"
        @click="
          () => {
            spyris.guess(imgName === 'bullseye' ? 'truestrike' : imgName)
            spyris.isSymbolModalOpen = false
          }
        "
      >
        <img :src="getAbilityImageSrc(imgName)" :alt="imgName" />
      </Button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Dialog, Button, InputText } from 'primevue'
import { useSpyrisStore } from '@/store/games/spyris'

const spyris = useSpyrisStore()

const abilityImages = [
  'anti-hero',
  'deadly',
  'doublestrike',
  'frenzy',
  'overshoot',
  'star',
  'strength',
  'strikethrough',
  'truestrike',
  'armored',
  'heart',
  'untrickable',
  'brain',
  'frozen',
  'sun',
  'bullseye',
  'strength-heart',
]
const allAbilityImages = [...abilityImages]
for (const stat of ['sun', 'brain', 'health', 'strength']) {
  for (let i = 0; i < 10; i++) {
    allAbilityImages.push(i + stat)
    if (i > 0) {
      allAbilityImages.push('+' + i + stat)
      allAbilityImages.push('-' + i + stat)
    }
  }
}

const filter = ref('')
const filteredAbilities = computed(() =>
  allAbilityImages.filter((ability) => ability.includes(filter.value.toLowerCase())),
)

const getAbilityImageSrc = (imageName: string) => {
  if (abilityImages.includes(imageName)) {
    return `/images/abilities/${imageName === 'bullseye' ? 'truestrike' : imageName}.png`
  } else if (/^[0-9](sun|brain|health|strength)$/i.test(imageName)) {
    return `/images/stats/${imageName.replace(/\d/, '').toLowerCase()}/${imageName.match(/^\d/)}.png`
  } else if (/^(\+|-)[1-9](health|strength|sun|brain)$/i.test(imageName)) {
    return `/images/stats/${imageName.replace(/(\+|-)\d/, '').toLowerCase()}/${imageName.includes('+') ? 'plus' : 'minus'}/${imageName.match(/\d/)}.png`
  }
  return ''
}
</script>

<style scoped>
.p-inputtext {
  width: 100%;
  margin-bottom: var(--block-space);
}
.ability-image-list {
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--block-space);
  height: min(300px, 50vh);
  overflow: scroll;
}
.p-button {
  width: 120px;
  height: 120px;
}
.ability-image-list img {
  height: 100%;
  width: 100%;
  object-fit: contain;
}
</style>

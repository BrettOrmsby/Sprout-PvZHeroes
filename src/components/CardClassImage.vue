<template>
  <div class="icon-container">
    <span v-if="card.class === 'Removed'">Removed</span>
    <template v-else>
      <img
        v-for="className in classImages"
        :key="className"
        class="class-icon"
        :src="`/images/classes/${className.toLowerCase()}.png`"
        :alt="className"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import heros from '@/content/heros.json'
import type { Card } from '@/lib/types'
import { computed } from 'vue'

const props = defineProps<{ card: Card }>()

const startOverrides = {
  'Zom-Bats': 'brainy',
  'Impfinity Clone': 'sneaky',
  Hothead: 'kabloom',
}

const endOverrides = { 'Octo-Pet': 'sneaky' }

const classImages = computed(() => {
  if (props.card.class === 'Removed') {
    return []
  }
  if (props.card.class) {
    const images = [props.card.class]
    if (props.card.name in startOverrides) {
      images.unshift(startOverrides[props.card.name as keyof typeof startOverrides])
    }
    if (props.card.name in endOverrides) {
      images.push(endOverrides[props.card.name as keyof typeof endOverrides])
    }
    return images
  }
  return getMainSuperClasses(props.card)
})

const getMainSuperClasses = (superpower: Card) =>
  [...heros.plants, ...heros.zombies].find((hero) => hero.mainSuperPower === superpower.name)!.class
</script>

<style scoped>
.icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--inline-space);
}
.class-icon {
  width: 1em;
}
</style>

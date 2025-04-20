<template>
  <Badge :class="card.rarity">{{ label }}</Badge>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Badge } from 'primevue'
import { type Card } from '@/lib/types'
const props = defineProps<{ card: Card }>()

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const label = computed(
  () => `${capitalize(props.card.set)} - ${props.card.rarity.charAt(0).toUpperCase()}`,
)
</script>

<style scoped>
.p-badge {
  margin: 0;
  color: #151515;
  font-size: 0.6em;
  border-radius: 100em;
  background: var(--rarity-background);
}
</style>

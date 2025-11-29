<template>
  <div class="card-list-container">
    <div v-for="({ card, usage }, i) in list" :key="card" class="card-item">
      <div class="number">
        {{ startCount === 'high' ? 10 - i : i + 1 }}
      </div>
      <PVZCard :is-valid="true" :card="getCard(card)" :amount="4" @click="showCard(card)" />
      <div class="usage">{{ usage.toFixed(3) }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import getCard from '@/lib/getCard'
import PVZCard from '../PVZCard.vue'
import type { CardAndUsage } from '@/lib/types'
import { useStatesStore } from '@/store/states'

defineProps<{ list: CardAndUsage[]; startCount: 'high' | 'low' }>()
const states = useStatesStore()

const showCard = (card: string) => {
  states.cardModal.card = card
  states.cardModal.show = true
}
</script>

<style scoped>
.card-list-container {
  display: flex;
  justify-content: center;
  gap: var(--block-space);
  margin-top: var(--inline-space);
  flex-wrap: wrap;
}

.card-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  gap: var(--inline-space);
}

.number {
  font-size: 2rem;
  color: var(--p-primary-500);
  font-weight: bold;
}
.individual-card-container {
  width: 60px;
  height: 90px;
}
:deep(.card-image) {
  width: 50px;
}
:deep(.amount) {
  display: none;
}
</style>

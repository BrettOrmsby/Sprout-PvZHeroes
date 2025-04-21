<template>
  <div
    @mouseover="() => (states.cardHover = card.name)"
    :class="{
      'card-container': true,
      'not-valid': !isValid,
      [card.rarity.toLowerCase()]: true,
    }"
  >
    <div class="invisible">
      {{ card.name }}
    </div>
    <div class="amount">
      <strong>{{ amount }}</strong>
    </div>

    <img
      :src="card.image"
      :alt="`${card.name}, ${card.cost}-cost, ${card.strength}/${card.health}`"
      class="card-image"
    />
  </div>
</template>

<script lang="ts" setup>
import states from '@/store/states'
import type { Card } from '@/lib/types'

defineProps<{ card: Card; amount: number; isValid: boolean }>()
</script>

<style scoped>
.card-container {
  border-radius: var(--p-border-radius-md);
  aspect-ratio: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: var(--inline-space);
  padding: var(--inline-space);
  cursor: pointer;
  background: var(--rarity-background);
}

.card-container:hover {
  outline: 1px solid var(--p-primary-400);
}

.invisible {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 5px 5px 0;
  color: rgba(0, 0, 0, 0);
  font-size: 12px;
  font-family: sans-serif;
  text-align: left;
  pointer-events: none;
  z-index: 1;
}

.amount {
  position: relative;
  height: 100%;
}
.amount strong {
  position: absolute;
  font-size: 1.2em;
  left: calc(var(--inline-space) * -1);
  bottom: calc(var(--inline-space) * -1);
  padding: var(--inline-space);
  color: white;
  background: color-mix(in srgb, var(--p-surface-950) 50%, transparent);
  border-radius: var(--p-border-radius-md);
}

.card-image {
  color: var(--p-surface-900);
}
.not-valid {
  opacity: 0.5;
}
.not-valid img {
  filter: grayscale(100%);
}

@media only screen and (max-width: 600px) {
  .card-image {
    width: 60px;
  }
}

@media only screen and (min-width: 600px) {
  .card-image {
    width: 75px;
  }
}

@media only screen and (min-width: 768px) {
  .card-image {
    width: 100px;
  }
}
</style>

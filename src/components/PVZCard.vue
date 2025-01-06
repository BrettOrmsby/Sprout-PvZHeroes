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
import type { Card } from '@/lib/types'
import states from '@/store/states'
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
  color: var(--p-surface-900);
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
  background: color-mix(in srgb, var(--p-surface-950) 50%, transparent);
  border-radius: var(--p-border-radius-md);
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

.common {
  background: #f5f5dc;
}
.uncommon {
  background: #959a9d;
}
.rare {
  background: #ea9c45;
}
.super-rare {
  background: #885cd5;
}
.legendary {
  position: relative;
  background: transparent;
}
.legendary {
  background: linear-gradient(to bottom right, #a158dc, #f462f4, #f3ea94, #c5f882, #5ba3f0);
}
.event {
  background: #e66d59;
}
.token {
  background: var(--p-surface-800);
}
</style>

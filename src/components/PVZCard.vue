<template>
  <div
    v-if="userSettings.cardView === 'text' && !forceImage"
    @mouseover="() => (states.cardHover = card.name)"
    :class="{ 'text-view': true, 'not-valid': !isValid }"
  >
    <div class="left">
      <span class="amount">{{ amount }}</span>
      <span class="card-name">{{ card.name }}</span>
    </div>
    <div class="right">
      <div class="stats">
        <span v-if="card.strength !== null">{{ card.strength }}/{{ card.health }}</span>
      </div>
      <span class="cost">{{ card.cost }}</span>
      <SetPill :card="card" />
    </div>
  </div>
  <div
    v-else
    @mouseover="() => (states.cardHover = card.name)"
    :class="{
      'individual-card-container': true,
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
import SetPill from '@/components/SetPill.vue'
import states from '@/store/states'
import { useUserSettingsStore } from '@/store/userSettings'
import type { Card } from '@/lib/types'

defineProps<{ card: Card; amount: number; isValid: boolean; forceImage?: boolean }>()

const userSettings = useUserSettingsStore()
</script>

<style scoped>
.text-view {
  width: 100%;
  display: flex;
  gap: var(--inline-space);
  border-bottom: 1px solid var(--p-content-border-color);
  justify-content: space-between;
  align-items: center;
  padding: var(--inline-space);
  cursor: pointer;
  transition-duration: var(--p-transition-duration);
}
.left,
.right {
  display: flex;
  gap: var(--inline-space);
  align-items: center;
}
.text-view:hover .card-name {
  text-decoration: underline;
  text-decoration-color: var(--p-primary-400);
}
.text-view .stats {
  width: 3ch;
  text-align: center;
}
.text-view .amount {
  color: var(--p-text-muted-color);
  width: 1ch;
}
.p-badge {
  width: 80px;
}
.text-view.highlighted {
  background-color: var(--p-content-hover-background);
}

.individual-card-container {
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
  transition-duration: var(--p-transition-duration);
  outline: 1px solid transparent;
}
.individual-card-container.highlighted {
  outline-offset: 4px;
  outline: 2px solid var(--p-yellow-400);
}

.individual-card-container:hover {
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
.hidden {
  display: none;
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

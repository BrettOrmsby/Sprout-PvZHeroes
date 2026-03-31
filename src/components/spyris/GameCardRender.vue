<template>
  <FullCardRender :card="spyris.cardRender" />
</template>

<script lang="ts" setup>
import FullCardRender from '../FullCardRender.vue'
import { useSpyrisStore } from '@/store/games/spyris'

const spyris = useSpyrisStore()
</script>

<style scoped>
:deep(:is(.card-name, .type-line)) {
  white-space: pre-wrap;
}
:deep(.card-background) {
  filter: grayscale(100%);
}
:deep(.card-cost) {
  color: white;
  -webkit-text-stroke: 1px black;
  background-color: var(--p-form-field-filled-background);
  border: 1px solid var(--p-content-border-color);
  border-radius: var(--p-border-radius-md);
  padding: var(--inline-space);
  display: block;
  width: auto !important;
}
:deep(.card-banner-image) {
  display: none;
}
:deep(.card-banner-container) {
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep(.card-rarity-text) {
  background-color: var(--p-form-field-filled-background);
  border: 1px solid var(--p-content-border-color);
  border-radius: var(--p-border-radius-md);
  padding: var(--inline-space);
  width: fit-content;
}
:deep(.card-flavour) {
  color: light-dark(black, white);
}
</style>

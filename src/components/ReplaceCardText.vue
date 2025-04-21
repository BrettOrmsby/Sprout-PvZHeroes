<template>
  <span class="card-text" v-html="replaceCardText"></span>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{ text: string }>()

const replaceCardText = computed(() =>
  props.text.replace(/\{\{(.+?)\}\}/g, (item) => {
    const ability = item.slice(2, -2)
    if (ability.includes(':')) {
      return `<a href="../search/cards?query=${encodeURI(ability.slice(ability.indexOf(':') + 1))}" target="_blank">${ability.split(':')[0]}</a>`
    }
    return `<img class="abilityIcon" src="/images/abilities/${ability.toLowerCase()}.png" alt="${ability}"/>`
  }),
)
</script>

<style scoped>
:deep(a) {
  color: var(--p-primary-color);
  transition: var(--p-form-field-transition-duration);
  text-decoration: none;
}
:deep(a:hover) {
  color: var(--p-primary-hover-color);
}
</style>

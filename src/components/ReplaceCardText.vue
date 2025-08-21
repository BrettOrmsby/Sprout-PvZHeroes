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
      const abilityName = ability.split(':')[0]
      const query = ability.slice(ability.indexOf(':') + 1)
      return `<a href="../search/cards?query=${encodeURI(query)}" target="_blank">${abilityName}</a>`
    }
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
      'heart',
      'strength',
      'sun',
      'bullseye',
    ]
    if (abilityImages.includes(ability.toLowerCase())) {
      const normalizedAbility = ability === 'bullseye' ? 'truestrike' : ability.toLowerCase()
      return `<img src="/images/abilities/${normalizedAbility}.png" class="abilityIcon" alt="${ability}"/>`
    } else if (/^[0-9](sun|brain|health|strength)$/i.test(ability)) {
      const imageType = ability.replace(/\d/, '').toLowerCase()
      const number = ability.match(/^\d/)
      return `<img src="/images/stats/${imageType}/${number}.png" class="abilityIcon" alt="${ability}"/>`
    } else if (/^(\+|-)[1-9](health|strength|sun|brain)$/i.test(ability)) {
      const imageType = ability.replace(/(\+|-)\d/, '').toLowerCase()
      const subcategory = ability.includes('+') ? 'plus' : 'minus'
      const number = ability.match(/\d/)
      return `<img src="/images/stats/${imageType}/${subcategory}/${number}.png" class="abilityIcon" alt="${ability}"/>`
    }
    return `[[Image Failure]]`
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

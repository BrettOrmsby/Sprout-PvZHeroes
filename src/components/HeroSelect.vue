<template>
  <Select
    v-model="hero"
    :options="heroData"
    optionLabel="name"
    optionValue="name"
    placeholder="Select a Hero"
  >
    <template #value="slotProps">
      <div v-if="slotProps.value" class="hero-select-container">
        <img :alt="slotProps.value" :src="getHero(slotProps.value).image" class="hero-image" />
        <div>{{ slotProps.value }}</div>
      </div>
      <span v-else>
        {{ slotProps.placeholder }}
      </span>
    </template>
    <template #option="slotProps">
      <div class="hero-select-container">
        <img :alt="slotProps.option.name" :src="slotProps.option.image" class="hero-image" />
        <div>{{ slotProps.option.name }}</div>
      </div>
    </template>
  </Select>
</template>

<script lang="ts" setup>
import { Select } from 'primevue'
import getHero from '@/lib/getHero'
import heroData from '@/content/heroes.json'

const hero = defineModel<string>({ required: true })
</script>

<style scoped>
.hero-image {
  height: 2em;
  margin-right: var(--inline-space);
}

.hero-select-container {
  display: flex;
  align-items: center;
}
</style>

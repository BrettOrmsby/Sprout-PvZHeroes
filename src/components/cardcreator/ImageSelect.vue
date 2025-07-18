<template>
  <Select
    v-model="value"
    :options="options"
    :placeholder="placeholder"
    option-label="label"
    option-value="value"
  >
    <template #value="slotProps">
      <div v-if="slotProps.value" class="select-container">
        <img
          :alt="slotProps.value"
          :src="options.find((e) => e.value === slotProps.value)!.imgSrc"
          class="select-image"
        />
        <div style="color: var(--p-select-color)">
          {{ options.find((e) => e.value === slotProps.value)!.label }}
        </div>
      </div>
      <span v-else>
        {{ slotProps.placeholder }}
      </span>
    </template>
    <template #option="slotProps">
      <div class="select-container">
        <img :alt="slotProps.option.label" :src="slotProps.option.imgSrc" class="select-image" />
        <div>{{ slotProps.option.label }}</div>
      </div>
    </template>
  </Select>
</template>

<script lang="ts" setup>
import { Select } from 'primevue'
const value = defineModel<string>({ required: true })
defineProps<{
  placeholder: string
  options: { label: string; value: string; imgSrc: string }[]
}>()
</script>

<style scoped>
.select-image {
  height: 2em;
  margin-right: var(--inline-space);
}

.select-container {
  display: flex;
  align-items: center;
}
</style>

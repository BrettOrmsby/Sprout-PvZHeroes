<template>
  <Select v-model="chosenClass" :options="options" placeholder="Select a Class">
    <template #value="slotProps">
      <div v-if="slotProps.value" class="class-select-container">
        <img
          :alt="slotProps.value"
          :src="`/images/classes/${slotProps.value.toLowerCase()}.png`"
          class="class-image"
        />
        <div>{{ slotProps.value }}</div>
      </div>
      <span v-else>
        {{ slotProps.placeholder }}
      </span>
    </template>
    <template #option="slotProps">
      <div class="class-select-container">
        <img
          :alt="slotProps.option"
          :src="`/images/classes/${slotProps.option.toLowerCase()}.png`"
          class="class-image"
        />
        <div>{{ slotProps.option }}</div>
      </div>
    </template>
  </Select>
</template>

<script lang="ts" setup>
import { Select } from 'primevue'

const chosenClass = defineModel<string>({ required: true })

const options = [
  'Guardian',
  'Kabloom',
  'Mega-Grow',
  'Smarty',
  'Solar',
  'Beastly',
  'Brainy',
  'Crazy',
  'Hearty',
  'Sneaky',
]
</script>

<style scoped>
.class-image {
  height: 2em;
  margin-right: var(--inline-space);
}

.class-select-container {
  display: flex;
  align-items: center;
}
</style>

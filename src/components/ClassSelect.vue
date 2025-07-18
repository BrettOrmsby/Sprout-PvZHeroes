<template>
  <Select
    v-model="chosenClass"
    :options="options"
    placeholder="Select a Class"
    option-label="label"
    option-value="value"
  >
    <template #value="slotProps">
      <div v-if="slotProps.value" class="class-select-container">
        <img
          :alt="slotProps.value"
          :src="`/images/classes/${slotProps.value.toLowerCase()}.png`"
          class="class-image"
        />
        <div>{{ options.find((e) => e.value === slotProps.value)!.label }}</div>
      </div>
      <span v-else>
        {{ slotProps.placeholder }}
      </span>
    </template>
    <template #option="slotProps">
      <div class="class-select-container">
        <img
          :alt="slotProps.option.label"
          :src="`/images/classes/${slotProps.option.label.toLowerCase()}.png`"
          class="class-image"
        />
        <div>{{ slotProps.option.label }}</div>
      </div>
    </template>
  </Select>
</template>

<script lang="ts" setup>
import { Select } from 'primevue'
import { computed } from 'vue'

const chosenClass = defineModel<string>({ required: true })
const props = defineProps<{ toLowerCase?: boolean }>()
const classes = [
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
const options = computed(() =>
  classes.map((className) => ({
    label: className,
    value: props.toLowerCase ? className.toLowerCase() : className,
  })),
)
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

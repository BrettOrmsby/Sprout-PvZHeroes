<template>
  <div class="setting-container">
    <div class="option">
      <span id="cardView">Card View</span>
      <Select
        aria-labelledby="cardView"
        v-model="userSettings.cardViewSettings.card_view"
        :options="cardViewOptions"
        option-label="label"
        option-value="value"
        size="small"
      />
    </div>
    <div class="option" v-if="userSettings.cardViewSettings.card_view !== 'image'">
      <span id="textExtras">Show</span>
      <MultiSelect
        aria-labelledby="textExtras"
        v-model="intermediateMultiSelect"
        :options="textViewExtrasOptions"
        option-label="label"
        option-value="value"
        :show-toggle-all="false"
        size="small"
        placeholder="None"
      />
    </div>
    <div class="option">
      <span id="showRealStats">Real Stats</span>
      <Select
        aria-labelledby="showRealStats"
        v-model="userSettings.show_real_stats"
        :options="showRealStatsOptions"
        option-label="label"
        option-value="value"
        size="small"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { Select, MultiSelect } from 'primevue'
import { useUserSettingsStore } from '@/store/userSettings'
const userSettings = useUserSettingsStore()
const cardViewOptions = [
  { label: 'Image', value: 'image' },
  {
    label: 'Text',
    value: 'text',
  },
  {
    label: 'Full Text',
    value: 'full_text',
  },
]
const textViewExtrasOptions = [
  { label: 'Stats', value: 'show_stats' },
  {
    label: 'Cost',
    value: 'show_cost',
  },
  {
    label: 'Set',
    value: 'show_set',
  },
]
const showRealStatsOptions = [
  { label: 'Show', value: true },
  {
    label: 'Hide',
    value: false,
  },
]

const intermediateMultiSelect = computed({
  get() {
    return (['show_stats', 'show_set', 'show_cost'] as const).filter(
      (key) => userSettings.cardViewSettings[key],
    )
  },
  set(value: ('show_stats' | 'show_set' | 'show_cost')[]) {
    for (const key of ['show_stats', 'show_set', 'show_cost'] as const) {
      userSettings.cardViewSettings[key] = value.includes(key)
    }
  },
})

onMounted(() => userSettings.backup())
onUnmounted(() => userSettings.restore())
</script>

<style scoped>
.setting-container {
  display: flex;
  align-items: center;
  gap: var(--block-space);
  flex-wrap: wrap;
}
.option {
  display: flex;
  align-items: center;
  gap: var(--inline-space);
}
@media only screen and (max-width: 700px) {
  .option {
    display: grid;
    grid-template-columns: 1fr 3fr;
    width: 100%;
  }
}
</style>

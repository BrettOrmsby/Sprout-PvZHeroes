<template>
  <Tabs ref="tabview1" :value="'Guardian'" scrollable>
    <TabList>
      <Tab
        v-for="className in sortedClasses"
        :key="className"
        :value="className"
        as="div"
        class="class-container"
      >
        <img
          class="class"
          :src="'/images/classes/' + className.toLowerCase() + '.png'"
          :alt="className"
        />
        <span>{{ className }}</span>
      </Tab>
    </TabList>
    <TabPanels>
      <TabPanel v-for="(bestWorst, className) in data" :key="className" :value="className">
        <h3>{{ className }} - Most Used</h3>
        <CardUsageList :list="bestWorst.best" start-count="low" />
        <h3>{{ className }} - Least Used</h3>
        <CardUsageList :list="bestWorst.worst" start-count="high" />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<script lang="ts" setup>
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primevue'
import CardUsageList from '@/components/datasummary/CardUsageList.vue'
import type { BestAndWorst } from '@/lib/types'

defineProps<{ data: Record<string, BestAndWorst> }>()
const sortedClasses = [
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
.p-tabs {
  margin-top: var(--inline-space);
}
.class-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: var(--inline-space);
}
.class {
  height: 1em;
  width: 1em;
}
h3 {
  text-align: center;
}
</style>

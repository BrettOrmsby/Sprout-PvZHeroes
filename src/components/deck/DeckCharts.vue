<template>
  <h2>Deck Data</h2>
  <div class="chart-container">
    <GraphCardCost />
    <GraphCardClasses />
  </div>
</template>

<script lang="ts" setup>
import GraphCardClasses from './GraphCardClasses.vue'
import GraphCardCost from './GraphCardCost.vue'
</script>

<style scoped>
.chart-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--inline-space);
  align-items: center;
  justify-content: center;
}
@media screen and (max-width: 750px) {
  .chart-container {
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr;
  }
  .chart-container > * {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.chart-container > * {
  overflow: hidden;
}
h2 {
  text-align: center;
}
</style>

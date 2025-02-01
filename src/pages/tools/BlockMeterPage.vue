<template>
  <main>
    <h1><ShieldQuestion />Block Meter Probability</h1>
    <div class="table-horizontal-container">
      <h2 class="side-label">Block Meter Sections</h2>
      <div class="table-vertical-container">
        <h2 class="top-label">Number of Attacks</h2>
        <DataTable :value="table" striped-rows>
          <Column field="start" header="" frozen></Column>
          <Column
            v-for="number in 8"
            :field="number.toString()"
            :header="number.toString()"
            :key="number"
          >
            <template #body="slotProps">
              <div
                :class="{
                  'is-max': isMaxValue(slotProps.data, slotProps.data[slotProps.field]),
                  'is-blank': formatPercentage(slotProps.data[number]) === 0,
                }"
              >
                {{ formatPercentage(slotProps.data[number]) || '•' }}
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
    <p>
      This table shows the probability (in percentages) of when the Super-Block Meter will block a
      hit. The top row show the number of attacks before a block, and the side shows the current
      amounts of sections charged on the Super-Block Meter before the hits occur. The coloured cells
      represent the highest probability of the row. For example, if the Super-Block Meter is empty,
      the fourth hit is most likely to be blocked.
    </p>

    <Accordion value="1">
      <AccordionPanel value="0">
        <AccordionHeader>View Code Proof</AccordionHeader>
        <AccordionContent>
          <pre style=""><span style="color: rgb(139, 148, 158)">// JavaScript</span>

<span style="color: rgb(255, 123, 114)">const</span> table = <span style="color: rgb(210, 168, 255)">Array</span>.<span style="color: rgb(210, 168, 255)">from</span>({ <span style="color: rgb(121, 192, 255)">length</span>: <span style="color: rgb(121, 192, 255)">8</span> }, <span style="color: rgb(201, 209, 217)">() =&gt;</span> <span style="color: rgb(210, 168, 255)">Array</span>(<span style="color: rgb(121, 192, 255)">8</span>).<span style="color: rgb(210, 168, 255)">fill</span>(<span style="color: rgb(121, 192, 255)">0</span>));

<span style="color: rgb(255, 123, 114)">for</span> (<span style="color: rgb(255, 123, 114)">let</span> blockStart = <span style="color: rgb(121, 192, 255)">0</span>; blockStart &lt; <span style="color: rgb(121, 192, 255)">8</span>; blockStart++) {
  <span style="color: rgb(255, 123, 114)">for</span> (<span style="color: rgb(255, 123, 114)">let</span> attackCount = <span style="color: rgb(121, 192, 255)">1</span>; attackCount &lt;= <span style="color: rgb(121, 192, 255)">8</span>; attackCount++) {
    <span style="color: rgb(255, 123, 114)">const</span> successes = <span style="color: rgb(210, 168, 255)">countBlockSuccesses</span>(blockStart, attackCount);
    <span style="color: rgb(255, 123, 114)">const</span> totalTrials = <span style="color: rgb(121, 192, 255)">3</span> ** attackCount;
    table[blockStart][attackCount - <span style="color: rgb(121, 192, 255)">1</span>] = successes / totalTrials;
  }
}

<span style="color: rgb(255, 123, 114)">function</span> <span style="color: rgb(210, 168, 255)">countBlockSuccesses</span>(<span style="color: rgb(201, 209, 217)">blockStart, attackCount</span>) {
  <span style="color: rgb(255, 123, 114)">if</span> (attackCount === <span style="color: rgb(121, 192, 255)">0</span>) {
    <span style="color: rgb(255, 123, 114)">return</span> blockStart &lt; <span style="color: rgb(121, 192, 255)">8</span> ? <span style="color: rgb(121, 192, 255)">0</span> : <span style="color: rgb(121, 192, 255)">1</span>;
  }
  <span style="color: rgb(255, 123, 114)">if</span> (blockStart &gt;= <span style="color: rgb(121, 192, 255)">8</span>) {
    <span style="color: rgb(255, 123, 114)">return</span> <span style="color: rgb(121, 192, 255)">0</span>;
  }

  <span style="color: rgb(255, 123, 114)">let</span> sum = <span style="color: rgb(121, 192, 255)">0</span>;
  <span style="color: rgb(255, 123, 114)">for</span> (<span style="color: rgb(255, 123, 114)">let</span> blockIncrease = <span style="color: rgb(121, 192, 255)">1</span>; blockIncrease &lt;= <span style="color: rgb(121, 192, 255)">3</span>; blockIncrease++) {
    sum += <span style="color: rgb(210, 168, 255)">countBlockSuccesses</span>(blockStart + blockIncrease, attackCount - <span style="color: rgb(121, 192, 255)">1</span>);
  }
  <span style="color: rgb(255, 123, 114)">return</span> sum;
}

<span style="color: rgb(255, 123, 114)">console</span>.<span style="color: rgb(210, 168, 255)">log</span>(<span style="color: rgb(210, 168, 255)">JSON</span>.<span style="color: rgb(210, 168, 255)">stringify</span>(table, <span style="color: rgb(121, 192, 255)">null</span>, <span style="color: rgb(121, 192, 255)">2</span>));</pre>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import {
  Accordion,
  AccordionPanel,
  AccordionHeader,
  AccordionContent,
  DataTable,
  Column,
} from 'primevue'
import { ShieldQuestion } from 'lucide-vue-next'
import TheFooter from '@/components/TheFooter.vue'

const isMaxValue = (rowData: (typeof table)[number], number: number) => {
  return (
    Math.max(
      rowData[1],
      rowData[2],
      rowData[3],
      rowData[4],
      rowData[5],
      rowData[6],
      rowData[7],
      rowData[8],
    ) === number
  )
}
const formatPercentage = (number: number) => {
  return Number((number * 100).toFixed(2))
}

const table = [
  {
    start: 0,
    1: 0,
    2: 0,
    3: 0.14814814814814814,
    4: 0.4691358024691358,
    5: 0.2962962962962963,
    6: 0.07681755829903979,
    7: 0.009144947416552356,
    8: 0.0004572473708276177,
  },
  {
    start: 1,
    1: 0,
    2: 0,
    3: 0.37037037037037035,
    4: 0.4444444444444444,
    5: 0.16049382716049382,
    6: 0.023319615912208505,
    7: 0.0013717421124828531,
    8: 0,
  },
  {
    start: 2,
    1: 0,
    2: 0.1111111111111111,
    3: 0.5185185185185185,
    4: 0.30864197530864196,
    5: 0.05761316872427984,
    6: 0.00411522633744856,
    7: 0,
    8: 0,
  },
  {
    start: 3,
    1: 0,
    2: 0.3333333333333333,
    3: 0.5185185185185185,
    4: 0.13580246913580246,
    5: 0.012345679012345678,
    6: 0,
    7: 0,
    8: 0,
  },
  {
    start: 4,
    1: 0,
    2: 0.6666666666666666,
    3: 0.2962962962962963,
    4: 0.037037037037037035,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  },
  {
    start: 5,
    1: 0.3333333333333333,
    2: 0.5555555555555556,
    3: 0.1111111111111111,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  },
  {
    start: 6,
    1: 0.6666666666666666,
    2: 0.3333333333333333,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  },
  { start: 7, 1: 1, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
]
</script>

<style scoped>
main {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--inline-space);
}
h1 svg {
  color: var(--p-primary-400);
  width: 1em;
  height: 1em;
  flex-shrink: 0;
}

.table-horizontal-container {
  display: flex;
  justify-content: safe center;
  overflow: scroll;
}
.top-label {
  margin: 0;
  margin-bottom: var(--inline-space);
  text-align: center;
}
.side-label {
  writing-mode: sideways-lr;
  text-align: center;
  margin: 0;
  margin-top: calc(24px + var(--inline-space));
  margin-right: var(--inline-space);
}
.p-datatable {
  max-width: 500px;
  --p-datatable-body-cell-padding: 0.5rem;
  --p-datatable-header-cell-padding: 0.5rem;
}
:deep(.p-datatable-table) {
  width: unset;
}
:deep(td, th) {
  padding: 2px;
  text-align: center !important;
}
:deep(.p-datatable-column-header-content) {
  justify-content: center;
}
:deep(td:first-child) {
  font-weight: bold;
}
:deep(td:has(.is-max)) {
  background-color: var(--p-primary-500);
  color: var(--p-primary-contrast-color);
}

p {
  margin: var(--block-space) auto;
}
pre {
  margin: 0;
  padding: var(--block-space);
  border-radius: var(--p-border-radius-md);
  font-size: 12px;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas,
    'DejaVu Sans Mono', monospace;
  font-weight: normal;
  color: rgb(201, 209, 217);
  background-color: rgb(13, 17, 23);
}
</style>

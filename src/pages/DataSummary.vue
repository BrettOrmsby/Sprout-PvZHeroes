<template>
  <main>
    <CardModal />
    <h1><BarChart3 />{{ year }} Data Summary</h1>
    <template v-if="isLoading">
      <div v-for="index in 3" :key="index">
        <Skeleton class="title-skeleton"></Skeleton>
        <Skeleton class="graph-skeleton"></Skeleton>
      </div>
    </template>
    <Message v-else-if="isLoadError" severity="error"> Stats for {{ year }} do not exist. </Message>
    <template v-else>
      <p v-if="year === '2025'">
        Welcome to the first data summary of Sprout. If all goes as planned, this will become a
        yearly occurrence. Since it is the first, this data includes every deck, private and public,
        that is complete (has 40 cards). In future summaries, the data will be specific for decks
        updated within the year.
      </p>
      <p v-else>
        Welcome to another data summary of Sprout. As a reminder, this summary includes all public
        and private completed (40-card) decks that were updated this past year. You can view the
        previous data summary for comparisons
        <RouterLink :to="{ name: 'DataSummary', params: { year: Number(year) - 1 } }"
          >here</RouterLink
        >.
      </p>
      <h2><CircleUser />Hero Usage</h2>
      <h3>Plants</h3>
      <Chart
        :type="data.graphs.heroes.plants.type"
        :data="data.graphs.heroes.plants.data"
        :options="data.graphs.heroes.plants.options"
      />
      <h3>Zombies</h3>
      <Chart
        :type="data.graphs.heroes.zombies.type"
        :data="data.graphs.heroes.zombies.data"
        :options="data.graphs.heroes.zombies.options"
      />
      <h3>All</h3>
      <Chart
        :type="data.graphs.heroes.all.type"
        :data="data.graphs.heroes.all.data"
        :options="data.graphs.heroes.all.options"
      />
      <small>You can click or hover over bars to view the hero name.</small>

      <h2><ShieldQuestion />Class Usage</h2>
      <h3>Plants</h3>
      <Chart
        :type="data.graphs.classes.plants.type"
        :data="data.graphs.classes.plants.data"
        :options="data.graphs.classes.plants.options"
      />
      <h3>Zombies</h3>
      <Chart
        :type="data.graphs.classes.zombies.type"
        :data="data.graphs.classes.zombies.data"
        :options="data.graphs.classes.zombies.options"
      />
      <h3>All</h3>
      <Chart
        :type="data.graphs.classes.all.type"
        :data="data.graphs.classes.all.data"
        :options="data.graphs.classes.all.options"
      />
      <h2><ShieldBan />Average Class Representation in Decks</h2>
      <Chart
        :type="data.graphs.classes.cardUsage.type"
        :data="data.graphs.classes.cardUsage.data"
        :options="data.graphs.classes.cardUsage.options"
      />
      <h2><Star />Average Rarities Used</h2>
      <Chart
        :type="data.graphs.rarity.type"
        :data="data.graphs.rarity.data"
        :options="data.graphs.rarity.options"
      />
      <h2><BarChart2 />Average Deck Cost Curve</h2>
      <Chart
        :type="data.graphs.curve.type"
        :data="data.graphs.curve.data"
        :options="data.graphs.curve.options"
      />
      <h2><Shapes /> Average Card Types Used</h2>
      <Chart
        :type="data.graphs.types.type"
        :data="data.graphs.types.data"
        :options="data.graphs.types.options"
      />
      <small>Fighter refers to a plant or zombie.</small>
      <h2><AlignEndHorizontal />Most and Least Used Cards</h2>
      <small
        >Card usage is controlled by the possible decks the card can be played in. Thus, the number
        below the card is the average number of these cards in a deck that can play it.</small
      >
      <h3>Most Used Cards</h3>
      <CardUsageList :list="data.bestWorst.best" start-count="low" />
      <h3>Least Used Cards</h3>
      <CardUsageList :list="data.bestWorst.worst" start-count="high" />
      <h3>By Class</h3>
      <BestWorstTabs :data="data.bestWorst.classes" />
    </template>
    <div v-if="availableYears.length && !isLoading">
      <h2>All Data Summaries</h2>
      <ul>
        <li v-for="year in availableYears">
          <RouterLink :to="{ name: 'DataSummary', params: { year } }">{{ year }}</RouterLink>
        </li>
      </ul>
    </div>
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import { onMounted, watch, ref } from 'vue'
import { Message, Skeleton } from 'primevue'
import Chart from 'primevue/chart'
import {
  AlignEndHorizontal,
  BarChart2,
  BarChart3,
  CircleUser,
  Shapes,
  ShieldBan,
  ShieldQuestion,
  Star,
} from 'lucide-vue-next'
import TheFooter from '@/components/TheFooter.vue'
import CardUsageList from '@/components/datasummary/CardUsageList.vue'
import BestWorstTabs from '@/components/datasummary/BestWorstTabs.vue'
import CardModal from '@/components/CardModal.vue'
import type { DataSummary } from '@/lib/types'

const props = defineProps<{ year: string }>()
const isLoading = ref(true)
const isLoadError = ref(false)
const data = ref<DataSummary>({} as DataSummary)
const availableYears = ref<string[]>([])

onMounted(loadYearStats)

watch(() => props.year, loadYearStats)

async function loadYearStats() {
  isLoading.value = true
  isLoadError.value = false
  try {
    const modules = import.meta.glob('@/assets/datasummary/*.json')
    availableYears.value = Object.keys(modules).map((path) => path.match(/(\d{4}).json$/)![1])

    const module = (await modules[`/src/assets/datasummary/${props.year}.json`]()) as {
      default: DataSummary
    }
    data.value = module.default
  } catch {
    isLoadError.value = true
  }
  isLoading.value = false
}
</script>

<style scoped>
main {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

h1,
h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--inline-space);
  text-align: center;
}

:is(h1, h2) svg {
  width: 1em;
  height: 1em;
  color: var(--p-primary-400);
  flex-shrink: 0;
}

h1,
h2,
h3 {
  text-align: center;
}
h3 {
  margin-bottom: 0;
}

a {
  color: var(--p-primary-color);
  transition: var(--p-transition-duration);
  text-decoration: none;
}
a:hover {
  color: var(--p-primary-hover-color);
}
p {
  margin: 0 auto;
}
small {
  color: var(--p-text-muted-color);
  text-align: center;
  display: block;
  max-width: 70ch;
  margin: 0 auto;
}

.title-skeleton {
  height: 2em !important;
  max-width: 300px !important;
  margin: 0 auto;
  border-radius: var(--p-border-radius-xl);
  margin-bottom: var(--inline-space);
}
.graph-skeleton {
  aspect-ratio: 2 / 1;
  width: 100% !important;
  height: 100% !important;
  border-radius: var(--p-border-radius-xl);
  margin-bottom: var(--block-space);
}
</style>

<template>
  <Chart type="bar" :data="typeData" :options="typeOptions" />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import Chart from 'primevue/chart'
import getCard from '@/lib/getCard'
import { useDeckStore } from '@/store/deck'
import type { Card } from '@/lib/types'

const deck = useDeckStore()

const graphColours = ref({
  muted: '',
  gridLines: '',
  blue: '',
  blueHover: '',
  green: '',
  greenHover: '',
  gray: '',
  grayHover: '',
})

onMounted(() => {
  const documentStyles = getComputedStyle(document.documentElement)
  Object.assign(graphColours.value, {
    muted: documentStyles.getPropertyValue('--p-text-muted-color'),
    gridLines: documentStyles.getPropertyValue('--p-content-border-color'),
    blue: documentStyles.getPropertyValue('--p-blue-400'),
    blueHover: documentStyles.getPropertyValue('--p-blue-300'),
    green: documentStyles.getPropertyValue('--p-green-400'),
    greenHover: documentStyles.getPropertyValue('--p-green-300'),
    gray: documentStyles.getPropertyValue('--p-gray-400'),
    grayHover: documentStyles.getPropertyValue('--p-gray-300'),
  })
})

const cardCostData = computed(() => {
  const barSections = {
    '0': 0,
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
    '7': 0,
    '8': 0,
    '9': 0,
    '10': 0,
  }
  const data = {
    fighter: { ...barSections },
    trick: { ...barSections },
    environment: { ...barSections },
  }
  Object.entries(deck.list).forEach(([cardName, quantity]) => {
    const card = getCard(cardName)
    const type = getCardChartSection(card)
    data[type][card.cost as unknown as keyof typeof barSections] += quantity
  })

  return data
})

const getCardChartSection = (card: Card): 'fighter' | 'trick' | 'environment' => {
  if (['plant', 'zombie'].includes(card.type.toLowerCase())) return 'fighter'
  return card.type.toLowerCase() as 'trick' | 'environment'
}

const typeData = computed(() => {
  return {
    labels: Object.keys(cardCostData.value.fighter),
    datasets: [
      {
        type: 'bar',
        label: 'Fighter',
        data: Object.values(cardCostData.value.fighter),
        backgroundColor: graphColours.value.blue,
        hoverBackgroundColor: graphColours.value.blueHover,
        borderColor: 'transparent',
        borderWidth: 1,
      },
      {
        type: 'bar',
        label: 'Trick',
        data: Object.values(cardCostData.value.trick),
        backgroundColor: graphColours.value.gray,
        hoverBackgroundColor: graphColours.value.grayHover,
        borderColor: 'transparent',
        borderWidth: 1,
      },
      {
        type: 'bar',
        label: 'Environment',
        data: Object.values(cardCostData.value.environment),
        backgroundColor: graphColours.value.green,
        hoverBackgroundColor: graphColours.value.greenHover,
        borderColor: 'transparent',
        borderWidth: 1,
      },
    ],
  }
})

const typeOptions = computed(() => {
  return {
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: graphColours.value.gridLines,
        },
        stacked: true,
        title: {
          text: 'Number of Cards',
          display: true,
          color: graphColours.value.muted,
        },
        ticks: {
          color: graphColours.value.muted,
        },
      },
      x: {
        stacked: true,
        grid: {
          color: 'transparent',
        },
        title: {
          text: 'Card Cost',
          display: true,
          color: graphColours.value.muted,
        },
        ticks: {
          color: graphColours.value.muted,
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: graphColours.value.muted,
        },
      },
      title: {
        text: 'Card Amount',
      },
      tooltips: {
        mode: 'y',
        intersect: false,
      },
    },
  }
})
</script>

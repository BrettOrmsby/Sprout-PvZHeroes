<template>
  <h2>Deck Data</h2>
  <div class="chart-container">
    <Chart type="bar" :data="typeData" :options="typeOptions" />
  </div>
</template>

<script lang="ts" setup>
import { useDeckStore } from '@/store/deck'
import getCard from '@/lib/getCard'
import { computed, onMounted, ref } from 'vue'
import Chart from 'primevue/chart'

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

const cardsInDeck = computed(() => {
  const deckCards = []
  for (const key in deck.list) {
    const card = getCard(key)
    for (let i = 0; i < deck.list[key]; i++) {
      deckCards.push(card)
    }
  }
  return deckCards
})

const cardData = computed(() => {
  const data = {
    fighter: {
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
    },
    trick: {
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
    },
    environment: {
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
    },
  }
  cardsInDeck.value.forEach((e) => {
    let type = e.type.toLowerCase()
    if (type === 'plant' || type === 'zombie') {
      type = 'fighter'
    }
    data[type as keyof typeof data][e.cost as unknown as keyof typeof data.fighter] += 1
  })

  return data
})

const typeData = computed(() => {
  return {
    labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    datasets: [
      {
        type: 'bar',
        label: 'Fighter',
        data: Object.values(cardData.value.fighter),
        backgroundColor: graphColours.value.blue,
        hoverBackgroundColor: graphColours.value.blueHover,
        borderColor: 'transparent',
        borderWidth: 1,
      },
      {
        type: 'bar',
        label: 'Trick',
        data: Object.values(cardData.value.trick),
        backgroundColor: graphColours.value.gray,
        hoverBackgroundColor: graphColours.value.grayHover,
        borderColor: 'transparent',
        borderWidth: 1,
      },
      {
        type: 'bar',
        label: 'Environment',
        data: Object.values(cardData.value.environment),
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
          text: 'Amount of cards',
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
          text: 'Card cost',
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

<style scoped>
.chart-container {
  margin: 0 auto;
  max-width: 700px;
}
h2 {
  text-align: center;
}
</style>

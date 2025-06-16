<template>
  <Chart type="doughnut" :data="typeData" :options="options" />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import Chart from 'primevue/chart'
import getCard from '@/lib/getCard'
import getHero from '@/lib/getHero'
import { useDeckStore } from '@/store/deck'

const deck = useDeckStore()
const hero = computed(() => getHero(deck.hero))

const classColours: Record<string, string> = {
  Guardian: '#492F1C',
  Kabloom: '#A03732',
  'Mega-Grow': '#64A65B',
  Smarty: '#A3A2A4',
  Solar: '#D6D848',

  Beastly: '#4771A6',
  Brainy: '#91398D',
  Crazy: '#6331B9',
  Hearty: '#9B762C',
  Sneaky: '#3A3939',
}

const mutedColour = ref()
onMounted(
  () =>
    (mutedColour.value = getComputedStyle(document.documentElement).getPropertyValue(
      '--p-text-muted-color',
    )),
)

const cardClassData = computed(() => {
  const data = {
    [hero.value.class[0]]: 0,
    [hero.value.class[1]]: 0,
  }
  Object.entries(deck.list).forEach(([cardName, quantity]) => {
    const card = getCard(cardName)
    data[card.class] += quantity
  })

  return data
})

const typeData = computed(() => {
  return {
    labels: Object.keys(cardClassData.value),
    datasets: [
      {
        label: 'Number of Cards',
        data: Object.values(cardClassData.value),
        backgroundColor: Object.keys(cardClassData.value).map(
          (cardClass) => classColours[cardClass],
        ),
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  }
})

const options = computed(() => {
  return {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: mutedColour.value,
        },
      },
    },
  }
})
</script>

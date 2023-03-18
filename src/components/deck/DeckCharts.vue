<script lang="ts">
export default {
  name: "DeckCharts",
};
</script>

<template>
  <h2>Deck Data</h2>
  <Chart type="bar" :data="typeData" :options="typeOptions" />
</template>

<script lang="ts" setup>
import deck from "@/store/deck";
import getCard from "@/lib/getCard";
import { computed, ref, onMounted } from "vue";
import Chart from "primevue/chart";

let graphColours = ref({
  color: "",
  muted: "",
  gridLines: "",
  blue: "",
  blueHover: "",
  green: "",
  greenHover: "",
  gray: "",
  grayHover: "",
});

onMounted(() => {
  const documentStyles = getComputedStyle(document.documentElement);
  Object.assign(graphColours.value, {
    color: documentStyles.getPropertyValue("--text-color"),
    muted: documentStyles.getPropertyValue("--text-color-secondary"),
    gridLines: documentStyles.getPropertyValue("--surface-border"),
    blue: documentStyles.getPropertyValue("--primary-500"),
    blueHover: documentStyles.getPropertyValue("--primary-300"),
    green: documentStyles.getPropertyValue("--teal-500"),
    greenHover: documentStyles.getPropertyValue("--teal-300"),
    gray: documentStyles.getPropertyValue("--surface-500"),
    grayHover: documentStyles.getPropertyValue("--surface-600"),
  });
});

const cardsInDeck = computed(() => {
  const deckCards = [];
  for (const key in deck.list) {
    const card = getCard(key);
    for (let i = 0; i < deck.list[key]; i++) {
      deckCards.push(card);
    }
  }
  return deckCards;
});

const cardData = computed(() => {
  const data = {
    fighter: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
    },
    trick: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
    },
    environment: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
    },
  };
  cardsInDeck.value.forEach((e) => {
    let type = e.type.toLowerCase();
    if (type === "plant" || type === "zombie") {
      type = "fighter";
    }
    data[type as keyof typeof data][
      e.cost as unknown as keyof typeof data.fighter
    ] += 1;
  });

  return data;
});

const typeData = computed(() => {
  return {
    labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    datasets: [
      {
        type: "bar",
        label: "Fighter",
        data: Object.values(cardData.value.fighter),
        backgroundColor: graphColours.value.blue,
        hoverBackgroundColor: graphColours.value.blueHover,
        borderColor: "transparent",
        borderWidth: 1,
      },
      {
        type: "bar",
        label: "Trick",
        data: Object.values(cardData.value.trick),
        backgroundColor: graphColours.value.gray,
        hoverBackgroundColor: graphColours.value.grayHover,
        borderColor: "transparent",
        borderWidth: 1,
      },
      {
        type: "bar",
        label: "Environment",
        data: Object.values(cardData.value.environment),
        backgroundColor: graphColours.value.green,
        hoverBackgroundColor: graphColours.value.greenHover,
        borderColor: "transparent",
        borderWidth: 1,
      },
    ],
  };
});

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
          text: "Amount of cards",
          display: true,
          color: graphColours.value.muted,
        },
        ticks: {
          color: graphColours.value.muted,
        },
      },
      x: {
        stacked: true,
        title: {
          text: "Card cost",
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
        position: "bottom",
        labels: {
          color: graphColours.value.muted,
        },
      },
      title: {
        text: "Card Amount",
      },
      tooltips: {
        mode: "y",
        intersect: false,
      },
    },
  };
});
</script>

<style scoped></style>

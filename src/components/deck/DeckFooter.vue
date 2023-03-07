<script lang="ts">
export default {
  name: "DeckFooter",
};
</script>

<template>
  <footer class="footer">
    <span>{{ cardsInDeck.length }}/40</span>
    <span class="type-container">
      <span class="image-text" v-tooltip.top="'Fighters'">
        {{ fighter
        }}<svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="2" y="6" width="20" height="12" rx="2"></rect>
        </svg>
      </span>
      <span class="image-text" v-tooltip.top="'Tricks'">
        {{ trick
        }}<svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      </span>
      <span class="image-text" v-tooltip.top="'Environments'">
        {{ environment
        }}<svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
          ></path>
        </svg>
      </span>
    </span>
    <span>
      <Badge :value="basics + 'C'" class="common" v-tooltip.top="'Commons'" />
      <Badge
        :value="uncommons.toString() + 'U'"
        class="uncommon"
        v-tooltip.top="'Uncommons'"
      />
      <Badge
        :value="rares.toString() + 'R'"
        class="rare"
        v-tooltip.top="'Rares'"
      />
      <Badge
        :value="superRares.toString() + 'S'"
        class="super-rare"
        v-tooltip.top="'Super-Rares'"
      />
      <Badge
        :value="legendarys.toString() + 'L'"
        class="legendary"
        v-tooltip.top="'Legendarys'"
      />
      <Badge
        :value="events.toString() + 'E'"
        class="event"
        v-tooltip.top="'Events'"
      />
    </span>
    <span class="image-text">
      {{ sparks }}<img src="/images/assets/spark.png" />
    </span>
  </footer>
</template>

<script lang="ts" setup>
//TODO: do the plants vs trick vs environment
import getCard from "@/lib/getCard";
import type { Card } from "@/lib/types";
import deck from "@/store/deck";
import Badge from "primevue/badge";
import { computed } from "vue";

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

const countInDeck = (
  key: keyof Card,
  value: number | string | null | string[] | number[]
) => {
  const number = cardsInDeck.value.reduce((prev, curr) => {
    if (
      (Array.isArray(value) && value.includes(curr[key] as never)) ||
      curr[key] === value
    ) {
      return 1 + prev;
    } else {
      return prev;
    }
  }, 0);
  console.log(number);
  return number;
};

const basics = computed(() => countInDeck("rarity", "common"));
const uncommons = computed(() => countInDeck("rarity", "uncommon"));
const rares = computed(() => countInDeck("rarity", "rare"));
const superRares = computed(() => countInDeck("rarity", "super-rare"));
const legendarys = computed(() => countInDeck("rarity", "legendary"));
const events = computed(() => countInDeck("rarity", "event"));

const fighter = computed(() => countInDeck("type", ["Plant", "Zombie"]));
const trick = computed(() => countInDeck("type", "Trick"));
const environment = computed(() => countInDeck("type", "Environment"));

const sparks = computed(() => {
  return (
    basics.value * 25 +
    uncommons.value * 50 +
    rares.value * 250 +
    superRares.value * 1000 +
    legendarys.value * 4000 +
    events.value * 2000
  );
});
</script>

<style scoped>
.footer {
  width: 100%;
  color: var(--text-color-secondary);
  padding: var(--content-padding);
  position: sticky;
  bottom: 0;
  left: 0;
  background-color: #343e4d;
  z-index: 10;
}
.footer {
  background-color: var(--primary);
  color: var(--primary-color-text);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.type-container {
  display: flex;
}
.image-text {
  display: flex;
  align-items: center;
}
.image-text:not(:last-child) {
  margin-right: calc(var(--inline-block-spacing) / 2);
}

.image-text :is(img, svg) {
  width: 1em;
  height: 1em;
  display: inline;
  margin-left: 0.1em;
}
.p-badge {
  margin-right: calc(var(--inline-block-spacing) / 2);
  font-size: 0.5em;
  padding: 0 0.25em;
  border-radius: 100em;
}
.common {
  background-color: #f5f5dc;
}
.uncommon {
  background-color: #959a9d;
}
.rare {
  background-color: #ea9c45;
}
.super-rare {
  background-color: #885cd5;
}
.legendary {
  background: linear-gradient(
    to bottom right,
    #a158dc,
    #f462f4,
    #f3ea94,
    #c5f882,
    #5ba3f0
  );
}
.event {
  background-color: #e66d59;
}
</style>

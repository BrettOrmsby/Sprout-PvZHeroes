<template>
  <h2>Draw Simulator</h2>
  <div class="restart-container">
    <Button label="Restart" @click="restartDeck">
      <template #icon="iconClass">
        <Grid2X2 :class="iconClass.class" />
      </template>
    </Button>
  </div>
  <div class="draw-container">
    <div class="card-draw-container" v-for="(card, index) of draw" :key="index">
      <PVZCard
        :card="getCard(card.cardName)"
        :is-valid="true"
        :amount="0"
        @click="viewCard(card.cardName)"
      />
      <Button :disabled="!card.hasMulligan" @click="mulligan(index)">
        <template #icon="iconClass">
          <RotateCw :class="iconClass.class" />
        </template>
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import deck from "@/store/deck";
import Button from "primevue/button";
import PVZCard from "@/components/PVZCard.vue";
import { Grid2X2, RotateCw } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import getCard from "@/lib/getCard";
import states from "@/store/states";

const draw = ref<
  {
    cardName: string;
    hasMulligan: boolean;
  }[]
>([]);

const shuffledDeck = ref<string[]>([]);
const restartDeck = () => {
  [...document.querySelectorAll(".card-draw-container")].forEach((element) =>
    element.classList.remove("rotate-scale-down")
  );

  setTimeout(() => {
    const deckCards = Object.entries(deck.list)
      .map(([card, amount]) => Array(amount).fill(card))
      .flat();
    shuffle(deckCards);

    draw.value = deckCards
      .splice(0, 4)
      .map((cardName) => ({ cardName, hasMulligan: true }));
    shuffledDeck.value = deckCards;
    [...document.querySelectorAll(".card-draw-container")].forEach((element) =>
      element.classList.add("rotate-scale-down")
    );

    setTimeout(() => {
      [...document.querySelectorAll(".card-draw-container")].forEach(
        (element) => element.classList.remove("rotate-scale-down")
      );
    }, 200);
  }, 100);
};

const mulligan = (index: number) => {
  // You can get the same card back
  shuffledDeck.value.push(draw.value[index].cardName);

  shuffle(shuffledDeck.value);
  const newCard = shuffledDeck.value.shift() as string;

  draw.value[index] = { cardName: newCard, hasMulligan: false };
  document
    .querySelector(`.card-draw-container:nth-child(${index + 1})`)
    ?.classList?.add("rotate-scale-down");
};

onMounted(restartDeck);

function shuffle(array: string[]) {
  var m = array.length,
    t,
    i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
}

const viewCard = (card: string) => {
  states.cardModal.card = card;
  states.cardModal.show = true;
};
</script>

<style scoped>
:deep(.amount) {
  display: none;
}
:deep(.card-image) {
  max-height: 100px;
  max-width: 100px;
  height: auto;
  width: auto;
}

h2,
.restart-container {
  text-align: center;
}

.draw-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  margin: 0 auto;
  margin-top: var(--block-space);
  gap: var(--block-space);
  width: fit-content;
}

.card-draw-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  gap: var(--inline-space);
}

.card-container {
  width: fit-content;
}

.rotate-scale-down {
  -webkit-animation: rotate-scale-down 0.2s linear both;
  animation: rotate-scale-down 0.2s linear both;
}

@-webkit-keyframes rotate-scale-down {
  0% {
    -webkit-transform: scale(1) rotateZ(0);
    transform: scale(1) rotateZ(0);
  }
  50% {
    -webkit-transform: scale(0.5) rotateZ(180deg);
    transform: scale(0.5) rotateZ(180deg);
  }
  100% {
    -webkit-transform: scale(1) rotateZ(360deg);
    transform: scale(1) rotateZ(360deg);
  }
}
@keyframes rotate-scale-down {
  0% {
    -webkit-transform: scale(1) rotateZ(0);
    transform: scale(1) rotateZ(0);
  }
  50% {
    -webkit-transform: scale(0.5) rotateZ(180deg);
    transform: scale(0.5) rotateZ(180deg);
  }
  100% {
    -webkit-transform: scale(1) rotateZ(360deg);
    transform: scale(1) rotateZ(360deg);
  }
}
</style>

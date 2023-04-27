<script lang="ts">
export default {
  name: "PVZCard",
};
</script>

<template>
  <div
    :class="{ 'card-container': true, 'do-hover': isUsersDeck }"
    @click.prevent="toggle"
    aria-haspopup="true"
    aria-controls="overlay_menu"
  >
    <div class="card-side-bar">
      <div :class="['card-rarity', card.rarity.toLowerCase()]"></div>
      <span>{{ card.set.at(0)?.toUpperCase() }}</span
      ><b>x{{ numberLeft }}</b>
    </div>
    <img
      :src="card.image"
      :alt="card.name"
      :class="{ 'card-image': true, gray: !isValid }"
    />
    <Menu
      ref="menu"
      id="overlay_menu"
      :model="items"
      :popup="true"
      style="width: auto"
    />
  </div>
</template>

<script lang="ts" setup>
import throwError from "@/lib/thowError";
import useAuthUser from "@/composables/UseAuthUser";
import useSupabase from "@/composables/UseSupabase";
import { ref, computed } from "vue";
import type { Card, Hero } from "@/lib/types";
import deck from "@/store/deck";
import states from "@/store/states";
import heroData from "@/assets/heros.json";
import Menu from "primevue/menu";

const props = defineProps<{ card: Card; isInDeck: boolean }>();

const hero = computed<Hero>(
  () =>
    [...heroData.plants, ...heroData.zombies].find(
      (e) => e.name === deck.hero
    ) as Hero
);

const numberLeft = computed(() => {
  if (deck.list[props.card.name] !== undefined) {
    if (props.isInDeck) {
      return deck.list[props.card.name];
    }
    return 4 - deck.list[props.card.name];
  } else {
    return 4;
  }
});

const isValid = computed(
  () => numberLeft.value !== 0 && hero.value.class.includes(props.card.class)
);

const viewCard = () => {
  states.cardModal.card = props.card.name;
  states.cardModal.show = true;
};

const { id } = useAuthUser();

const isUsersDeck = computed(() => id.value === deck.creator);
const { supabase } = useSupabase();

const addCard = async () => {
  const newAmount = deck.list[props.card.name]
    ? deck.list[props.card.name] + 1
    : 1;
  const newList = { ...deck.list };
  newList[props.card.name] = newAmount;

  const { data, error } = await supabase
    .from("decks")
    .update({
      list: newList,
      is_complete:
        Object.values(newList).reduce((prev, curr) => prev + curr) === 40,
    })
    .eq("id", deck.id)
    .select();

  if (error) {
    throwError(error);
    return;
  }

  Object.assign(deck, data[0]);
};

const removeCard = async () => {
  const newAmount = deck.list[props.card.name] - 1;
  const newList = { ...deck.list };
  newList[props.card.name] = newAmount;
  if (newList[props.card.name] === 0) {
    delete newList[props.card.name];
  }

  const { data, error } = await supabase
    .from("decks")
    .update({
      list: newList,
      is_complete:
        Object.values(newList).reduce((prev, curr) => prev + curr, 0) === 40,
    })
    .eq("id", deck.id)
    .select();

  if (error) {
    throwError(error);
    return;
  }
  Object.assign(deck, data[0]);
};

const menu = ref();

const toggle = (event: Event) => {
  menu.value.toggle(event);
};

const items = computed(() => [
  {
    icon: "pi pi-eye",
    label: "View",
    command: viewCard,
  },
  {
    icon: "pi pi-plus",
    label: "Add Card",
    visible:
      isUsersDeck.value &&
      ((props.isInDeck && numberLeft.value < 4) ||
        (!props.isInDeck && isValid.value)),
    command: addCard,
  },
  {
    icon: "pi pi-minus",
    label: "Remove Card",
    visible: props.isInDeck && isUsersDeck.value,
    command: removeCard,
  },
]);
</script>

<style scoped>
.card-container {
  background-color: var(--bluegray-900);
  border-radius: var(--border-radius);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: var(--inline-spacing);
  padding: calc(var(--content-padding) / 2 - 2px);
  border: 2px solid transparent;
  cursor: pointer;
}

.do-hover:hover {
  border: 2px solid var(--primary);
}
.card-side-bar {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: var(--inline-spacing);
  width: 3ch;
}

@media only screen and (max-width: 600px) {
  .card-image {
    width: 60px;
  }
}

@media only screen and (min-width: 600px) {
  .card-image {
    width: 75px;
  }
}

@media only screen and (min-width: 768px) {
  .card-image {
    width: 100px;
  }
}

.gray {
  filter: grayscale(100%);
}

.card-rarity {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgb(245, 245, 220);
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

<template>
  <div
    :class="{
      'card-container': true,
      'not-valid': !isValid,
      [card.rarity.toLowerCase()]: true,
    }"
    @click.prevent="toggle"
    aria-haspopup="true"
    aria-controls="overlay_menu"
  >
    <div class="amount">
      <strong>{{ numberLeft }}</strong>
    </div>
    <img :src="card.image" :alt="card.name" class="card-image" />
    <Menu
      ref="menu"
      id="overlay_menu"
      :model="items"
      :popup="true"
      style="width: auto"
    >
      <template #item="{ item, props }">
        <a v-bind="props.action">
          <Eye v-if="item.label === 'View'" />
          <Plus v-else-if="item.label === 'Add Card'" />
          <Grid2x2Check v-else-if="item.label === 'Add All'" />
          <Minus v-else-if="item.label === 'Remove Card'" />
          <Grid2x2X v-else-if="item.label === 'Remove All'" />

          <span>{{ item.label }}</span>
        </a>
      </template>
    </Menu>
  </div>
</template>

<script lang="ts" setup>
import throwError from "@/lib/throwError";
import useAuthUser from "@/composables/UseAuthUser";
import useSupabase from "@/composables/UseSupabase";
import { ref, computed } from "vue";
import type { Card, Hero } from "@/lib/types";
import deck from "@/store/deck";
import states from "@/store/states";
import heroData from "@/assets/heros.json";
import Menu from "primevue/menu";
import { Eye, Plus, Minus, Grid2x2Check, Grid2x2X } from "lucide-vue-next";

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

const { id } = useAuthUser();

const isUsersDeck = computed(() => id.value === deck.creator);
const { supabase } = useSupabase();
const updateDeck = async (newList: Record<string, number>) => {
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

const addCard = async () => {
  const newAmount = deck.list[props.card.name]
    ? deck.list[props.card.name] + 1
    : 1;
  const newList = { ...deck.list, [props.card.name]: newAmount };
  updateDeck(newList);
};

const addAll = async () => {
  const newList = { ...deck.list, [props.card.name]: 4 };
  updateDeck(newList);
};

const removeCard = async () => {
  const newAmount = deck.list[props.card.name] - 1;
  const newList = { ...deck.list, [props.card.name]: newAmount };
  if (newList[props.card.name] === 0) {
    delete newList[props.card.name];
  }
  updateDeck(newList);
};

const removeAll = async () => {
  const newList = { ...deck.list };
  delete newList[props.card.name];
  updateDeck(newList);
};

const viewCard = () => {
  states.cardModal.card = props.card.name;
  states.cardModal.show = true;
};
// TODO: somehow show loading for commands
const menu = ref();

const toggle = (event: Event) => {
  menu.value.toggle(event);
};

const items = computed(() => [
  {
    label: "View",
    command: viewCard,
  },
  {
    label: "Add Card",
    visible:
      isUsersDeck.value &&
      ((props.isInDeck && numberLeft.value < 4) ||
        (!props.isInDeck && isValid.value)),
    command: addCard,
  },
  {
    label: "Add All",
    visible:
      isUsersDeck.value &&
      ((props.isInDeck && numberLeft.value <= 2) ||
        (!props.isInDeck && numberLeft.value >= 2)),
    command: addAll,
  },
  {
    label: "Remove Card",
    visible: props.isInDeck && isUsersDeck.value,
    command: removeCard,
  },
  {
    label: "Remove All",
    visible: props.isInDeck && isUsersDeck.value && numberLeft.value >= 2,
    command: removeAll,
  },
]);
</script>

<style scoped>
.card-container {
  border-radius: var(--p-border-radius-md);
  aspect-ratio: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: var(--inline-space);
  padding: var(--inline-space);
  cursor: pointer;
}

.card-container:hover {
  outline: 1px solid var(--p-primary-400);
}

.amount {
  position: relative;
  height: 100%;
}
.amount strong {
  position: absolute;
  font-size: 1.2em;
  left: calc(var(--inline-space) * -1);
  bottom: calc(var(--inline-space) * -1);
  padding: var(--inline-space);
  background: color-mix(in srgb, var(--p-surface-950) 50%, transparent);
  border-radius: var(--p-border-radius-md);
}

.not-valid {
  opacity: 0.5;
}
.not-valid img {
  filter: grayscale(100%);
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

.common {
  background: #f5f5dc;
}
.uncommon {
  background: #959a9d;
}
.rare {
  background: #ea9c45;
}
.super-rare {
  background: #885cd5;
}
.legendary {
  position: relative;
  background: transparent;
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
  background: #e66d59;
}
</style>

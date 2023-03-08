<script lang="ts">
export default {
  name: "CardTable",
};
</script>

<template>
  <DataTable
    :value="cards"
    rowGroupMode="subheader"
    groupRowsBy="class"
    :scrollable="true"
    stripedRows
    responsiveLayout="scroll"
    sortMode="single"
    :sortField="getSortOrder"
    :sortOrder="1"
    :expandableRowGroups="true"
    v-model:expandedRowGroups="expandedRowGroups"
  >
    <Column
      :style="{ 'flex-grow': 0, 'min-width': isInDeck ? '175px' : '140px' }"
    >
      <template #body="slotProps">
        <span class="amount">x{{ numberLeft(slotProps.data.name) }}</span>
        <span v-if="isUsersDeck" class="p-buttonset">
          <Button
            icon="pi pi-minus"
            aria-label="Remove Card"
            v-if="isInDeck"
            @click="removeCard(slotProps.data.name)"
          />
          <Button
            icon="pi pi-plus"
            aria-label="Add Card"
            v-if="
              (isInDeck && numberLeft(slotProps.data.name) < 4) ||
              (!isInDeck && isValid(slotProps.data))
            "
            @click="addCard(slotProps.data.name)"
          />
          <Button
            icon="pi pi-eye"
            aria-label="View Card"
            @click="viewCard(slotProps.data.name)"
          />
        </span>
      </template>
    </Column>
    <Column field="name" class="word-break">
      <template #body="slotProps">
        <img
          :src="slotProps.data.image"
          :alt="slotProps.data.name"
          :class="{ gray: !isValid(slotProps.data) }"
        />
        <span>{{ slotProps.data.name }}</span>
      </template>
    </Column>
    <template #groupheader="slotProps">
      <div
        class="group-header"
        :style="{
          color: headerColor(slotProps.data.class).foreground,
          'background-color': headerColor(slotProps.data.class).background,
        }"
      >
        <img
          class="class"
          :src="
            '/images/classes/' + slotProps.data.class.toLowerCase() + '.png'
          "
          :alt="slotProps.data.class"
        />
        {{ slotProps.data.class }}
      </div>
    </template>
  </DataTable>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import throwError from "@/lib/thowError";
import states from "@/store/states";
import deck from "@/store/deck";
import heroData from "@/assets/heros.json";
import useSupabase from "@/composables/UseSupabase";
import useAuthUser from "@/composables/UseAuthUser";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import type { Card, Hero } from "@/lib/types";

const props = defineProps<{ cards: Card[]; isInDeck: boolean }>();

const hero = computed<Hero>(
  () =>
    [...heroData.plants, ...heroData.zombies].find(
      (e) => e.name === deck.hero
    ) as Hero
);

const expandedRowGroups = ref(props.isInDeck ? hero.value.class : []);

const getSortOrder = (card: Card) => {
  if (hero.value.class.includes(card.class)) {
    return "a";
  }
  return "b";
};

const numberLeft = (card: string) => {
  if (deck.list[card] !== undefined) {
    if (props.isInDeck) {
      return deck.list[card];
    }
    return 4 - deck.list[card];
  } else {
    return 4;
  }
};

const isValid = (card: Card) =>
  numberLeft(card.name) !== 0 && hero.value.class.includes(card.class);

const headerColor = (cardClass: string) => {
  const colours: Record<string, string> = {
    Guardian: "#492F1C",
    Kabloom: "#A03732",
    "Mega-Grow": "#64A65B",
    Smarty: "#A3A2A4",
    Solar: "#D6D848",

    Beastly: "#4771A6",
    Brainy: "#91398D",
    Crazy: "#6331B9",
    Hearty: "#9B762C",
    Sneaky: "#3A3939",
  };
  const background = colours[cardClass];

  const r = parseInt(background.substring(1, 3), 16);
  const g = parseInt(background.substring(3, 5), 16);
  const b = parseInt(background.substring(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  const foreground = yiq >= 128 ? "black" : "white";

  return { background, foreground };
};

const viewCard = (card: string) => {
  states.cardModal.card = card;
  states.cardModal.show = true;
};

const { id } = useAuthUser();

const isUsersDeck = computed(() => id.value === deck.creator);
const { supabase } = useSupabase();

const addCard = async (card: string) => {
  const newAmount = deck.list[card] ? deck.list[card] + 1 : 1;
  const newList = { ...deck.list };
  newList[card] = newAmount;

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

const removeCard = async (card: string) => {
  const newAmount = deck.list[card] - 1;
  const newList = { ...deck.list };
  newList[card] = newAmount;
  if (newList[card] === 0) {
    delete newList[card];
  }

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
</script>

<style scoped>
:deep():not(th).word-break {
  word-break: break-word;
}
.amount {
  margin-right: var(--inline-spacing);
  width: 20px;
}
img {
  margin-right: var(--inline-spacing);
  width: 50px;
}
.gray {
  filter: grayscale(100%);
}
.p-buttonset {
  display: flex;
}
:deep() .p-buttonset .p-button:only-child {
  border-radius: var(--border-radius);
}
:deep() .p-link:focus {
  box-shadow: 0 0 0 0px white !important;
}

:deep().p-rowgroup-header {
  top: 0;
  display: v-bind('isInDeck ? "none" : "flex"') !important;
}
:deep().p-rowgroup-header td {
  padding: 0 !important;
}
.group-header {
  padding: var(--content-padding);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
.class {
  width: 1em;
  height: 1em;
}
:deep().p-datatable-thead {
  display: none !important;
}
.p-datatable {
  overflow: hidden;
  border-radius: var(--border-radius) !important;
}
</style>

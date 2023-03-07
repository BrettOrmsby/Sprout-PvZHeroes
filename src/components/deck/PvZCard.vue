<script lang="ts">
export default {
  name: "PvZCard",
};
</script>

<template>
  <!--
    {{ numberLeft }}
    <img
      :src="card.image"
      :alt="card.name"
      :class="{ gray: !isValid }"
      @click="toggle"
    />
    -->
  <div @click="toggle" :class="{ red: !isValid }" class="card">
    <div class="header">
      <div class="vertical-align">
        <h3 class="shrink-text-line">{{ card.name }}</h3>
      </div>
    </div>
    <div class="type-line">
      <svg style="height: 25px; width: 25px" view-box="0 0 24 24">
        <path fill="green" d="M 1 5 L 23 5 L 23 19 L 1 19 Z" />
      </svg>
      <div class="vertical-align">
        <div>
          <p class="shrink-text-line-small">
            {{ card.type }} <span v-if="card.tribes.length > 0">•</span>
            {{ card.tribes.join(" ") }}
          </p>
        </div>
      </div>
    </div>
    <div class="content">
      <p v-html="card.abilities"></p>
    </div>
    {{ numberLeft }}
  </div>
  <Menu ref="menu" :model="items" :popup="true" />
</template>

<script lang="ts" setup>
import useSupabase from "@/composables/UseSupabase";
import getCard from "@/lib/getCard";
import throwError from "@/lib/thowError";
import { computed, ref, onMounted } from "vue";
import fitty from "fitty";
import deck from "@/store/deck";
import heroData from "@/assets/heros.json";
import type { Hero } from "@/lib/types";
import DeferredContent from "primevue/deferredcontent";
import Menu from "primevue/menu";
import type { MenuItem } from "primevue/menuitem";
import states from "@/store/states";
const props = defineProps<{ name: string; isInDeck: boolean }>();

const card = computed(() => getCard(props.name));

const hero = computed<Hero>(
  () =>
    [...heroData.plants, ...heroData.zombies].find(
      (e) => e.name === deck.hero
    ) as Hero
);

const headerColors = computed(() => {
  const colours = {
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
  const background = colours[card.value.class as keyof typeof colours];

  const r = parseInt(background.substring(1, 3), 16);
  const g = parseInt(background.substring(3, 5), 16);
  const b = parseInt(background.substring(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  const foreground = yiq >= 128 ? "black" : "white";

  return { background, foreground };
});

const numberLeft = computed(() => {
  if (deck.list[props.name] !== undefined) {
    if (props.isInDeck) {
      return deck.list[props.name];
    }
    return 4 - deck.list[props.name];
  } else {
    return 4;
  }
});

const isValid = computed(
  () => numberLeft.value !== 0 && hero.value.class.includes(card.value.class)
);

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

const menu = ref();
const toggle = (event: Event) => {
  menu.value.toggle(event);
};
const items = computed<MenuItem[]>(() => {
  const items: MenuItem[] = [
    {
      label: "View",
      icon: "pi pi-eye",
      command: () => {
        states.cardModal.card = props.name;
        states.cardModal.show = true;
      },
    },
  ];
  if (props.isInDeck && isValid.value) {
    items.unshift({
      label: "Remove",
      icon: "pi pi-trash",
      command: () => removeCard(card.value.name),
    });
  } else if (!props.isInDeck && numberLeft.value > 0) {
    items.unshift({
      label: "Add",
      icon: "pi pi-plus",
      command: () => addCard(card.value.name),
    });
  }
  return items;
});

onMounted(() => {
  fitty(".shrink-text-line", {
    minSize: 10,
    maxSize: 20,
    multiLine: false,
  });
  fitty(".shrink-text-line-small", {
    minSize: 5,
    maxSize: 15,
    multiLine: false,
  });
});
</script>

<style scoped>
.card {
  background-color: var(--surface-c);
  width: 200px;
  cursor: pointer;
  border-radius: var(--border-radius);
  overflow: hidden;
}
.content {
  padding: calc(var(--content-padding) / 2);
}
.card .header {
  align-content: center;
  padding: calc(var(--content-padding) / 4) calc(var(--content-padding) / 2);
  height: 50px;
  background-color: v-bind("headerColors.background");
  color: v-bind("headerColors.foreground");
}

.type-line {
  /*padding: calc(var(--content-padding) / 4) calc(var(--content-padding) / 2);*/
  padding: 0 calc(var(--content-padding) / 2);
  height: 20px;
  background-color: var(--surface-d);
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.vertical-align {
  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
h3 {
  margin: 0;
  white-space: nowrap;
}
p {
  margin: 0;
}

.frame {
  width: 75%;
  margin: 0 auto;
}
</style>

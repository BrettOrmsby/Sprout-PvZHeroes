<script lang="ts">
export default {
  name: "CardListTextArea",
};
</script>

<template>
  <Textarea
    :placeholder="placeholder"
    rows="6"
    :class="{ textarea: true, 'p-invalid': isError, error: isError }"
    v-bind="$attrs"
    v-model.lazy="textarea"
    @change="
      () => {
        emit('update:modelValue', jsonDeck);
        emit('update:isError', isError);
      }
    "
  >
  </Textarea>
  <small v-if="isError">
    <span v-if="errors.format.length"
      >Invalid card formatting on line<span v-if="errors.format.length > 1"
        >s</span
      >
      {{ arrayToList(errors.format) }}</span
    >
    <span v-if="errors.number.length"
      >Invalid card amount<span v-if="errors.number.length > 1">s</span> on
      line<span v-if="errors.number.length > 1">s</span>
      {{ arrayToList(errors.number) }}</span
    >
    <span v-if="errors.cardName.length"
      >Invalid card name<span v-if="errors.cardName.length > 1">s</span>:
      {{ arrayToList(errors.cardName) }}</span
    >
    <span v-if="errors.duplicate.length"
      >Duplicate card name<span v-if="errors.duplicate.length > 1">s</span>:
      {{ arrayToList(errors.duplicate) }}</span
    >
    <span v-if="errors.invalidCard.length"
      >Invalid card<span v-if="errors.duplicate.length > 1">s</span> for a
      {{ computedHero.name }} deck: {{ arrayToList(errors.invalidCard) }}</span
    >
  </small>
</template>

<script lang="ts" setup>
//TODO: try to disable transition on margin
import { ref, computed } from "vue";
import getCard from "@/lib/getCard";
import heroData from "@/assets/heros.json";
import plants from "@/assets/plants.json";
import zombies from "@/assets/zombies.json";
import type { Hero } from "@/lib/types";
import Textarea from "primevue/textarea";

const props = defineProps<{
  modelValue: Record<string, number> | null;
  isError: boolean;
  hero: string;
  id?: string;
}>();
const emit = defineEmits(["update:modelValue", "update:isError"]);

emit("update:isError", false);

type CardListErrors = {
  format: number[];
  cardName: string[];
  number: number[];
  invalidCard: string[];
  duplicate: string[];
};
const errors = ref<CardListErrors>({
  format: [],
  cardName: [],
  invalidCard: [],
  number: [],
  duplicate: [],
});

const isError = computed(() => Object.values(errors.value).flat().length > 0);

const computedHero = computed(() => {
  const hero = [...heroData.plants, ...heroData.zombies].find(
    (e) => e.name === props.hero
  ) as Hero;
  // update the value when the the hero changes
  return hero;
});

const placeholder = computed(() => {
  const hero = computedHero.value;
  const card = [...plants, ...zombies].find((e) =>
    hero.class.includes(e.class)
  );
  return `4x ${card?.name}`;
});

const jsonToText = (obj: Record<string, number> | null): string => {
  if (!obj) {
    return "";
  }
  return Object.entries(obj)
    .map(([card, amount]) => {
      return amount + "x " + card;
    })
    .join("\n");
};

const textarea = ref(jsonToText(props.modelValue));

const jsonDeck = computed((): Record<string, number> => {
  /* eslint-disable vue/no-side-effects-in-computed-properties */
  const json: Record<string, number> = {};
  errors.value = {
    format: [],
    cardName: [],
    number: [],
    invalidCard: [],
    duplicate: [],
  };
  const lines = textarea.value.split("\n");
  const hero = computedHero.value;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      continue;
    }
    const match = line.match(/^(\d+)x\s*([^$]+)$/);
    if (!match) {
      errors.value.format.push(i + 1);
      continue;
    }
    const number = parseInt(match[1]);
    if (number > 4 || number < 0) {
      errors.value.number.push(i + 1);
      continue;
    }

    const name = match[2];
    const card = getCard(name);
    if (!card) {
      errors.value.cardName.push(name);
      continue;
    } else {
      if (
        !hero.class.includes(card.class) ||
        card.class === "Removed" ||
        card.set === "token" ||
        card.set === "superpower"
      ) {
        errors.value.invalidCard.push(name);
        continue;
      }
      if (json[name]) {
        errors.value.duplicate.push(name);
        continue;
      }
    }

    json[name] = number;
  }
  return json;
});

const arrayToList = (array: any[]) =>
  array.join(", ").replace(/, ((?:.(?!, ))+)$/, " and $1");
</script>

<style scoped>
.textarea {
  width: 100%;
  resize: none;
}
.error {
  margin-bottom: var(--inline-spacing) !important;
}

label {
  display: block;
  margin-bottom: var(--inline-spacing);
}

small {
  display: block;
  margin-bottom: var(--inline-block-spacing);
  white-space: pre-line;
}
small span {
  display: block;
}
</style>

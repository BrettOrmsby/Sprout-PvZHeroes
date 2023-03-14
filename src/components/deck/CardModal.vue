<script lang="ts">
export default {
  name: "CardModal",
};
</script>

<template>
  <Dialog
    :modal="true"
    v-model:visible="states.cardModal.show"
    style="max-width: 500px; width: 100%; margin: var(--content-padding)"
  >
    <template #header>
      <div class="header-container p-dialog-title">
        {{ card.name }}
        <img
          v-if="card.class"
          class="class"
          :src="'/images/classes/' + card.class.toLowerCase() + '.png'"
          :alt="card.class"
        />
        <Badge class="set" :class="'set ' + card.rarity"
          >{{ card.set.charAt(0).toUpperCase() + card.set.slice(1) }} -
          {{ card.rarity.charAt(0).toUpperCase() }}</Badge
        >
      </div>
    </template>
    <img :src="card.image" :alt="card.name" class="main-image" />
    <p class="types">- {{ card.type }} {{ card.tribes.join(" ") }} -</p>
    <p class="abilities" v-html="replaceImages(card.abilities)"></p>
    <p class="flavour">
      <em>{{ card.flavour }}</em>
    </p>
  </Dialog>
</template>

<script lang="ts" setup>
//TODO: the image from the {{type}} in the text
import states from "@/store/states";
import getCard from "@/lib/getCard";
import { computed } from "vue";
import Dialog from "primevue/dialog";
import Badge from "primevue/badge";

const card = computed(() => getCard(states.cardModal.card));
const replaceImages = (input: string) => {
  return input.replace(/\{\{(.+?)\}\}/g, (item) => {
    const ability = item.slice(2, -2);

    return `<img class="abilityIcon" src="/images/abilities/${ability.toLowerCase()}.png" alt="${ability}"/>`;
  });
};
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.class {
  width: 1em;
  margin-left: var(--inline-spacing);
}
.main-image {
  display: block;
  margin: 0 auto;
  width: 40%;
}
.types {
  color: var(--text-color-secondary);
  text-align: center;
}
.abilities {
  white-space: pre-wrap;
  text-align: center;
}
:deep().abilityIcon {
  height: 1em;
  display: inline;
  vertical-align: middle;
}
.flavour {
  color: var(--text-color-secondary);
  text-align: center;
  font-size: 0.8em;
  margin: 0;
}

.p-badge {
  margin: 0;
  color: #151515;
  font-size: 0.6em;
  margin-left: var(--inline-spacing);
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

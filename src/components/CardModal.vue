<template>
  <Dialog
    :draggable="false"
    :modal="true"
    v-model:visible="states.cardModal.show"
    style="max-width: 500px; width: 100%; margin: var(--block-space)"
  >
    <template #header>
      <div class="header-container p-dialog-title">
        {{ card.name }}
        <CardClassImage :card="card" />
        <SetPill :card="card" />
      </div>
    </template>
    <img
      :src="card.image"
      :alt="`${card.name}, ${card.cost}-cost, ${card.strength}/${card.health}`"
      class="main-image"
    />
    <span class="stats-image-container" v-if="userSettings.show_real_stats">
      <img
        class="cost"
        :src="`/images/stats/${isPlant ? 'sun' : 'brain'}/${card.cost}.png`"
        :alt="card.cost.toString()"
      />
      <span v-if="card.strength || card.health">
        -
        <img
          :src="`/images/stats/strength/${card.strength}.png`"
          :alt="card.strength!.toString()" />
        / <img :src="`/images/stats/health/${card.health}.png`" :alt="card.health!.toString()"
      /></span>
    </span>
    <p class="types">- {{ card.type }} {{ card.tribes.join(' ') }} -</p>
    <p class="abilities"><ReplaceCardText :text="card.abilities" /></p>
    <p class="flavour">
      <em>{{ card.flavour }}</em>
    </p>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Dialog } from 'primevue'
import SetPill from './SetPill.vue'
import ReplaceCardText from '@/components/ReplaceCardText.vue'
import CardClassImage from './CardClassImage.vue'
import getCard from '@/lib/getCard'
import { useUserSettingsStore } from '@/store/userSettings'
import states from '@/store/states'

const userSettings = useUserSettingsStore()
const card = computed(() => getCard(states.cardModal.card))

const isPlant = computed(() =>
  ['Guardian', 'Kabloom', 'Mega-Grow', 'Smarty', 'Solar'].includes(card.value.class),
)
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--inline-space);
}
.main-image {
  display: block;
  margin: 0 auto;
  width: 40%;
}
.stats-image-container {
  margin-top: var(--inline-space);
}
.stats-image-container,
.stats-image-container span {
  display: flex;
  align-items: center;
  justify-content: center;
}
.stats-image-container img {
  height: 1.5em;
  width: 1.5em;
}
.types {
  color: var(--p-text-muted-color);
  text-align: center;
  margin-top: var(--inline-space);
}
.abilities {
  white-space: pre-wrap;
  text-align: center;
}
:deep(.abilityIcon) {
  height: 1em;
  display: inline;
  vertical-align: middle;
}
.flavour {
  color: var(--p-text-muted-color);
  text-align: center;
  font-size: 0.8em;
  margin: 0;
}
</style>

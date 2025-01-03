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
        <img
          v-if="card.name === 'Zom-Bats'"
          class="class"
          src="/images/classes/brainy.png"
          alt="Brainy"
        />
        <img
          v-if="card.name === 'Impfinity Clone'"
          class="class"
          src="/images/classes/sneaky.png"
          alt="Sneaky"
        />
        <img
          v-if="card.name === 'Hothead'"
          class="class"
          src="/images/classes/kabloom.png"
          alt="Kabloom"
        />
        <span v-if="card.class === 'Removed'" style="color: var(--p-primary-400)">Removed</span>
        <img
          v-else-if="card.class"
          class="class"
          :src="'/images/classes/' + card.class.toLowerCase() + '.png'"
          :alt="card.class"
        />
        <img
          v-if="card.name === 'Octo-Pet'"
          class="class"
          src="/images/classes/sneaky.png"
          alt="Sneaky"
        />
        <SetPill :card="card" />
      </div>
    </template>
    <img :src="card.image" :alt="card.name" class="main-image" />
    <p class="types">- {{ card.type }} {{ card.tribes.join(' ') }} -</p>
    <p class="abilities"><ReplaceCardText :text="card.abilities" /></p>
    <p class="flavour">
      <em>{{ card.flavour }}</em>
    </p>
  </Dialog>
</template>

<script lang="ts" setup>
import states from '@/store/states'
import getCard from '@/lib/getCard'
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import SetPill from './deck/SetPill.vue'
import ReplaceCardText from '@/components/ReplaceCardText.vue'

const card = computed(() => getCard(states.cardModal.card))
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--inline-space);
}
.class {
  width: 1em;
}

.main-image {
  display: block;
  margin: 0 auto;
  width: 40%;
}
.types {
  color: var(--p-text-muted-color);
  text-align: center;
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

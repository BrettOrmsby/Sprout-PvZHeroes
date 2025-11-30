<template>
  <aside class="side-bar">
    <div class="sticky">
      <div class="header-container">
        <strong>{{ card.name }}</strong>
        <CardClassImage :card="card" />
      </div>
      <SetPill :card="card" />
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
      <p class="types">- {{ card.tribes.join(' ') }} {{ card.type }} -</p>
      <p class="abilities"><ReplaceCardText :text="card.abilities" /></p>
      <p class="flavour">
        <em>{{ card.flavour }}</em>
      </p>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SetPill from '@/components/SetPill.vue'
import CardClassImage from '@/components/CardClassImage.vue'
import ReplaceCardText from '@/components/ReplaceCardText.vue'
import getCard, { getAllCardsIterator } from '@/lib/getCard'
import getHero from '@/lib/getHero'
import { useStatesStore } from '@/store/states'
import { useDeckStore } from '@/store/deck'
import { useUserSettingsStore } from '@/store/userSettings'

const deck = useDeckStore()
const userSettings = useUserSettingsStore()
const states = useStatesStore()

const card = computed(() => getCard(states.cardHover))
const isPlant = computed(() =>
  ['Guardian', 'Kabloom', 'Mega-Grow', 'Smarty', 'Solar'].includes(card.value.class),
)

const route = useRoute()
onMounted(() => {
  if (route.name === 'Gallery') {
    states.cardHover = 'Forget-Me-Nuts'
    return
  }
  if (route.name === 'Profile') {
    states.cardHover = 'Pea Pod'
    return
  }
  if (route.name === 'SearchCards') {
    return
  }
  if (Object.keys(deck.list).length === 0) {
    const hero = getHero(deck.hero)
    // Get the basic 1/1 zombie
    states.cardHover = [...getAllCardsIterator()].find(
      (card) =>
        card.class === hero.class[0] &&
        card.set === 'basic' &&
        card.abilities === '' &&
        card.cost === 1 &&
        card.strength === 1 &&
        card.health === 1,
    )!.name
  } else {
    // Get the first card in the deck
    states.cardHover = Object.keys(deck.list)
      .map((name) => getCard(name))
      .sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name))[0].name
  }
})
</script>

<style scoped>
.side-bar {
  display: block;
  width: 250px;
  flex-grow: 0;
  flex-shrink: 0;
}
.sticky {
  position: sticky;
  top: 0;
  left: 0;
  padding: var(--block-space);
}
.header-container {
  padding-top: calc(var(--block-space) * 4);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--inline-space);
}
.p-badge {
  margin-top: var(--inline-space);
  margin-bottom: var(--block-space);
}
.main-image {
  display: block;
  margin: 0 auto;
  width: 40%;
}
.stats-image-container,
.stats-image-container span {
  display: flex;
  align-items: center;
  justify-content: center;
}
.stats-image-container img {
  height: 1.5em;
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
  height: 1.2em;
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

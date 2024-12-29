<template>
  <div class="side-bar">
    <div class="sticky">
      <div class="header-container">
        <strong>{{ card.name }}</strong>
        <img
          v-if="card.class"
          class="class"
          :src="'/images/classes/' + card.class.toLowerCase() + '.png'"
          :alt="card.class"
        />
      </div>
      <SetPill :card="card" />
      <img :src="card.image" :alt="card.name" class="main-image" />
      <p class="types">- {{ card.type }} {{ card.tribes.join(' ') }} -</p>
      <p class="abilities" v-html="replaceCardText(card.abilities)"></p>
      <p class="flavour">
        <em>{{ card.flavour }}</em>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import states from '@/store/states'
import { useDeckStore } from '@/store/deck'
import getCard from '@/lib/getCard'
import { computed, onMounted } from 'vue'
import SetPill from '@/components/deck/SetPill.vue'
import replaceCardText from '@/lib/replaceCardText'
import plants from '@/content/plants.json'
import zombies from '@/content/zombies.json'
import getHero from '@/lib/getHero'
import { useRoute } from 'vue-router'

const deck = useDeckStore()

const card = computed(() => getCard(states.cardHover))

const route = useRoute()
onMounted(() => {
  if (route.name === 'Gallery') {
    states.cardHover = 'Forget-Me-Nuts'
    return
  }
  if (Object.keys(deck.list).length === 0) {
    const hero = getHero(deck.hero)
    // Get the basic 1/1 zombie
    states.cardHover = [...plants, ...zombies].find(
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
.class {
  width: 1em;
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

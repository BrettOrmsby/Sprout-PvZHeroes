<template>
  <PVZCard
    @click.prevent="toggle"
    aria-haspopup="true"
    aria-controls="overlay_menu"
    :amount="numberLeft"
    :card="card"
    :isValid="isValid"
    :data-card-name="card.name"
    :data-can-add="isUsersDeck && ((isInDeck && numberLeft < 4) || (!isInDeck && isValid))"
    :data-can-remove="isUsersDeck && props.isInDeck"
    :class="class"
  />
  <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" style="width: auto">
    <template #item="{ item, props }">
      <a v-bind="props.action">
        <Eye v-if="item.label === 'View'" />
        <Plus v-else-if="item.label === 'Add Card'" />
        <Grid2x2Check v-else-if="item.label === 'Add All'" />
        <Minus v-else-if="item.label === 'Remove Card'" />
        <Grid2x2X v-else-if="item.label === 'Remove All'" />

        <span class="menu-label">{{ item.label }}</span>
        <kbd v-if="item.shortcut"
          ><small>{{ item.shortcut }}</small></kbd
        >
      </a>
    </template>
  </Menu>
</template>

<script lang="ts" setup>
import throwError from '@/lib/throwError'
import useAuthUser from '@/composables/UseAuthUser'
import useSupabase from '@/composables/UseSupabase'
import { ref, computed } from 'vue'
import type { Card, Hero } from '@/lib/types'
import states from '@/store/states'
import heroData from '@/content/heros.json'
import Menu from 'primevue/menu'
import { Eye, Plus, Minus, Grid2x2Check, Grid2x2X } from 'lucide-vue-next'
import { useDeckStore } from '@/store/deck'
import PVZCard from '@/components/PVZCard.vue'
const props = defineProps<{ card: Card; isInDeck: boolean; class?: string }>()

const deck = useDeckStore()
const hero = computed<Hero>(
  () => [...heroData.plants, ...heroData.zombies].find((e) => e.name === deck.hero) as Hero,
)

const numberLeft = computed(() => {
  if (deck.list[props.card.name] !== undefined) {
    if (props.isInDeck) {
      return deck.list[props.card.name]
    }
    return 4 - deck.list[props.card.name]
  } else {
    return 4
  }
})

const isValid = computed(
  () => numberLeft.value !== 0 && hero.value.class.includes(props.card.class),
)

const { id } = useAuthUser()

const isUsersDeck = computed(() => id.value === deck.creator)
const updateDeck = async (newList: Record<string, number>) => {
  await deck.update({
    list: newList,
    is_complete: Object.values(newList).reduce((prev, curr) => prev + curr, 0) === 40,
  })
}

const addCard = async () => {
  const newAmount = deck.list[props.card.name] ? deck.list[props.card.name] + 1 : 1
  const newList = { ...deck.list, [props.card.name]: newAmount }
  updateDeck(newList)
}

const addAll = async () => {
  const newList = { ...deck.list, [props.card.name]: 4 }
  updateDeck(newList)
}

const removeCard = async () => {
  const newAmount = deck.list[props.card.name] - 1
  const newList = { ...deck.list, [props.card.name]: newAmount }
  if (newList[props.card.name] === 0) {
    delete newList[props.card.name]
  }
  updateDeck(newList)
}

const removeAll = async () => {
  const newList = { ...deck.list }
  delete newList[props.card.name]
  updateDeck(newList)
}

const viewCard = () => {
  states.cardModal.card = props.card.name
  states.cardModal.show = true
}
// TODO: somehow show loading for commands
const menu = ref()

const toggle = (event: Event) => {
  menu.value.toggle(event)
}

const items = computed(() => {
  if (!isUsersDeck.value) {
    return [
      {
        label: 'View',
        command: viewCard,
      },
    ]
  }

  return [
    {
      label: 'View',
      command: viewCard,
    },
    {
      label: 'Add Card',
      visible: (props.isInDeck && numberLeft.value < 4) || (!props.isInDeck && isValid.value),
      command: addCard,
      shortcut: 'Alt + 1',
    },
    {
      label: 'Add All',
      visible:
        (props.isInDeck && numberLeft.value <= 2) || (!props.isInDeck && numberLeft.value >= 2),
      command: addAll,
    },
    {
      label: 'Remove Card',
      visible: props.isInDeck,
      command: removeCard,
      shortcut: 'Alt + 2',
    },
    {
      label: 'Remove All',
      visible: props.isInDeck && numberLeft.value >= 2,
      command: removeAll,
    },
  ]
})
</script>

<style scoped>
kbd {
  color: var(--p-text-muted-color);
  background-color: var(--p-surface-700);
  border-radius: var(--p-border-radius-sm);
  padding: 0.2em 0.4em;
  justify-self: flex-end;
  display: none;
}

@media (hover: hover) and (pointer: fine) {
  kbd {
    display: inline;
  }
}

.menu-label {
  flex-grow: 1;
}
</style>

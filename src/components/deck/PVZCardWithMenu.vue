<template>
  <PVZCard
    @click.prevent="toggle"
    aria-haspopup="true"
    aria-controls="overlay_menu"
    :amount="numberLeft"
    :card="card"
    :isValid="isValid"
    :data-card-name="card.name"
    :data-can-add="deck.isUsersDeck && ((isInDeck && numberLeft < 4) || (!isInDeck && isValid))"
    :data-can-remove="deck.isUsersDeck && props.isInDeck"
    v-bind="$attrs"
  />
  <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" style="width: auto">
    <template #item="{ item, props }">
      <a v-bind="props.action">
        <component :is="item.iconComponent" />
        <span class="menu-label">{{ item.label }}</span>
        <kbd v-if="item.shortcut"
          ><small>{{ item.shortcut }}</small></kbd
        >
      </a>
    </template>
  </Menu>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Eye, Grid2x2Check, Grid2x2X, Minus, Plus } from 'lucide-vue-next'
import { Menu } from 'primevue'
import PVZCard from '@/components/PVZCard.vue'
import { useDeckStore } from '@/store/deck'
import { useStatesStore } from '@/store/states'
import heroData from '@/content/heroes.json'
import type { Card, Hero } from '@/lib/types'

const props = defineProps<{ card: Card; isInDeck: boolean }>()

const states = useStatesStore()
const deck = useDeckStore()
const hero = computed<Hero>(() => heroData.find((e) => e.name === deck.hero) as Hero)

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

const updateDeck = async (newList: Record<string, number>) => {
  await deck.update({
    list: newList,
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

const menu = ref()

const toggle = (event: Event) => {
  menu.value.toggle(event)
}

const items = computed(() => {
  if (!deck.isUsersDeck) {
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
      iconComponent: Eye,
    },
    {
      label: 'Add Card',
      visible: (props.isInDeck && numberLeft.value < 4) || (!props.isInDeck && isValid.value),
      command: addCard,
      shortcut: 'Alt + 1',
      iconComponent: Plus,
    },
    {
      label: 'Add All',
      visible:
        (props.isInDeck && numberLeft.value <= 2) ||
        (!props.isInDeck && isValid.value && numberLeft.value >= 2),
      command: addAll,
      iconComponent: Grid2x2Check,
    },
    {
      label: 'Remove Card',
      visible: props.isInDeck,
      command: removeCard,
      shortcut: 'Alt + 2',
      iconComponent: Minus,
    },
    {
      label: 'Remove All',
      visible: props.isInDeck && numberLeft.value >= 2,
      command: removeAll,
      iconComponent: Grid2x2X,
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

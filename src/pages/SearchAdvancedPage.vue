<template>
  <main>
    <h1><span class="primary-color">Advanced</span> Search</h1>
    <QueryBuilderInput
      v-for="query in queryBuilderInputSetup"
      :key="query.name"
      :name="query.name"
      :placeholder="query.placeholder"
      :modifiers="query.modifiers"
      v-model="values[query.name]"
      :is-number="!!query.isNumber"
      :options="query.options"
      ><template #icon> <component :is="query.icon" /> </template
    ></QueryBuilderInput>
    <Button asChild v-slot="slotProps" aria-label="a">
      <RouterLink
        :to="`/search/cards?query=${query}`"
        style="text-decoration: none"
        :class="(slotProps as Record<string, string>).class"
      >
        <Search class="p-button-icon p-button-icon-left" />
        <span class="p-button-label">Search</span></RouterLink
      >
    </Button>
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue'
import {
  AlarmClock,
  BicepsFlexed,
  Brain,
  CirclePlus,
  Grid2X2,
  Heart,
  Leaf,
  MessageSquareQuote,
  Search,
  Shapes,
  ShieldQuestion,
  Signature,
  Star,
  Sun,
  Text,
} from 'lucide-vue-next'
import { Button } from 'primevue'
import QueryBuilderInput from '@/components/searchadvanced/QueryBuilderInput.vue'
import TheFooter from '@/components/TheFooter.vue'
import { getAllCardsIterator } from '@/lib/getCard'

const values = reactive<Record<string, { query: string; value: string | number | null }[]>>({})

const query = computed(() => {
  const queryArr = []
  for (const [queryName, queryValues] of Object.entries(values)) {
    for (const { query, value } of queryValues) {
      if (value === '' || value === null) continue
      if (queryName === 'Card Name' && query === ' ') {
        queryArr.push(value)
      } else if (typeof value === 'string' && value.includes(' ')) {
        queryArr.push(`${query}"${value}"`)
      } else {
        queryArr.push(`${query}${value}`)
      }
    }
  }
  return encodeURIComponent(queryArr.join(' '))
})

const getTribes = () => {
  const tribes = new Set<string>()
  ;[...getAllCardsIterator()].forEach((card) => {
    card.tribes.forEach((tribe) => tribes.add(tribe))
  })
  return [...tribes].sort().map((tribe) => ({ value: tribe, label: tribe }))
}

const queryBuilderInputSetup = [
  {
    name: 'Card Name',
    placeholder: 'Any words in the name, e.g. "Sun"',
    icon: Signature,
    isNumber: false,
    modifiers: [
      { value: ' ', label: 'Card name contains' },
      { value: '-', label: 'Card name does not contain' },
    ],
  },
  {
    name: 'Cost',
    placeholder: 'Any number, e.g. "3"',
    icon: Math.random() < 0.5 ? Brain : Sun,
    isNumber: true,
    modifiers: [
      { value: 'c=', label: 'Cost is' },
      { value: 'c<', label: 'Cost is less than' },
      { value: 'c>', label: 'Cost is more than' },
      { value: 'c<=', label: 'Cost is less than or equal to' },
      { value: 'c<=', label: 'Cost is more than or equal to' },
    ],
  },
  {
    name: 'Strength',
    placeholder: 'Any number, e.g. "2"',
    icon: BicepsFlexed,
    isNumber: true,
    modifiers: [
      { value: 's=', label: 'Strength is' },
      { value: 's<', label: 'Strength is less than' },
      { value: 's>', label: 'Strength is more than' },
      { value: 's<=', label: 'Strength is less than or equal to' },
      { value: 's<=', label: 'Strength is more than or equal to' },
    ],
  },
  {
    name: 'Health',
    placeholder: 'Any number, e.g. "1"',
    icon: Heart,
    isNumber: true,
    modifiers: [
      { value: 'h=', label: 'Health is' },
      { value: 'h<', label: 'Health is less than' },
      { value: 'h>', label: 'Health is more than' },
      { value: 'h<=', label: 'Health is less than or equal to' },
      { value: 'h<=', label: 'Health is more than or equal to' },
    ],
  },
  {
    name: 'Abilities',
    placeholder: 'Any words in the text, e.g. "Freeze"',
    icon: Text,
    isNumber: false,
    modifiers: [
      { value: 'a:', label: 'Ability contains' },
      { value: '-a:', label: 'Ability does not contain' },
    ],
  },
  {
    name: 'Flavour',
    placeholder: 'Any words in the flavour text, e.g. "Best"',
    icon: MessageSquareQuote,
    isNumber: false,
    modifiers: [
      { value: 'f:', label: 'Flavour contains' },
      { value: '-f:', label: 'Flavour does not contain' },
    ],
  },
  {
    name: 'Is a ...',
    placeholder: 'Choose from the list, e.g. "Plant"',
    icon: Leaf,
    options: [
      {
        value: 'p',
        label: 'Plant',
      },
      {
        value: 'z',
        label: 'Zombie',
      },
    ],
    modifiers: [
      { value: 'is:', label: 'Is a' },
      { value: '-is:', label: 'Is not a' },
    ],
  },
  {
    name: 'Set',
    placeholder: 'Choose from the list, e.g. "Premium"',
    icon: Grid2X2,
    options: [
      {
        value: 'b',
        label: 'Basic',
      },
      {
        value: 'p',
        label: 'Premium',
      },
      {
        value: 'g',
        label: 'Galactic',
      },
      {
        value: 'c',
        label: 'Colossal',
      },
      {
        value: 't',
        label: 'Triassic',
      },
      {
        value: 'e',
        label: 'Event',
      },
      {
        value: 's',
        label: 'Superpower',
      },
    ],
    modifiers: [
      { value: 'set:', label: 'Set is' },
      { value: '-set:', label: 'Set is not' },
    ],
  },
  {
    name: 'Rarity',
    placeholder: 'Choose from the list, e.g. "Rare"',
    icon: Star,
    options: [
      {
        value: 'c',
        label: 'Common',
      },
      {
        value: 'u',
        label: 'Uncommon',
      },
      {
        value: 'r',
        label: 'Rare',
      },
      {
        value: 's',
        label: 'Super-Rare',
      },
      {
        value: 'l',
        label: 'Legendary',
      },
      {
        value: 'e',
        label: 'Event',
      },
      {
        value: 't',
        label: 'Token',
      },
    ],
    modifiers: [
      { value: 'r:', label: 'Rarity is' },
      { value: '-r:', label: 'Rarity is not' },
    ],
  },
  {
    name: 'Class',
    placeholder: 'Choose from the list, e.g. "Solar"',
    icon: ShieldQuestion,
    options: [
      {
        value: 'guardian',
        label: 'Guardian',
      },
      {
        value: 'kabloom',
        label: 'Kabloom',
      },
      {
        value: 'megagrow',
        label: 'Mega-Grow',
      },
      {
        value: 'smarty',
        label: 'Smarty',
      },
      {
        value: 'solar',
        label: 'Solar',
      },
      {
        value: 'beastly',
        label: 'Beastly',
      },
      {
        value: 'brainy',
        label: 'Brainy',
      },
      {
        value: 'crazy',
        label: 'Crazy',
      },
      {
        value: 'hearty',
        label: 'Hearty',
      },
      {
        value: 'sneaky',
        label: 'Sneaky',
      },
    ],
    modifiers: [
      { value: 'class:', label: 'Class is' },
      { value: '-class:', label: 'Class is not' },
    ],
  },
  {
    name: 'Type',
    placeholder: 'Choose from the list, e.g. "Trick"',
    icon: Shapes,
    options: [
      {
        value: 'p',
        label: 'Plant',
      },
      {
        value: 'z',
        label: 'Zombie',
      },
      {
        value: 't',
        label: 'Trick',
      },
      {
        value: 'e',
        label: 'Environment',
      },
      {
        value: 'f',
        label: 'Fighter',
      },
    ],
    modifiers: [
      { value: 'type:', label: 'Type is' },
      { value: '-type:', label: 'Type is not' },
    ],
  },
  {
    name: 'Tribe',
    placeholder: 'Choose from the list, e.g. "Root"',
    icon: AlarmClock,
    options: getTribes(),
    modifiers: [
      { value: 'tribe:', label: 'Tribe is' },
      { value: '-tribe:', label: 'Tribe is not' },
    ],
  },
  {
    name: 'Include',
    placeholder: 'Choose from the list, e.g. "All"',
    icon: CirclePlus,
    options: [
      {
        value: 't',
        label: 'Token',
      },
      {
        value: 'r',
        label: 'Removed',
      },
      {
        value: 's',
        label: 'Superpower',
      },
      {
        value: 'a',
        label: 'All',
      },
    ],
    modifiers: [],
  },
]
for (const query of queryBuilderInputSetup) {
  values[query.name] = [{ value: null, query: query.modifiers[0]?.value ?? 'include:' }]
}
</script>

<style scoped>
main {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
.primary-color {
  color: var(--p-primary-400);
}
h1 {
  text-align: center;
}

a.p-button {
  width: 100%;
}
</style>

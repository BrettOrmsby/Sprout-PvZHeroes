<template>
  <div class="card-list-textarea">
    <!--Need onchange because the .lazy modifier is not supported-->
    <Textarea
      :placeholder="placeholder"
      rows="6"
      :class="{ textarea: true, 'p-invalid': isError, error: isError }"
      v-bind="$attrs"
      v-model="rawText"
      @change="onChange"
    >
    </Textarea>
    <small v-if="isError">
      <template v-for="(list, key) in errors" :key="key">
        <span v-if="list.length">
          {{ formatErrorMessage(key, list) }}
        </span>
      </template>
    </small>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Textarea } from 'primevue'
import getCard from '@/lib/getCard'
import getHero from '@/lib/getHero'
import plants from '@/content/plants.json'
import zombies from '@/content/zombies.json'

const props = defineProps<{
  modelValue: Record<string, number> | null
  hero: string
  id?: string
}>()
const emit = defineEmits(['update:modelValue', 'update:isError'])

emit('update:isError', false)

type CardListErrors = {
  format: number[]
  cardName: string[]
  number: number[]
  invalidCard: string[]
  duplicate: string[]
}
const errors = ref<CardListErrors>({
  format: [],
  cardName: [],
  invalidCard: [],
  number: [],
  duplicate: [],
})
const isError = computed(() => Object.values(errors.value).flat().length > 0)

const computedHero = computed(() => getHero(props.hero))
const placeholder = computed(() => {
  const hero = computedHero.value
  const card = [...plants, ...zombies].find((e) => hero.class.includes(e.class))
  return `4 ${card?.name}`
})

const jsonToText = (obj: Record<string, number> | null): string => {
  if (!obj) {
    return ''
  }
  return Object.entries(obj)
    .map(([card, amount]) => {
      return amount + ' ' + card
    })
    .join('\n')
}
const rawText = ref(jsonToText(props.modelValue))

const json = ref<Record<string, number>>({})
const parseDeck = () => {
  const parsed: Record<string, number> = {}
  errors.value = {
    format: [],
    cardName: [],
    number: [],
    invalidCard: [],
    duplicate: [],
  }

  const lines = rawText.value.split('\n')
  const hero = computedHero.value

  lines.forEach((line, i) => {
    const trimmed = line.trim()
    if (!trimmed) return

    const match = trimmed.match(/^(\d+)\s*([^$]+)$/)
    if (!match) return errors.value.format.push(i + 1)

    const number = parseInt(match[1])
    const name = match[2]
    const card = getCard(name)

    if (number < 1 || number > 4) return errors.value.number.push(i + 1)
    if (!card) return errors.value.cardName.push(name)
    if (
      !hero.class.includes(card.class) ||
      card.class === 'Removed' ||
      ['token', 'superpower'].includes(card.set)
    )
      return errors.value.invalidCard.push(name)
    if (parsed[name]) return errors.value.duplicate.push(name)

    parsed[card.name] = number
  })

  json.value = parsed
}

const onChange = () => {
  parseDeck()
  emit('update:modelValue', json.value)
  emit('update:isError', isError.value)
}

const formatErrorMessage = (key: keyof CardListErrors, list: (string | number)[]) => {
  const plural = list.length > 1 ? 's' : ''
  switch (key) {
    case 'format':
      return `Invalid card formatting on line${plural} ${arrayToList(list)}`
    case 'number':
      return `Invalid card amount${plural} on line${plural} ${arrayToList(list)}`
    case 'cardName':
      return `Invalid card name${plural}: ${arrayToList(list)}`
    case 'duplicate':
      return `Duplicate card name${plural}: ${arrayToList(list)}`
    case 'invalidCard':
      return `Invalid card${plural} for a ${computedHero.value.name} deck: ${arrayToList(list)}`
    default:
      return ''
  }
}

const arrayToList = (array: (string | number)[]) =>
  array.join(', ').replace(/, ((?:.(?!, ))+)$/, ' and $1')
</script>

<style scoped>
.textarea {
  width: 100%;
  resize: none;
}
.error {
  margin-bottom: var(--inline-space) !important;
}

label {
  display: block;
  margin-bottom: var(--inline-space);
}

small {
  display: block;
  white-space: pre-line;
  color: var(--p-red-300);
}
small span {
  display: block;
}
</style>

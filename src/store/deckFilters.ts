import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import getCard from '@/lib/getCard'
import heroData from '@/content/heroes.json'
import type { Card } from '@/lib/types'

const sortOrderOptions = ['Name', 'Recently Edited', 'Created', 'Likes', 'Sparks']
const sortDirectionOptions = ['Ascending', 'Descending']
const targetOptions = ['All Decks', 'Your Decks', 'Liked Decks']
const showOptions = ['Complete Decks', 'All Decks']
const classOptions = [
  'Guardian',
  'Kabloom',
  'Mega-Grow',
  'Smarty',
  'Solar',
  'Beastly',
  'Brainy',
  'Crazy',
  'Hearty',
  'Sneaky',
]
const heroOptions = heroData.map((hero) => hero.name)

export const useDeckFilters = defineStore('deckFilters', () => {
  const route = useRoute()

  const isModalVisible = ref(false)
  const searchTarget = ref('')
  const searchTerm = ref('')
  const sortOption = ref('')
  const sortDirection = ref('')

  type FormValue = {
    name: string
    hero: string | null
    heroClass: string | null
    show: string
    cards: Card[]
    sparksMin: number
    sparksMax: number
  }

  const formFilters = reactive<FormValue>({
    name: '',
    hero: null,
    heroClass: null,
    show: 'Complete Decks',
    cards: [],
    sparksMin: 0,
    sparksMax: 160000,
  })

  const router = useRouter()
  const setFormValues = (form: FormValue) => {
    Object.assign(formFilters, form)
    router.push({
      name: 'SearchDecks',
      query: queryParams.value,
    })
    isModalVisible.value = false
  }

  const reset = () => {
    Object.assign(formFilters, {
      name: '',
      hero: null,
      heroClass: null,
      show: 'Complete Decks',
      cards: [],
      sparksMin: 0,
      sparksMax: 160000,
    })
    router.push({
      name: 'SearchDecks',
      query: queryParams.value,
    })
    isModalVisible.value = false
  }

  const queryParams = computed(() => ({
    search: searchTerm.value,
    target: searchTarget.value,
    sort: sortOption.value,
    order: sortDirection.value,
    ...formFilters,
    cards: formFilters.cards.map((e) => e.name),
  }))

  const getDefaultOption = <T>(param: string, options: string[], defaultValue: T) => {
    const paramValue = route.query[param]?.toString() as string
    return options.includes(paramValue) ? paramValue : defaultValue
  }
  watch(
    () => route.query,
    () => {
      // Reset the form values based on the route query

      searchTerm.value = route.query.search?.toString() || ''
      searchTarget.value = getDefaultOption('target', targetOptions, 'All Decks')
      sortOption.value = getDefaultOption('sort', sortOrderOptions, 'Name')
      sortDirection.value = getDefaultOption('order', sortDirectionOptions, 'Ascending')

      formFilters.name = route.query.name?.toString() || ''
      formFilters.hero = getDefaultOption('hero', heroOptions, null)
      formFilters.heroClass = getDefaultOption('heroClass', classOptions, null)
      formFilters.show = getDefaultOption('show', showOptions, 'Complete Decks')
      formFilters.cards = (
        ((route.query.cards && typeof route.query.cards === 'string'
          ? [route.query.cards]
          : route.query.cards) || []) as string[]
      ).map((card) => getCard(card))

      const toNumber = (str: string) => (isNaN(parseInt(str)) ? null : parseInt(str))
      const sparksEnd1 = toNumber(route.query.sparksMin as string) ?? 0
      const sparksEnd2 = toNumber(route.query.sparksMax as string) ?? 160000
      formFilters.sparksMin = Math.min(sparksEnd1, sparksEnd2)
      formFilters.sparksMax = Math.max(sparksEnd1, sparksEnd2)
    },
    { immediate: true },
  )
  return {
    isModalVisible,
    searchTerm,
    searchTarget,
    sortOption,
    sortDirection,
    formFilters,
    queryParams,
    setFormValues,
    reset,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDeckFilters, import.meta.hot))
}

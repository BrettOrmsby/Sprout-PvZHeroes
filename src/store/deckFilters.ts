import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import getCard from '@/lib/getCard'
import heroData from '@/content/heroes.json'
import type { Card } from '@/lib/types'

const sortOrderOptions = ['Name', 'Recently Edited', 'Created', 'Likes']
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

  const name = ref('')
  const hero = ref<string | null>('')
  const heroClass = ref<string | null>('')
  const show = ref('')
  const cards = ref<Card[]>([])

  type FormValue = {
    name: string
    hero: string | null
    heroClass: string | null
    show: string
    cards: Card[]
  }
  const getFormValues = (): FormValue => {
    return {
      name: name.value,
      hero: hero.value,
      heroClass: heroClass.value,
      show: show.value,
      cards: cards.value,
    }
  }

  const router = useRouter()
  const setFormValues = (form: FormValue) => {
    name.value = form.name
    hero.value = form.hero
    heroClass.value = form.heroClass
    show.value = form.show
    cards.value = form.cards
    router.push({
      name: 'SearchDecks',
      query: queryParams.value,
    })
    isModalVisible.value = false
  }

  const reset = () => {
    name.value = ''
    hero.value = null
    heroClass.value = null
    show.value = "Complete Decks'"
    cards.value = []
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
    name: name.value,
    hero: hero.value,
    heroClass: heroClass.value,
    show: show.value,
    cards: cards.value.map((e) => e.name),
  }))

  watch([sortOption, sortDirection, searchTarget], () => {
    router.push({
      name: 'SearchDecks',
      query: queryParams.value,
    })
  })
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

      name.value = route.query.name?.toString() || ''
      hero.value = getDefaultOption('hero', heroOptions, null)
      heroClass.value = getDefaultOption('heroClass', classOptions, null)
      show.value = getDefaultOption('show', showOptions, 'Complete Decks')
      cards.value = (
        ((route.query.cards && typeof route.query.cards === 'string'
          ? [route.query.cards]
          : route.query.cards) || []) as string[]
      ).map((card) => getCard(card))
    },
    { immediate: true },
  )
  return {
    isModalVisible,
    searchTerm,
    searchTarget,
    sortOption,
    sortDirection,
    name,
    hero,
    heroClass,
    show,
    cards,
    queryParams,
    getFormValues,
    setFormValues,
    reset,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDeckFilters, import.meta.hot))
}

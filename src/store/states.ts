import { acceptHMRUpdate, defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { QueryError } from '@/lib/parse-query/scanner'
export const useStatesStore = defineStore('state', () => {
  const editModal = ref(false)
  const suggestedPackModal = ref(false)
  const loadingRoute = ref(false)
  const cardHover = ref('Peashooter')
  const cardModal = reactive({ card: 'Peashooter', show: false })
  const heroModal = reactive({ hero: 'Green Shadow', show: false })
  const deckFilter = reactive({
    show: false,
    hideCards: false,
    textQuery: '',
    errors: [] as QueryError[],
    cardsMatchingFilter: [] as string[],
  })
  return {
    editModal,
    suggestedPackModal,
    loadingRoute,
    cardHover,
    cardModal,
    heroModal,
    deckFilter,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStatesStore, import.meta.hot))
}

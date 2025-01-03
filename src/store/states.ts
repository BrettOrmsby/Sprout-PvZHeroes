import { reactive } from 'vue'
import type { QueryError } from '@/lib/parse-query/scanner'

export default reactive({
  editModal: false,
  loadingRoute: false,
  cardHover: 'Peashooter',
  cardModal: {
    card: 'Peashooter',
    show: false,
  },
  heroModel: {
    hero: 'Green Shadow',
    show: false,
  },
  queryModal: {
    query: '',
    show: false,
  },
  deckFilter: {
    show: false,
    hideCards: false,
    textQuery: '',
    errors: [] as QueryError[],
    cardsMatchingFilter: [] as string[],
  },
})

import { onMounted, ref } from 'vue'
import throwError from '@/lib/throwError'
import useSupabase from '@/composables/UseSupabase'
import type { Deck } from '@/lib/types'

export function useCompleteDecks() {
  const { supabase } = useSupabase()

  const isLoading = ref(true)
  const decks = ref<Deck[]>([])
  const isError = ref(false)

  const loadDecks = async () => {
    isLoading.value = true
    isError.value = false

    const { data, error } = await supabase
      .from('decks')
      .select('*, hearts(count)')
      .order('created_at', { ascending: false })
      .eq('is_complete', true)
      .eq('is_private', false)
      .limit(6)
      .overrideTypes<(Omit<Deck, 'hearts'> & { hearts: { count: number }[] })[]>()

    if (error) {
      isError.value = true
      throwError(error)
    } else {
      const decksWithHearts: Deck[] = data.map((deck) => ({
        ...deck,
        hearts: deck.hearts?.[0]?.count || 0,
      }))
      decks.value = decksWithHearts
    }
    isLoading.value = false
  }

  onMounted(loadDecks)

  return { decks, isLoading, isError }
}

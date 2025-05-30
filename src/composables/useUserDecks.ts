import { ref, watchEffect, toValue, type MaybeRef } from 'vue'
import throwError from '@/lib/throwError'
import useSupabase from '@/composables/UseSupabase'
import type { Deck } from '@/lib/types'

export function useUserDecks(
  userId: MaybeRef<string | undefined>,
  sort: 'created_at' | 'last_updated' = 'last_updated',
  limit?: number,
) {
  const { supabase } = useSupabase()

  const isLoading = ref(true)
  const decks = ref<Deck[]>([])
  const isError = ref(false)

  const loadDecks = async () => {
    const user = toValue(userId)
    if (!user) {
      decks.value = []
      isLoading.value = false
      isError.value = false
      return
    }

    isLoading.value = true
    isError.value = false

    const query = supabase
      .from('decks')
      .select('*, hearts(count)')
      .eq('creator', user)
      .order(sort, { ascending: false })

    if (limit !== undefined) {
      query.limit(limit)
    }
    const { data, error } =
      await query.overrideTypes<(Omit<Deck, 'hearts'> & { hearts: { count: number }[] })[]>()

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

  watchEffect(loadDecks)

  return { decks, isLoading, isError }
}

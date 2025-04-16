import useAuthUser from '@/composables/UseAuthUser'
import useSupabase from '@/composables/UseSupabase'
import throwError from '@/lib/throwError'
import type { Deck } from '@/lib/types'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
const { supabase } = useSupabase()
const { id: authId } = useAuthUser()

function generateDeckStore(identifier: string) {
  return defineStore(identifier, () => {
    const id = ref('')
    const creator = ref('')
    const name = ref('')
    const is_private = ref(false)
    const is_complete = ref(false)
    const hero = ref('')
    const list = ref<Record<string, number>>({})
    const last_updated = ref('')
    const description = ref('')
    const hearts = ref(0)

    const isUsersDeck = computed(() => authId.value === creator.value)

    type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>
    function set(data: Optional<Deck, 'hearts'>) {
      id.value = data.id
      creator.value = data.creator
      name.value = data.name
      is_private.value = data.is_private
      is_complete.value = data.is_complete
      hero.value = data.hero
      list.value = data.list
      last_updated.value = data.last_updated
      description.value = data.description
      if (data.hearts) {
        hearts.value = data.hearts
      }
    }

    async function loadId(identity: string) {
      const { data, error } = await supabase
        .from('decks')
        .select('*, hearts(count)')
        .eq('id', identity)
        .single<Deck & { hearts: { count: number }[] }>()

      if (!error && data) {
        const hearts = data.hearts?.[0]?.count || 0
        set({ ...data, hearts })
      } else {
        hearts.value = 0
      }
      return error
    }

    async function update(data: Partial<Deck>) {
      // Note: we do not recheck the number of hearts
      const { data: newData, error } = await supabase
        .from('decks')
        .update(data)
        .eq('id', id.value)
        .select()
        .single<Omit<Deck, 'hearts'>>()

      if (error) {
        throwError(error)
        return error
      }
      set(newData)
    }

    return {
      id,
      creator,
      name,
      is_private,
      is_complete,
      hero,
      list,
      last_updated,
      description,
      hearts,
      isUsersDeck,
      loadId,
      update,
    }
  })
}

export const useDeckStore = generateDeckStore('deck')
export const useCompareStore = generateDeckStore('compare')

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDeckStore, import.meta.hot))
  import.meta.hot.accept(acceptHMRUpdate(useCompareStore, import.meta.hot))
}

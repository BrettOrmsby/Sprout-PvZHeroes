import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import useAuthUser from '@/composables/UseAuthUser'
import useSupabase from '@/composables/UseSupabase'
import throwError from '@/lib/throwError'
import { useDeckStore } from './deck'
import { useNotificationsStore } from './notifications'

const { supabase } = useSupabase()
const { id } = useAuthUser()

export const useHeartStore = defineStore('hearts', () => {
  const deck = useDeckStore()
  const notifications = useNotificationsStore()
  const hearts = ref<string[]>([])

  async function load() {
    const { data, error } = await supabase.from('hearts').select('deck_id').eq('user_id', id.value)

    if (error) {
      throwError(error)
      return
    }
    hearts.value = data.map((record) => record.deck_id)
  }

  let isUpdatingLike = false
  async function updateLike(deck_id: string, user: string) {
    if (isUpdatingLike) {
      return
    }
    isUpdatingLike = true
    if (hearts.value.includes(deck_id)) {
      hearts.value.splice(hearts.value.indexOf(deck_id), 1)
      if (deck.id === deck_id) {
        deck.hearts -= 1
      }
      const { error } = await supabase
        .from('hearts')
        .delete()
        .eq('user_id', id.value)
        .eq('deck_id', deck_id)
      if (error) {
        hearts.value.push(deck_id)
        if (deck.id === deck_id) {
          deck.hearts += 1
        }
        // If there was an error, it probably was not synced
        throwError({ message: 'Failed to Remove Like', hint: 'Attempting to resync likes.' })
        await load()
      }
      isUpdatingLike = false
      return
    }

    hearts.value.push(deck_id)
    if (deck.id === deck_id) {
      deck.hearts += 1
    }
    const { error } = await supabase.from('hearts').insert({
      user_id: id.value,
      deck_id,
    })
    if (error) {
      hearts.value.splice(hearts.value.indexOf(deck_id), 1)
      if (deck.id === deck_id) {
        deck.hearts -= 1
      }
      // If there was an error, it probably was not synced
      throwError({ message: 'Failed to Add Like', hint: 'Attempting to resync likes.' })
      await load()
      isUpdatingLike = false
    }

    notifications.sendLikeNotification(deck_id, user)
    isUpdatingLike = false
  }

  return { hearts, load, updateLike }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHeartStore, import.meta.hot))
}

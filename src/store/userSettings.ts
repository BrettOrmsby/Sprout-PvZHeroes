import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import useAuthUser from '@/composables/UseAuthUser'
import useSupabase from '@/composables/UseSupabase'
import throwError from '@/lib/throwError'
import type { UserSettings } from '@/lib/types'

const { supabase } = useSupabase()
const { id } = useAuthUser()

export const useUserSettingsStore = defineStore('user-settings', () => {
  // TODO: local storage this too
  const cardView = ref('image')
  async function load() {
    const { data, error } = await supabase
      .from('profiles')
      .select('card_view')
      .eq('id', id.value)
      .single()
    if (error) {
      throwError(error)
      return
    }
    cardView.value = data.card_view
  }

  async function update(data: Partial<UserSettings>) {
    const { data: newData, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', id.value)
      .select()
      .single<UserSettings>()

    if (error) {
      return error
    }
    set(newData)
  }

  async function set(data: UserSettings) {
    cardView.value = data.card_view
  }

  const $reset = () => {
    cardView.value = 'image'
  }

  return { cardView, load, $reset, update }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserSettingsStore, import.meta.hot))
}

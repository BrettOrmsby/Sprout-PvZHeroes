import { acceptHMRUpdate, defineStore } from 'pinia'
import { reactive } from 'vue'
import useAuthUser from '@/composables/UseAuthUser'
import useSupabase from '@/composables/UseSupabase'
import throwError from '@/lib/throwError'
import type { UserSettings } from '@/lib/types'

const { supabase } = useSupabase()
const { id } = useAuthUser()

export const useUserSettingsStore = defineStore('user-settings', () => {
  // TODO: local storage this too
  const cardViewSettings = reactive({
    card_view: 'image' as 'text' | 'image',
    show_stats: true,
    show_cost: true,
    show_set: true,
  })
  async function load() {
    const { data, error } = await supabase
      .from('profiles')
      .select('card_view,show_cost,show_set,show_stats')
      .eq('id', id.value)
      .single()
    if (error) {
      throwError(error)
      return
    }
    set(data)
  }

  async function update(data: Partial<UserSettings>) {
    const { data: newData, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', id.value)
      .select('card_view,show_cost,show_set,show_stats')
      .single<UserSettings>()

    if (error) {
      return error
    }
    set(newData)
  }

  async function set(data: UserSettings) {
    Object.assign(cardViewSettings, data)
  }

  const $reset = () => {
    set({
      card_view: 'image',
      show_stats: true,
      show_cost: true,
      show_set: true,
    })
  }

  return { cardViewSettings, load, set, $reset, update }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserSettingsStore, import.meta.hot))
}

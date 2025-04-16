import useSupabase from '@/composables/UseSupabase'
import throwError from '@/lib/throwError'
import type { User } from '@/lib/types'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

const { supabase } = useSupabase()

export const useUserStore = defineStore('user', () => {
  const username = ref('')
  const profile_image = ref('')
  const id = ref('')
  const created_at = ref('')

  function set(data: User) {
    username.value = data.username
    profile_image.value = data.profile_image
    id.value = data.id
    created_at.value = data.created_at
  }

  async function loadFromUsername(username: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single<User>()

    if (!error && data) {
      set(data)
    }
    return error
  }
  async function loadFromId(id: string) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single<User>()

    if (!error && data) {
      set(data)
    }
    return error
  }

  async function update(data: Partial<User>) {
    const { data: newData, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('username', username.value)
      .select()
      .single<User>()

    if (error) {
      throwError(error)
      return error
    }
    set(newData)
  }

  return { username, profile_image, id, created_at, loadFromUsername, loadFromId, update }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}

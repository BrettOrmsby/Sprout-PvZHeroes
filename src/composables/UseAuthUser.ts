import useSupabase from '@/composables/UseSupabase'
import type { User } from '@supabase/supabase-js'
import { computed, ref } from 'vue'

// user is set outside of the useAuthUser function
// so that it will act as global state and always refer to a single user
const user = ref<null | User>(null)
const { supabase } = useSupabase()

export default function useAuthUser() {
  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const isSignedIn = computed(() => !!user.value)
  const id = computed(() => user.value?.id)

  return {
    user,
    id,
    signIn,
    isSignedIn,
    signOut,
  }
}

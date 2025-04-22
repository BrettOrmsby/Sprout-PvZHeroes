import useSupabase from '@/composables/UseSupabase'
import type { User } from '@supabase/supabase-js'
import { computed, ref } from 'vue'

const user = ref<null | User>(null)
const { supabase } = useSupabase()

supabase.auth.onAuthStateChange((event, session) => {
  const { provider_token, provider_refresh_token } = session ?? {}
  if (provider_token) window.localStorage.setItem('oauth_provider_token', provider_token)
  if (provider_refresh_token)
    window.localStorage.setItem('oauth_provider_refresh_token', provider_refresh_token)
  if (event === 'SIGNED_OUT') {
    window.localStorage.removeItem('oauth_provider_token')
    window.localStorage.removeItem('oauth_provider_refresh_token')
  }

  user.value = session?.user ?? null
})

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

  async function forceLoadUser() {
    const { user } = useAuthUser()
    if (!user.value) {
      const { data } = await supabase.auth.getSession()
      user.value = data.session?.user ?? null
    }
  }

  const isSignedIn = computed(() => !!user.value)
  const id = computed(() => user.value?.id)

  return {
    user,
    id,
    signIn,
    forceLoadUser,
    isSignedIn,
    signOut,
  }
}

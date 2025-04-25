import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import useAuthUser from '@/composables/UseAuthUser'
import useSupabase from '@/composables/UseSupabase'
import throwError from '@/lib/throwError'
import type { Notification } from '@/lib/types'

const { supabase } = useSupabase()
const { id } = useAuthUser()

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  const unreadNotificationsCount = ref(0)
  const isLoading = ref(false)
  const isLoadError = ref(false)

  async function load() {
    isLoading.value = true
    isLoadError.value = false
    const { data, error } = await supabase
      .rpc('get_notifications')
      .eq('recipient_id', id.value)
      .order('created_at', { ascending: false })
    if (error) {
      isLoadError.value = true
      throwError(error)
    } else {
      notifications.value = data as Notification[]
    }
    isLoading.value = false
  }

  async function loadUnreadCount() {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', id.value)
      .eq('is_read', false)

    if (error) {
      unreadNotificationsCount.value = 0
      throwError(error)
      return
    }
    if (count !== null) {
      unreadNotificationsCount.value = count
    }
  }

  async function markRead(identity: string) {
    const notification = notifications.value.find((element) => element.id === identity)
    if (notification && !notification.is_read) {
      notification.is_read = true
      unreadNotificationsCount.value -= 1
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notification.id)
      if (error) {
        notification.is_read = false
        unreadNotificationsCount.value += 1
      }
    }
  }

  async function sendLikeNotification(deck_id: string, user: string) {
    // Note, most likely error is when a heart is added/removed multiple times (code 23505). If it is another error, this is not too important to show
    await supabase.from('notifications').insert({
      recipient_id: user,
      actor_id: id.value,
      deck_id,
      type: 'heart',
    })
  }

  return {
    isLoading,
    isLoadError,
    notifications,
    unreadNotificationsCount,
    load,
    loadUnreadCount,
    sendLikeNotification,
    markRead,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNotificationsStore, import.meta.hot))
}

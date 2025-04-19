import app from '@/main'
import type { PostgrestError } from '@supabase/supabase-js'

export default function throwError(error: Pick<PostgrestError, 'message' | 'hint'>) {
  console.log(error)
  if (error.message.startsWith('TypeError: NetworkError')) {
    error = { message: 'Network Error', hint: 'Failed to load resource.' }
  }
  app.config.globalProperties.$toast.add({
    severity: 'error',
    summary: error.message,
    detail: error.hint,
    life: 10000,
  })
}

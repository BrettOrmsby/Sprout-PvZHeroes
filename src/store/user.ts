import { reactive } from 'vue'
import type { User } from '@/lib/types'

export default reactive<User>({
  username: '',
  profile_image: '',
  id: '',
  created_at: '',
})

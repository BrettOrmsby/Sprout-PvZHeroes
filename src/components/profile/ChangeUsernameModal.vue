<template>
  <Dialog
    :draggable="false"
    :modal="true"
    v-model:visible="isOpen"
    style="max-width: 500px; width: 100%; margin: var(--block-space)"
    header="Change Username"
  >
    <InputGroup>
      <InputText
        v-model="selectedUsername"
        aria-label="Hero"
        @keyup.enter="updateUsername"
        autofocus
      />
      <Button label="Update" @click="updateUsername" :loading="isUpdatingUsername" />
    </InputGroup>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Dialog, InputGroup, InputText } from 'primevue'
import throwError from '@/lib/throwError'
import { useUserStore } from '@/store/user'

const user = useUserStore()
const router = useRouter()

const isOpen = defineModel('open', { default: false, required: true })
const selectedUsername = ref(user.username)
const isUpdatingUsername = ref(false)

const updateUsername = async () => {
  if (selectedUsername.value === user.username) {
    isOpen.value = false
    return
  }

  isUpdatingUsername.value = true
  const error = await user.update({
    username: selectedUsername.value,
  })
  isUpdatingUsername.value = false
  if (error) {
    if (error.code === '23505') {
      throwError({ message: 'Username Taken', hint: 'Username must be unique.' })
    } else {
      throwError(error)
    }
  } else {
    isOpen.value = false
    // Update the url with the new username
    router.replace({ name: 'Profile', params: { username: selectedUsername.value } })
  }
}
</script>

<style scoped></style>

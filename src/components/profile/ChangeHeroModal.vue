<template>
  <Dialog
    :draggable="false"
    :modal="true"
    v-model:visible="isOpen"
    style="max-width: 500px; width: 100%; margin: var(--block-space)"
    header="Change Profile Image"
  >
    <InputGroup>
      <HeroSelect v-model="selectedHero" aria-label="Hero" />
      <Button label="Update" @click="updateHeroImage" :loading="isUpdatingProfileImage" />
    </InputGroup>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Button, Dialog, InputGroup } from 'primevue'
import HeroSelect from '@/components/HeroSelect.vue'
import throwError from '@/lib/throwError'
import { useUserStore } from '@/store/user'

const user = useUserStore()

const isOpen = defineModel('open', { default: false, required: true })
const selectedHero = ref(user.profile_image)
const isUpdatingProfileImage = ref(false)

const updateHeroImage = async () => {
  if (selectedHero.value === user.profile_image) {
    isOpen.value = false
    return
  }

  isUpdatingProfileImage.value = true
  const error = await user.update({
    profile_image: selectedHero.value,
  })
  isUpdatingProfileImage.value = false
  if (error) {
    throwError(error)
  } else {
    isOpen.value = false
  }
}
</script>

<style scoped></style>

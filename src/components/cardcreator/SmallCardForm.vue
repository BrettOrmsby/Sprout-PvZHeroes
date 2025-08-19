<template>
  <form>
    <h2>Small Card</h2>
    <template v-if="card.tribes.includes('Superpower')">
      <span id="frame">Frame</span>
      <Select
        v-model="card.frameOverwrite"
        :options="frameOptions"
        option-label="label"
        option-value="value"
        aria-labelledby="frame"
        placeholder="Default "
      />
    </template>
    <label for="imgWidthSmall">Image Width</label>
    <InputNumber v-model="card.smallImageSettings.width" inputId="imgWidthSmall" placeholder="80" />
    <label for="imgXOffsetSmall">Image X Offset</label>
    <InputNumber
      v-model="card.smallImageSettings.left"
      inputId="imgXOffsetSmall"
      placeholder="-11"
      :useGrouping="false"
      locale="en-US"
    />
    <label for="imgYOffsetSmall">Image Y Offset</label>
    <InputNumber
      v-model="card.smallImageSettings.top"
      inputId="imgYOffsetSmall"
      placeholder="-20"
      :useGrouping="false"
      locale="en-US"
    />
    <label for="imgSmallRotation">Image Rotation</label>
    <InputNumber
      v-model="card.smallImageSettings.rotate"
      inputId="imgSmallRotation"
      placeholder="15"
      :useGrouping="false"
      locale="en-US"
    />
    <Message severity="warn"
      >Card Creator may not download images on mobile. Instead, you can screen shot the image
      below.</Message
    >
    <Button label="Download" :loading="isDownloading" @click="downloadSmallImage">
      <template #icon="iconClass">
        <Download :class="iconClass.class" />
      </template>
    </Button>
  </form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Button, InputNumber, Message, Select } from 'primevue'
import { Download } from 'lucide-vue-next'
import { toBlob } from 'html-to-image'
import FileSaver from 'file-saver'
import throwError from '@/lib/throwError'
import { useCustomCardStore } from '@/store/cardcreator/customCard'

const card = useCustomCardStore()

const frameOptions = [
  {
    value: 'default',
    label: 'Default',
  },
  {
    value: 'super',
    label: 'Super Power',
  },
  {
    value: 'signature',
    label: 'Signature Super Power',
  },
]

const isDownloading = ref(false)
const downloadSmallImage = async () => {
  isDownloading.value = true
  const cardContainer = document.querySelector('.small-card-container') as HTMLElement
  try {
    const blob = await toBlob(cardContainer, { canvasWidth: 300, canvasHeight: 244 })
    const safeName = card.name.replace(/[^a-z0-9_\-]/gi, '_')
    FileSaver.saveAs(blob as Blob, `${safeName}-small.png`)
  } catch {
    throwError({ message: 'Failed to download image', hint: 'Please try again.' })
  }
  isDownloading.value = false
}
</script>

<style scoped>
.p-message {
  display: none;
}
@media only screen and (hover: none) and (pointer: coarse) and (max-width: 600px) {
  .p-message {
    display: block;
    margin-bottom: var(--block-space);
  }
}

form {
  width: 100%;
}
</style>

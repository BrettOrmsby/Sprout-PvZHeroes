<template>
  <main>
    <div class="side-layout">
      <form @submit.prevent="downloadMainImage">
        <h1><PencilRuler />Card Creator</h1>
        <label for="cardName">Card Name</label>
        <InputText id="cardName" type="text" placeholder="Galacta-Cactus" v-model="card.name" />
        <span id="classLabel">Class</span>
        <ClassSelect v-model="card.className" aria-labelledby="classLabel" :to-lower-case="true" />
        <span id="rarityLabel">Rarity</span>
        <Select
          v-model="card.rarity"
          :options="rarityOptions"
          option-label="label"
          option-value="value"
          aria-labelledby="rarityLabel"
          placeholder="Super-Rare "
        />
        <span id="typeLabel">Type</span>
        <Select
          v-model="card.type"
          :options="typeOptions"
          option-label="label"
          option-value="value"
          aria-labelledby="typeLabel"
          placeholder="Fighter "
        />

        <label for="cost">Cost</label>
        <InputNumber v-model="card.cost" inputId="cost" :min="0" placeholder="1" />
        <template v-if="card.type === 'fighter'">
          <label for="strength">Strength</label>
          <InputNumber v-model="card.strength" inputId="strength" :min="0" placeholder="2" />
          <label for="health">Health</label>
          <InputNumber v-model="card.health" inputId="health" :min="1" placeholder="1" />

          <span id="strengthImage">Strength Image</span>
          <ImageSelect
            v-model="card.strengthImg!"
            :options="strengthImageOptions"
            placeholder="Bullseye"
            aria-labelledby="strengthImage"
          />
          <span id="healthImage">Health Image</span>
          <ImageSelect
            v-model="card.healthImg!"
            :options="healthImageOptions"
            placeholder="Heart"
            aria-labelledby="healthImage"
          />
        </template>

        <label for="tribes">Tribes</label>
        <AutoComplete
          v-model="card.tribes"
          inputId="tribes"
          multiple
          :suggestions="tribesItems"
          @complete="searchTribes"
          :placeholder="card.tribes.length ? '' : 'Cactus'"
        />

        <label for="abilities">Abilities</label>
        <Textarea
          id="abilities"
          v-model="card.abilities"
          autoResize
          :placeholder="'{{Bullseye}}[[Bullseye]]\n**When destroyed**: Do 1 damage to everything.'"
        />
        <small><a href="#ability-syntax">View ability syntax</a></small>

        <label for="flavour">Flavour</label>
        <InputText
          id="flavour"
          type="text"
          placeholder='"I take pity on no one. For I am Galacta-Cactus!"'
          v-model="card.flavour"
        />
        <small>The flavour text is white even on light mode.</small>

        <Divider />
        <h2>Card Image</h2>
        <FileUpload
          :choose-button-props="{ severity: 'secondary' }"
          mode="basic"
          customUpload
          auto
          @select="onFileSelect"
          accept="image/*"
          :maxFileSize="1000000"
          chooseLabel="Upload Card Image"
        />
        <label for="imgWidth">Image Width</label>
        <InputNumber
          v-model="card.imgWidth"
          inputId="imgWidth"
          :min="0"
          :max="300"
          placeholder="100"
        />
        <label for="imgXOffset">Image X Offset</label>
        <InputNumber
          v-model="card.imgXOffset"
          inputId="imgXOffset"
          :min="0"
          :max="300"
          placeholder="100"
        />
        <label for="imgYOffset">Image Y Offset</label>
        <InputNumber
          v-model="card.imgYOffset"
          inputId="imgYOffset"
          :min="0"
          :max="400"
          placeholder="100"
        />
        <Divider />
        <h2>Background</h2>
        <span id="backgroundType">Background Type</span>
        <Select
          v-model="backgroundType"
          :options="backgroundTypeOptions"
          option-label="label"
          option-value="value"
          aria-labelledby="backgroundType"
          placeholder="Transparent "
          @change="updateBackground"
        />
        <template v-if="backgroundType === 'colour'">
          <label for="colourPicker">Colour</label>
          <InputGroup>
            <InputGroupAddon>#</InputGroupAddon>
            <InputText v-model="backgroundColour" id="colourPicker" placeholder="Hex" />
            <InputGroupAddon
              ><ColorPicker
                v-model="backgroundColour"
                aria-label="Visual Colour Picker"
                format="hex"
                @change="updateBackgroundFromColour"
              />
            </InputGroupAddon>
          </InputGroup>
        </template>
        <Divider />
        <Message severity="warn"
          >Card Creator may not download images on mobile. Instead, you can screen shot the image
          below.</Message
        >
        <Button type="submit" label="Download" :loading="isDownloadingMain">
          <template #icon="iconClass">
            <Download :class="iconClass.class" />
          </template>
        </Button>
      </form>
      <div class="card-render-container">
        <CustomCardRender :card="card" />
      </div>
    </div>
    <Divider />
    <div class="side-layout">
      <form @submit.prevent="downloadSmallImage">
        <h2>Small Card</h2>
        <label for="imgWidthSmall">Image Width</label>
        <InputNumber v-model="smallImageSettings.width" inputId="imgWidthSmall" placeholder="80" />
        <label for="imgXOffsetSmall">Image X Offset</label>
        <InputNumber
          v-model="smallImageSettings.left"
          inputId="imgXOffsetSmall"
          placeholder="-11"
        />
        <label for="imgYOffsetSmall">Image Y Offset</label>
        <InputNumber v-model="smallImageSettings.top" inputId="imgYOffsetSmall" placeholder="-20" />
        <label for="imgSmallRotation">Image Rotation</label>
        <InputNumber
          v-model="smallImageSettings.rotate"
          inputId="imgSmallRotation"
          placeholder="15"
        />
        <Message severity="warn"
          >Card Creator may not download images on mobile. Instead, you can screen shot the image
          below.</Message
        >
        <Button type="submit" label="Download" :loading="isDownloadingSmall">
          <template #icon="iconClass">
            <Download :class="iconClass.class" />
          </template>
        </Button>
      </form>
      <div class="card-render-container">
        <SmallCustomCardRender :card="card" :image-settings="smallImageSettings" />
      </div>
    </div>
    <h2 id="ability-syntax">Ability Syntax</h2>
    <AbilityAccordionHelp />
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
// TODO: allow common rarity? allow event?
// TODO: allow super frames (sig and not)
import { reactive, ref } from 'vue'
import {
  AutoComplete,
  Button,
  ColorPicker,
  Divider,
  InputNumber,
  InputText,
  InputGroup,
  InputGroupAddon,
  FileUpload,
  Message,
  Select,
  Textarea,
  type AutoCompleteCompleteEvent,
  type FileUploadSelectEvent,
  type SelectChangeEvent,
  type ColorPickerChangeEvent,
} from 'primevue'
import { toBlob } from 'html-to-image'
import { Download, PencilRuler } from 'lucide-vue-next'
import TheFooter from '@/components/TheFooter.vue'
import CustomCardRender, { type CustomCard } from '@/components/cardcreator/CustomCardRender.vue'
import ClassSelect from '@/components/ClassSelect.vue'
import ImageSelect from '@/components/cardcreator/ImageSelect.vue'
import plants from '@/content/plants.json'
import zombies from '@/content/zombies.json'
import superPowers from '@/content/superpowers.json'
import throwError from '@/lib/throwError'
import AbilityAccordionHelp from '@/components/cardcreator/AbilityAccordionHelp.vue'
import FileSaver from 'file-saver'
import SmallCustomCardRender, {
  type SmallImageSettings,
} from '@/components/cardcreator/SmallCustomCardRender.vue'
const card = reactive<CustomCard<'fighter' | 'trick' | 'environment'>>({
  className: 'guardian',
  name: 'Galacta-Cactus',
  type: 'fighter',
  tribes: ['Cactus', 'Flower'],
  abilities: '{{Bullseye}}[[Bullseye]]\n**When destroyed:** Do 1 damage to everything.',
  rarity: 'super-rare',
  flavour: '"I take pity on no one. For I am Galacta-Cactus!"',
  cost: 1,
  strength: 2,
  health: 1,
  strengthImg: 'truestrike',
  healthImg: 'heart',
  img: 'https://static.wikia.nocookie.net/plantsvszombies/images/b/b8/Galacta-Cactus_HD.png',
  imgWidth: 70,
  imgXOffset: 115,
  imgYOffset: 80,
  backgroundColour: 'transparent',
})
const smallImageSettings = reactive<SmallImageSettings>({
  width: 80,
  top: -20,
  left: -11,
  rotate: 15,
})

const rarityOptions = [
  { label: 'Uncommon', value: 'uncommon' },
  { label: 'Rare', value: 'rare' },
  { label: 'Super-Rare', value: 'super-rare' },
  { label: 'Legendary', value: 'legendary' },
]

const typeOptions = [
  { label: 'Fighter', value: 'fighter' },
  { label: 'Trick', value: 'trick' },
  { label: 'Environment', value: 'environment' },
]

const strengthImageOptions = [
  'anti-hero',
  'deadly',
  'doublestrike',
  'frenzy',
  'overshoot',
  'star',
  'strength',
  'strikethrough',
  'truestrike',
].map((name) => ({
  label: getReadableImageLabel(name),
  value: name,
  imgSrc: `/images/abilities/${name}.png`,
}))

const healthImageOptions = ['armored', 'heart', 'star', 'strength-heart', 'untrickable'].map(
  (name) => ({
    label: getReadableImageLabel(name),
    value: name,
    imgSrc: `/images/abilities/${name}.png`,
  }),
)

function getReadableImageLabel(name: string) {
  if (name === 'truestrike') {
    return 'Bullseye'
  } else if (name === 'doublestrike') {
    return 'Doublestrike'
  } else {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }
}

const tribes = new Set([...plants, ...zombies, ...superPowers].flatMap((card) => card.tribes))
const tribesItems = ref<string[]>([])
const searchTribes = (event: AutoCompleteCompleteEvent) => {
  tribesItems.value = [...tribes, event.query].filter((tribe) =>
    tribe.toLowerCase().includes(event.query.toLowerCase()),
  )
}

function onFileSelect(event: FileUploadSelectEvent) {
  const file = event.files[0]
  const reader = new FileReader()
  reader.onload = async (e) => {
    card.img = e.target!.result!.toString()
  }
  reader.readAsDataURL(file)
}

const backgroundType = ref<'transparent' | 'colour'>('transparent')
const backgroundColour = ref('818cf8')
const backgroundTypeOptions = [
  {
    label: 'Transparent',
    value: 'transparent',
  },
  {
    label: 'Colour',
    value: 'colour',
  },
]
const updateBackground = (e: SelectChangeEvent) => {
  if (e.value === 'transparent') {
    card.backgroundColour = 'transparent'
  } else if (e.value === 'colour') {
    card.backgroundColour = '#' + backgroundColour.value
  }
}
const updateBackgroundFromColour = (e: ColorPickerChangeEvent) => {
  card.backgroundColour = '#' + e.value
}

const isDownloadingMain = ref(false)
const downloadMainImage = async () => {
  isDownloadingMain.value = true
  const cardContainer = document.querySelector('.card-container') as HTMLElement
  try {
    const blob = await toBlob(cardContainer, { canvasWidth: 600, canvasHeight: 800 })
    FileSaver.saveAs(blob as Blob, `${card.name}.png`)
  } catch {
    throwError({ message: 'Failed to download image', hint: 'Please try again.' })
  }
  isDownloadingMain.value = false
}
const isDownloadingSmall = ref(false)
const downloadSmallImage = async () => {
  isDownloadingSmall.value = true
  const cardContainer = document.querySelector('.small-card-container') as HTMLElement
  try {
    const blob = await toBlob(cardContainer, { canvasWidth: 300, canvasHeight: 244 })
    FileSaver.saveAs(blob as Blob, `${card.name}-small.png`)
  } catch {
    throwError({ message: 'Failed to download image', hint: 'Please try again.' })
  }
  isDownloadingSmall.value = false
}
</script>

<style scoped>
:global(html) {
  scroll-behavior: smooth;
}
:target {
  scroll-margin-top: 3em;
}
main {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--inline-space);
}
h1 svg {
  color: var(--p-primary-400);
  width: 1em;
  height: 1em;
  flex-shrink: 0;
}
.p-message {
  display: none;
}
@media only screen and (hover: none) and (pointer: coarse) and (max-width: 600px) {
  .p-message {
    display: block;
    margin-bottom: var(--block-space);
  }
}

.side-layout {
  display: flex;
  justify-content: center;
  gap: var(--block-space);
}
@media only screen and (max-width: 600px) {
  .side-layout {
    flex-direction: column;
    align-items: center;
  }
  .card-render-container {
    width: 100%;
  }
}
form {
  width: 100%;
}

.card-render-container {
  position: sticky;
  top: 6rem;
  left: 0;
  flex-shrink: 0;
  height: fit-content;
  width: 300px;
  display: flex;
  justify-content: center;
}

small {
  color: var(--p-text-muted-color);
}
a {
  color: var(--p-text-muted-color);
  text-decoration: underline;
  transition-duration: var(--p-transition-duration);
}
a:hover {
  color: var(--p-text-hover-muted-color);
}

label,
span:has(+ .p-select) {
  display: block;
  margin-bottom: var(--inline-space);
  font-weight: bold;
}

.error {
  margin-top: var(--inline-space);
  margin-bottom: var(--block-space);
  color: var(--p-red-300);
  display: block;
}

.p-inputtext,
.p-select,
.p-inputnumber,
.p-autocomplete,
.p-textarea,
.p-button,
:deep(.p-fileupload-choose-button) {
  width: 100%;
}

:is(
    :not(.p-inputgroup) > .p-inputtext,
    .p-autocomplete,
    .p-select,
    .p-inputnumber,
    .p-textarea,
    .p-fileupload
  ):has(+ :not(:is(small, .help-message))) {
  margin-bottom: var(--block-space);
}
small {
  margin-top: var(--inline-space);
  margin-bottom: var(--block-space);
  display: block;
}

.autocomplete-item {
  display: flex;
  align-items: center;
  gap: var(--inline-space);
}
.autocomplete-item img {
  width: 2em;
  height: 100%;
}
</style>

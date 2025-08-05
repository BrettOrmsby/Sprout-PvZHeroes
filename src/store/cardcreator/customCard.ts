import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export type StrengthImage =
  | 'anti-hero'
  | 'deadly'
  | 'doublestrike'
  | 'frenzy'
  | 'overshoot'
  | 'star'
  | 'strength'
  | 'strikethrough'
  | 'truestrike'
export type HealthImage = 'armored' | 'heart' | 'star' | 'untrickable' | 'strength-heart'
export type ClassName =
  | 'beastly'
  | 'brainy'
  | 'crazy'
  | 'guardian'
  | 'hearty'
  | 'kabloom'
  | 'mega-grow'
  | 'smarty'
  | 'sneaky'
  | 'solar'
export type Rarity = 'uncommon' | 'rare' | 'super-rare' | 'legendary' | 'common' | 'event' | 'token'

export const useCustomCardStore = defineStore('customCard', () => {
  const className = ref<ClassName>('guardian')
  const name = ref('Galacta-Cactus')
  const type = ref<'fighter' | 'trick' | 'environment'>('fighter')
  const tribes = ref<string[]>(['Cactus', 'Flower'])
  const abilities = ref('{{Bullseye}}[[Bullseye]]\n**When destroyed:** Do 1 damage to everything.')
  const rarity = ref<Rarity>('super-rare')
  const flavour = ref('"I take pity on no one. For I am Galacta-Cactus!"')
  const cost = ref(1)
  const strength = ref(2)
  const health = ref(1)
  const strengthImg = ref<StrengthImage>('truestrike')
  const healthImg = ref<HealthImage>('heart')
  const img = ref(
    'https://static.wikia.nocookie.net/plantsvszombies/images/b/b8/Galacta-Cactus_HD.png',
  )
  const imgWidth = ref(70)
  const imgXOffset = ref(115)
  const imgYOffset = ref(80)
  const backgroundColour = ref('transparent')

  const frameOverwrite = ref<'default' | 'super' | 'signature'>('default')
  const smallImageSettings = ref({
    width: 80,
    top: -20,
    left: -11,
    rotate: 15,
  })
  return {
    className,
    name,
    type,
    tribes,
    abilities,
    rarity,
    flavour,
    cost,
    strength,
    health,
    strengthImg,
    healthImg,
    img,
    imgWidth,
    imgXOffset,
    imgYOffset,
    backgroundColour,
    frameOverwrite,
    smallImageSettings,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCustomCardStore, import.meta.hot))
}

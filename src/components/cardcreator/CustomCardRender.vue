<template>
  <div class="card-container">
    <img
      :class="['card-background', card.className]"
      :style="{
        'background-color': card.backgroundColour,
      }"
      :src="`/images/cardcreator/${card.className}.png`"
      :alt="`${card.className} background`"
    />
    <span class="card-cost" :class="costClass">{{ card.cost }}</span>
    <img class="card-image" alt="Card Image" :src="card.img" :style="cardImageStyle" />
    <div class="card-strength" v-if="card.type === 'fighter' && card.strength">
      <img
        class="card-strength-image"
        :class="card.strengthImg"
        :src="`/images/abilities/${card.strengthImg}.png`"
        :alt="card.strengthImg"
      />
      <span :class="strengthClass">{{ card.strength }}</span>
    </div>
    <div class="card-health" v-if="card.type === 'fighter'">
      <img
        class="card-health-image"
        :class="card.healthImg"
        :src="`/images/abilities/${card.healthImg}.png`"
        :alt="card.healthImg"
      />
      <span :class="healthClass">{{ card.health }}</span>
    </div>
    <div class="text-box">
      <span class="card-name">{{ card.name }}</span>
      <span class="type-line">- {{ card.tribes.join(' ') }} {{ cardType }} -</span>
      <pre class="card-abilities" v-html="cardAbilities"></pre>
    </div>
    <img
      v-if="card.rarity === 'legendary'"
      class="card-banner"
      :alt="card.rarity"
      :src="`/images/cardcreator/rarity-banner/${card.rarity}.png`"
    />
    <div v-else class="card-banner-container" :class="card.rarity">
      <img
        class="card-banner-image"
        :alt="card.rarity"
        :src="`/images/cardcreator/rarity-banner/${card.rarity === 'token' ? 'common' : card.rarity}.png`"
      />
      <div class="card-rarity-text">
        {{ card.rarity }}
      </div>
    </div>
    <pre class="card-flavour">{{ card.flavour }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import sanitizeHtml from 'sanitize-html'
import { useCustomCardStore } from '@/store/cardcreator/customCard'

const card = useCustomCardStore()

const cardImageStyle = computed(() => ({
  width: `${card.imgWidth}px`,
  left: `${card.imgXOffset}px`,
  top: `${card.imgYOffset}px`,
}))
const costClass = computed(() => ({
  'double-digit': card.cost > 9 && card.cost < 100,
}))
const strengthClass = computed(() => ({
  'double-digit': card.strength > 9 && card.strength < 100,
}))
const healthClass = computed(() => ({
  'double-digit': card.health > 9 && card.health < 100,
}))

const cardType = computed(() => {
  if (card.type === 'fighter') {
    if (['guardian', 'kabloom', 'mega-grow', 'smarty', 'solar'].includes(card.className)) {
      return 'Plant'
    }
    return 'Zombie'
  } else if (card.type === 'trick') {
    return 'Trick'
  }
  return 'Environment'
})

const cardAbilities = computed(() => {
  const simpleTransformedAbilities = card.abilities
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{\{(.+?)\}\}/g, (item) => {
      const imageName = item.slice(2, -2).toLowerCase().trim()
      const abilityImages = [
        'anti-hero',
        'deadly',
        'doublestrike',
        'frenzy',
        'overshoot',
        'star',
        'strength',
        'strikethrough',
        'truestrike',
        'armored',
        'heart',
        'untrickable',
        'brain',
        'frozen',
        'heart',
        'strength',
        'sun',
        'bullseye',
      ]
      if (abilityImages.includes(imageName)) {
        return `<img src="/images/abilities/${imageName === 'bullseye' ? 'truestrike' : imageName}.png"/>`
      } else if (/^[0-9](sun|brain|health|strength)$/i.test(imageName)) {
        return `<img src="/images/stats/${imageName.replace(/\d/, '').toLowerCase()}/${imageName.match(/^\d/)}.png"/>`
      } else if (/^(\+|-)[1-9](health|strength)$/i.test(imageName)) {
        return `<img src="/images/stats/${imageName.replace(/(\+|-)\d/, '').toLowerCase()}/${imageName.includes('+') ? 'plus' : 'minus'}/${imageName.match(/\d/)}.png"/>`
      }
      return imageName
    })
    .replace(/\[\[(.+?)\]\]/g, (item) => {
      const linkText = item.slice(2, -2)
      return `<span class="underline">${linkText}</span>`
    })
    .replace(/\*\*(.+?)\*\*/g, (item) => {
      const boldText = item.slice(2, -2)
      return `<strong>${boldText}</strong>`
    })
  const sanitized = sanitizeHtml(simpleTransformedAbilities, {
    allowedTags: ['img', 'strong', 'span'],
    allowedAttributes: {
      span: [
        {
          name: 'class',
          values: ['underline'],
        },
      ],
      img: ['src'],
    },
    selfClosing: ['img'],
  })
  return sanitized
})
</script>

<style scoped>
@font-face {
  font-family: 'Cafeteria';
  src: url('/cafeteria.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'Cafeteria';
  src: url('/cafeteria-bold.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
}

.card-container {
  width: 300px;
  height: 400px;
  position: relative;
  font-family: 'Cafeteria', sans-serif;
  word-spacing: 0.5px;
  letter-spacing: 0.5px;
  color: white;
}

.card-cost {
  position: absolute;
  top: 88px;
  left: 188.5px;
  font-family: 'Cafeteria', sans-serif;
  color: black;
  font-weight: 700;
  font-size: 24px;
  width: 1ch;
  text-align: center;
}
.card-cost.double-digit {
  left: 183px;
  width: 2ch;
}

.card-image {
  position: absolute;
}
.card-strength {
  height: 22px;
  position: absolute;
  top: 147px;
  left: 123px;
  z-index: 2;
}
.card-strength-image {
  height: 29px;
}
.card-health {
  height: 22px;
  position: absolute;
  top: 147px;
  left: 149px;
}
.card-health-image {
  height: 28px;
}
:is(.card-health, .card-strength) > span {
  position: absolute;
  top: 0px;
  left: 10px;
  font-family: 'Cafeteria', sans-serif;
  font-weight: 700;
  font-size: 24px;
  width: 1ch;
  text-align: center;
  -webkit-text-stroke: 1px black;
  display: block;
  text-align: center;
}
:is(.card-health, .card-strength) > span.double-digit {
  margin-left: -2px;
}

.anti-hero {
  height: 30px;
  position: relative;
  top: -2px;
}
.deadly {
  height: 33px;
  position: relative;
  top: -3px;
  left: -2px;
}
.truestrike {
  position: relative;
  height: 36px;
  left: -5px;
  top: -4px;
}
.frenzy {
  position: relative;
  height: 36px;
  left: -5px;
  top: -5px;
}
.overshoot {
  position: relative;
  height: 38px;
  left: -11px;
  top: -5px;
}
.star {
  position: relative;
  height: 31px;
  left: -2px;
  top: -3px;
}
.doublestrike {
  position: relative;
  left: 5px;
}
.strikethrough {
  position: relative;
  height: 37px;
  width: auto;
  left: -5px;
  top: -5px;
}
.card-strength:has(.star) span {
  left: 8px;
}
.card-strength:has(.strikethrough) span {
  left: 9px;
}
.card-strength:has(.truestrike) span {
  left: 7px;
}
.card-strength:has(.frenzy) span {
  left: 8px;
}
.card-strength:has(.overshoot) span {
  left: 8px;
}
.armored {
  height: 36px;
  position: relative;
  top: -4px;
  left: -2px;
}
.untrickable {
  height: 36px;
  position: relative;
  top: -5px;
  left: -3px;
}
.strength-heart {
  height: 37px;
  position: relative;
  top: -6px;
  left: -7px;
}
.card-health:has(.star) span {
  left: 8px;
}
.card-health:has(.strength-heart) span {
  left: 8px;
  top: 1px;
}

.text-box {
  width: 200px;
  margin: 0 auto;
  text-align: center;
  padding-top: 180px;
}

.card-name {
  font-size: 20px;
  display: block;
}

.type-line {
  font-size: 12px;
  color: #9c9c9c;
}

.card-abilities {
  font-family: 'Cafeteria', sans-serif;
  font-size: 12px;
  margin: 2px auto 0 auto;
  width: 150px;
  text-wrap: wrap;
  white-space: pre-wrap;
}
:deep(.card-abilities) img {
  height: 1.2em;
  vertical-align: middle;
}
:deep(.underline) {
  color: #68e1fb;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.card-banner {
  width: 300px;
  position: absolute;
  top: 75px;
}
.card-banner-container {
  position: absolute;
  top: 308px;
  width: 300px;
}
.card-banner-image {
  width: 200px;
  position: absolute;
  top: -15px;
  left: 50px;
  z-index: -1;
}
.card-rarity-text {
  font-family: 'Cafeteria', sans-serif;
  font-size: 20px;
  text-align: center;
  width: 300px;
  -webkit-text-stroke: 0.7px black;
  text-transform: uppercase;
  font-weight: 700;
}
.event .card-banner-image {
  width: 250px;
  top: -30px;
  left: 25px;
}
:is(.common, .token) .card-banner-image {
  opacity: 0.95;
}
.uncommon .card-banner-image {
  top: -3px;
}
.rare .card-banner-image {
  top: -3px;
}
.rare .card-rarity-text {
  color: #fced8f;
}
.super-rare .card-banner-image {
  top: -11px;
}
.super-rare .card-rarity-text {
  color: #b2dcfc;
}

.card-flavour {
  font-family: 'Cafeteria', sans-serif;
  font-size: 14px;
  width: 170px;
  text-align: center;
  text-wrap: wrap;
  position: absolute;
  top: 350px;
  left: 65px;
  margin: 0 auto;
  transform: skew(-10deg);
  -webkit-transform: skew(-10deg);
  white-space: pre-wrap;
}

.card-background {
  width: 300px;
  position: absolute;
  z-index: -1;
}
.card-background.kabloom {
  left: -1px;
}
.card-background.hearty {
  top: 1px;
}
</style>

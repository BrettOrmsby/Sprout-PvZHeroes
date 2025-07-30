<template>
  <div
    class="small-card-container"
    :style="{
      'background-color': card.backgroundColour,
    }"
  >
    <img :class="['card-frame', card.type, card.rarity]" :src="frameSrc" alt="card frame" />
    <div class="card-cost" :class="{ 'is-zombie': !isPlant }">
      <img
        class="card-cost-image"
        :src="`/images/abilities/${isPlant ? 'sun' : 'brain'}.png`"
        :alt="isPlant ? 'sun' : 'brain'"
      />
      <span :class="{ 'double-digit': card.cost > 9 && card.cost < 100 }">{{ card.cost }}</span>
    </div>
    <div class="card-strength" v-if="card.type === 'fighter' && card.strength">
      <img
        class="card-strength-image"
        :class="card.strengthImg"
        :src="`/images/abilities/${card.strengthImg}.png`"
        :alt="card.strengthImg"
      />
      <span>{{ card.strength }}</span>
    </div>
    <div class="card-health" v-if="card.type === 'fighter'">
      <img
        class="card-health-image"
        :class="card.healthImg"
        :src="`/images/abilities/${card.healthImg}.png`"
        :alt="card.healthImg"
      />
      <span>{{ card.health }}</span>
    </div>
    <div
      class="inner-card"
      :class="[card.className, card.type, card.tribes.includes('Superpower') && frameOverwrite]"
    >
      <img
        class="card-image"
        alt="Card Image"
        :src="card.img"
        :style="{
          width: `${imageSettings.width}px`,
          left: `${imageSettings.left}px`,
          top: `${imageSettings.top}px`,
          rotate: `${imageSettings.rotate}deg`,
        }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { CustomCard } from './CustomCardRender.vue'

export type SmallImageSettings = { width: number; top: number; left: number; rotate: number }

const props = defineProps<{
  card: CustomCard<'fighter' | 'trick' | 'environment'>
  imageSettings: SmallImageSettings
  frameOverwrite: 'default' | 'super' | 'signature'
}>()
const isPlant = computed(() =>
  ['guardian', 'kabloom', 'mega-grow', 'smarty', 'solar'].includes(props.card.className),
)
const frameSrc = computed(() => {
  if (!props.card.tribes.includes('Superpower') || props.frameOverwrite === 'default') {
    return `/images/cardcreator/frames/${props.card.type}/${props.card.rarity === 'token' ? 'common' : props.card.rarity}.webp`
  } else if (props.frameOverwrite === 'super') {
    return `/images/cardcreator/frames/super/${isPlant.value ? 'plant' : 'zombie'}.webp`
  } else {
    return `/images/cardcreator/frames/super/${isPlant.value ? 'plant' : 'zombie'}-signature.webp`
  }
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

.small-card-container {
  position: relative;
  font-family: 'Cafeteria', sans-serif;
  word-spacing: 0.5px;
  letter-spacing: 0.5px;
  color: white;
  width: 150px;
  height: 122px;
}

.card-frame {
  width: 100px;
  position: absolute;
  left: 25px;
  top: 25px;
  z-index: 1;
}
.card-frame.fighter.legendary {
  top: -1px;
}
.card-frame.fighter.event {
  top: 19px;
}
.inner-card {
  position: relative;
  width: 94px;
  left: 28px;
  height: 68px;
  top: 27px;
  z-index: 0;
  overflow: hidden;
}
.inner-card.environment {
  clip-path: polygon(
    1.06% 70.88%,
    1.06% 27.35%,
    47.87% 2.94%,
    96.8% 25.88%,
    97.87% 70.88%,
    50% 97.06%
  );
}
.inner-card.trick,
.inner-card.super,
.inner-card.signature {
  clip-path: ellipse(47.87% 46.27% at 50% 50%);
}

.inner-card.guardian {
  background-color: #583923;
}
.inner-card.kablooom {
  background-color: #9e3631;
}
.inner-card.mega-grow {
  background-color: #4f9548;
}
.inner-card.smarty {
  background-color: #a3a2a4;
}
.inner-card.solar {
  background-color: #d4d648;
}
.inner-card.beastly {
  background-color: #4870a5;
}
.inner-card.brainy {
  background-color: #923a8e;
}
.inner-card.crazy {
  background-color: #6533c0;
}
.inner-card.hearty {
  background-color: #b88d36;
}
.inner-card.sneaky {
  background-color: #393838;
}
.card-cost {
  height: 31px;
  position: absolute;
  top: 21px;
  right: 22px;
  z-index: 10;
}
.card-cost.is-zombie {
  height: 27px;
  top: 23px;
  right: 20px;
}
.card-cost-image {
  height: 31px;
  top: 22px;
}
.card-cost.is-zombie .card-cost-image {
  height: 27px;
}
.card-cost > span {
  position: absolute;
  top: 3px;
  left: 9.5px;
  font-family: 'Cafeteria', sans-serif;
  font-weight: 700;
  font-size: 22px;
  width: 1ch;
  color: black;
  text-align: center;
  display: block;
  text-align: center;
}
.card-cost.is-zombie > span {
  left: 12px;
  top: 2px;
}

.card-cost > .double-digit {
  left: 5px;
  width: 2ch;
}

.card-image {
  position: absolute;
}
.card-strength {
  height: 27px;
  position: absolute;
  top: 68px;
  right: 50px;
  z-index: 3;
}
.card-strength-image {
  height: 27px;
}
.card-health {
  height: 27px;
  position: absolute;
  top: 68px;
  right: 23px;
  z-index: 2;
}
.card-health-image {
  height: 27px;
}
:is(.card-health, .card-strength) > span {
  position: absolute;
  top: 2px;
  left: 10px;
  font-family: 'Cafeteria', sans-serif;
  font-weight: 700;
  font-size: 20px;
  width: 1ch;
  text-align: center;
  -webkit-text-stroke: 1px black;
  display: block;
  text-align: center;
}

.anti-hero,
.frenzy,
.deadly,
.strikethrough {
  position: relative;
  left: -1px;
}
.truestrike {
  position: relative;
  height: 29px;
  top: -1px;
}
.overshoot {
  position: relative;
  height: 31px;
  top: -1px;
  left: 2px;
}
.doublestrike {
  height: 28px;
  position: relative;
  left: -4px;
}
.star {
  position: relative;
  left: -2px;
}
.card-strength .star {
  left: -1px;
}
.card-strength:has(.overshoot) span {
  left: 16px;
}
.card-strength:has(.doublestrike) span {
  left: 2px;
}
.card-strength:has(:is(.anti-hero, .frenzy, .strikethrough, .star)) span {
  left: 8px;
}

.card-strength:has(.deadly) span {
  left: 7.5px;
}
.armored {
  height: 29px;
  position: relative;
  top: -1px;
  left: -1px;
}
.untrickable {
  position: relative;
  left: -1px;
}
.strength-heart {
  height: 24px;
  position: relative;
  left: -3px;
}
.card-health:has(.star) span {
  left: 7px;
}
.card-health:has(.untrickable) span {
  left: 8px;
}
.card-health:has(.armored) span {
  left: 9px;
}
.card-health:has(.strength-heart) span {
  left: 6px;
  top: 2px;
}
</style>

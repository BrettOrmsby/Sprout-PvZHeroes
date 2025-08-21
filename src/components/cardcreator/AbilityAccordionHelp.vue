<template>
  <Accordion value="">
    <AccordionPanel value="0">
      <AccordionHeader>Bold Text</AccordionHeader>
      <AccordionContent>
        <p>
          Many cards will have a <code>When played:</code>, <code>When destroyed:</code>, or similar
          ability. The card previews on the PVZHeros app will display these in a bold font. To
          display a bold font for your custom cards, you can wrap the text in two asterisks. For
          example, <code>**This will be bold**, but this will be regular.</code>
        </p>
      </AccordionContent>
    </AccordionPanel>
    <AccordionPanel value="1">
      <AccordionHeader>Ability Links</AccordionHeader>
      <AccordionContent>
        <p>
          Some words or phrases on the PVZHeros app allow you to click them to show the full
          meaning. To get this effect on the custom cards, you can wrap the link in double square
          brackets. For example, <code>[[link]], [[Team-Up]], Not a link</code>.
        </p>
      </AccordionContent>
    </AccordionPanel>
    <AccordionPanel value="2">
      <AccordionHeader>Inline Images</AccordionHeader>
      <AccordionContent>
        <p>
          You have access to many images that can be added to your custom cards. To add an image,
          wrap the case-insensitive image name in double curly brakets. For example:
          <code>&lcub;&lcub;Bullseye&rcub;&rcub; or &lcub;&lcub;bullseye&rcub;&rcub;</code>. Here is
          a list of all the possible images you can use:
        </p>
        <ul class="ability-image-list">
          <li v-for="imgName of allAbilityImages" :key="imgName">
            <img :src="getAbilityImageSrc(imgName)" :alt="imgName" />{{ imgName }}
          </li>
        </ul>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>

<script lang="ts" setup>
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primevue'
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
  'sun',
  'bullseye',
  'strength-heart',
]
const allAbilityImages = [...abilityImages]
for (const stat of ['sun', 'brain', 'health', 'strength']) {
  for (let i = 0; i < 10; i++) {
    allAbilityImages.push(i + stat)
    if (i > 0) {
      allAbilityImages.push('+' + i + stat)
      allAbilityImages.push('-' + i + stat)
    }
  }
}
const getAbilityImageSrc = (imageName: string) => {
  if (abilityImages.includes(imageName)) {
    return `/images/abilities/${imageName === 'bullseye' ? 'truestrike' : imageName}.png`
  } else if (/^[0-9](sun|brain|health|strength)$/i.test(imageName)) {
    return `/images/stats/${imageName.replace(/\d/, '').toLowerCase()}/${imageName.match(/^\d/)}.png`
  } else if (/^(\+|-)[1-9](health|strength|sun|brain)$/i.test(imageName)) {
    return `/images/stats/${imageName.replace(/(\+|-)\d/, '').toLowerCase()}/${imageName.includes('+') ? 'plus' : 'minus'}/${imageName.match(/\d/)}.png`
  }
  return ''
}
</script>

<style scoped>
.p-accordion p {
  margin: 0;
}
.ability-image-list {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--block-space);
}
.ability-image-list li {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: light-dark(var(--p-surface-200), var(--p-surface-800));
  gap: var(--inline-space);
  width: 120px;
  height: 120px;
  padding: var(--inline-space);
  border-radius: var(--p-content-border-radius);
  text-align: center;
}
.ability-image-list img {
  height: 100%;
  margin-right: var(--inline-space);
  vertical-align: middle;
}
code {
  /* Style from primevue tag component */

  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: light-dark(
    var(--p-primary-100),
    color-mix(in srgb, var(--p-primary-500), transparent 84%)
  );
  color: light-dark(var(--p-primary-700), var(--p-primary-300));
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.1rem 0.5rem;
  border-radius: var(--p-content-border-radius);
}
</style>

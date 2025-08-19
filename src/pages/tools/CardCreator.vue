<template>
  <main>
    <div class="side-layout">
      <div style="width: 100%">
        <h1><PencilRuler />Card Creator</h1>
        <CustomCardForm />
      </div>
      <div class="card-render-container">
        <CustomCardRender />
      </div>
    </div>
    <Divider />
    <div class="side-layout">
      <SmallCardForm />
      <div class="card-render-container">
        <SmallCustomCardRender />
      </div>
    </div>
    <h2 id="ability-syntax">Ability Syntax</h2>
    <AbilityAccordionHelp />
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import { Divider } from 'primevue'
import { PencilRuler } from 'lucide-vue-next'
import TheFooter from '@/components/TheFooter.vue'
import CustomCardRender from '@/components/cardcreator/CustomCardRender.vue'
import AbilityAccordionHelp from '@/components/cardcreator/AbilityAccordionHelp.vue'
import SmallCustomCardRender from '@/components/cardcreator/SmallCustomCardRender.vue'
import CustomCardForm from '@/components/cardcreator/CustomCardForm.vue'
import SmallCardForm from '@/components/cardcreator/SmallCardForm.vue'
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
</style>

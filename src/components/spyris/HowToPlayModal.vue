<template>
  <Dialog
    :draggable="false"
    :modal="true"
    v-model:visible="spyris.isHowToPlayOpen"
    style="max-width: 500px; width: 100%; margin: var(--block-space)"
    header="How to Play Spyris"
  >
    <p style="margin-top: 0">
      If you've played Hangman, you already know the basics. Each day, a random card is chosen. Your
      goal is to guess its name in {{ spyris.MAX_GUESSES }} tries or fewer. On each guess, you can:
    </p>
    <ul>
      <li>Select a letter or number to reveal it in the card text.</li>
      <li>Select a symbol to reveal matching symbols in the ability.</li>
      <li>Try to guess the full card name.</li>
    </ul>
    <p>On your final guess, you must enter the full card name.</p>
    <p>The game ends when you:</p>
    <ul>
      <li>Reveal all the characters in the name.</li>
      <li>Correctly guess the full name.</li>
      <li>Run out of guesses.</li>
    </ul>
    <p>A new card is available every day.</p>
    <Button @click="() => (spyris.isHowToPlayOpen = false)" fluid>Close</Button>
    <h2>Additional Information</h2>
    <ul style="margin-bottom: 0">
      <li>Strength and health icons are shown for all cards (even Tricks and Environments).</li>
      <li>The class icon and border colour are blank. The cards can have any class.</li>
      <li>
        Some visual hints are hidden, including: card image, cost (Sun/Brains) images, and the
        rarity banner.
      </li>
    </ul>
  </Dialog>
</template>

<script lang="ts" setup>
import { Button, Dialog } from 'primevue'
import { useSpyrisStore } from '@/store/games/spyris'

const spyris = useSpyrisStore()
</script>

<style scoped></style>

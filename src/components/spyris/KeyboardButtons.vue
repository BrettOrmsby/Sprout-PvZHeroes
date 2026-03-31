<template>
  <div class="button-rows">
    <div v-for="(row, index) of keyboardButtons" :key="index" class="row">
      <template v-for="key of row" :key="key">
        <Button
          v-if="key"
          :severity="spyris.guesses.includes(key) ? 'primary' : 'secondary'"
          :label="key"
          @click="() => spyris.guess(key)"
          :disabled="spyris.guesses.includes(key) || spyris.guessesRemaining === 1"
        />
        <div v-else style="width: 100%">&nbsp;</div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSpyrisStore } from '@/store/games/spyris'
import { Button } from 'primevue'

const keyboardButtons = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ''],
  ['', '', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '', ''],
]

const spyris = useSpyrisStore()
</script>

<style scoped>
.button-rows {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: var(--inline-space);
  width: 100%;
}
.row {
  display: flex;
  align-items: center;
  justify-content: stretch;
  gap: var(--inline-space);
  width: 100%;
}
.p-button {
  font-size: min(4.5vw, 32px);
  padding: 0;
  width: 100%;
}
</style>

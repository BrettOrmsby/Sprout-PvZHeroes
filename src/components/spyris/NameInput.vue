<template>
  <InputOtp v-model="value" :length="length" :class="inputOptClasses">
    <template #default="{ attrs, events, index }">
      <template v-for="(char, i) of prefixes[index - 1].split('')" :key="i">
        <span v-if="char === ' '" class="spacer"></span>
        <span
          v-else
          class="p-inputotp-input p-inputtext p-component disabled p-inputtext-sm p-inputfield-sm"
          >{{ char }}</span
        >
      </template>
      <input
        type="text"
        class="p-inputtext p-component p-inputotp-input p-inputtext-sm p-inputfield-sm"
        v-bind="attrs"
        v-on="events"
        @keyup.enter="() => !isButtonAnimating && isGuessValid && guessCard()"
      />
      <template v-if="index === length">
        <template v-for="(char, i) of prefixes[index].split('')" :key="i">
          <span v-if="char === ' '" class="spacer"></span>
          <span
            v-else
            class="p-inputotp-input p-inputtext p-component disabled p-inputtext-sm p-inputfield-sm"
            >{{ char }}</span
          >
        </template>
      </template>
    </template>
  </InputOtp>
  <Button :disabled="!isGuessValid || isButtonAnimating" @click="guessCard">Guess</Button>
  <!-- For styling -->
  <InputText style="display: none" />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Button, InputOtp, InputText } from 'primevue'
import { useSpyrisStore } from '@/store/games/spyris'

const spyris = useSpyrisStore()
const mask = computed(() => {
  return spyris.cardRender.name.replace(/\u00A0/g, '').replace(/  /g, ' ')
})
const value = ref('')
const guess = computed(() => {
  let i = 0
  return mask.value.replace(/_/g, () => {
    return value.value[i++] ?? '_'
  })
})
const isGuessValid = computed(() => !guess.value.includes('_'))

const length = computed(() => mask.value.replace(/[^_]/g, '').length)
const prefixes = computed(() => mask.value.split('_'))

const inputOptClasses = ref('')
const isButtonAnimating = ref(false)
const guessCard = () => {
  spyris.guessAnswer(guess.value)
  isButtonAnimating.value = true
  inputOptClasses.value = 'horizontal-shaking'
  setTimeout(() => {
    inputOptClasses.value = ''
    isButtonAnimating.value = false
  }, 2000)
}
</script>

<style scoped>
.p-inputotp {
  flex-wrap: wrap;
  justify-content: center;
}
.disabled {
  opacity: 1;
  background: var(--p-inputtext-disabled-background);
  color: var(--p-inputtext-disabled-color);
}
.spacer {
  width: 100%;
}

.horizontal-shaking {
  animation: horizontal-shaking 0.35s ease 0s 1;
}

@keyframes horizontal-shaking {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(5px);
  }
  50% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>

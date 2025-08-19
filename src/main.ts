import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Tooltip from 'primevue/tooltip'
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'

/*
TODO:
- official decks
- add/remove from deck depending on owner and where it is. (`both` will do nothing) in compare
- bug: when adding a card if a new row is made, the screen scrolls down
*/

import './assets/main.css'
import './assets/form.css'
const pinia = createPinia()

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ToastService)
app.use(ConfirmationService)
app.directive('tooltip', Tooltip)

app.use(PrimeVue, {
  // Default theme configuration
  theme: {
    preset: definePreset(Aura, {
      semantic: {
        primary: {
          50: '{indigo.50}',
          100: '{indigo.100}',
          200: '{indigo.200}',
          300: '{indigo.300}',
          400: '{indigo.400}',
          500: '{indigo.500}',
          600: '{indigo.600}',
          700: '{indigo.700}',
          800: '{indigo.800}',
          900: '{indigo.900}',
          950: '{indigo.950}',
        },
      },
    }),
  },
})

app.mount('#app')

export default app

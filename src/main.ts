import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import Tooltip from "primevue/tooltip";
import Aura from "@primevue/themes/aura";
import { definePreset } from "@primevue/themes";

// http://127.0.0.1:5173/deck/b5e22c7a-647b-41aa-8ca4-401eeea25c4a
//https://pvzcc.fandom.com/wiki/Page_of_Resources
/*
TODO:
- draw sim // you can get a mulligan card back even if it was the one that was dished
- official decks
- explore decks/users
- user settings
- rather than check for 404s at the pages, it should check at router
- what happens when duplicate with a long name
- export/duplicate deck
- Keyboard shortcuts for adding/removing card from deck
- better main page
- linting duplicate keys error
- bug: when adding a card if a new row is made, the screen scrolls down
- SMTP Settings on supabase
*/

import "./assets/main.css";

const app = createApp(App);

app.use(router);
app.use(ToastService);
app.use(ConfirmationService);
app.directive("tooltip", Tooltip);

app.use(PrimeVue, {
  // Default theme configuration
  theme: {
    preset: definePreset(Aura, {
      semantic: {
        primary: {
          50: "{indigo.50}",
          100: "{indigo.100}",
          200: "{indigo.200}",
          300: "{indigo.300}",
          400: "{indigo.400}",
          500: "{indigo.500}",
          600: "{indigo.600}",
          700: "{indigo.700}",
          800: "{indigo.800}",
          900: "{indigo.900}",
          950: "{indigo.950}",
        },
      },
    }),
  },
});

app.mount("#app");

export default app;

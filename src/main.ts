import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";

// http://127.0.0.1:5173/deck/b5e22c7a-647b-41aa-8ca4-401eeea25c4a
//https://pvzcc.fandom.com/wiki/Page_of_Resources
/*
TODO:
- delete/ clear deck if deck is yours
- draw sim
- official decks
- user settings
- change tab colours?
- export/copy deck
- better main page
- add more and remove all
- bug: when adding a card if a new row is made, the screen scrolls down
*/

import "primevue/resources/themes/bootstrap4-dark-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "./assets/main.css";

const app = createApp(App);

app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.directive("tooltip", Tooltip);

app.mount("#app");

export default app;

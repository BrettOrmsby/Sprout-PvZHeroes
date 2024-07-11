<template>
  <header>
    <Menuebar :model="items">
      <template #item="{ item, props, hasSubmenu }">
        <router-link
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
          custom
        >
          <a :href="href" v-bind="props.action" @click="navigate">
            <Sprout v-if="item.label === 'Home'" />
            <span>{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span>{{ item.label }}</span>
          <ChevronDown v-if="hasSubmenu" />
        </a>
      </template>
    </Menuebar>
  </header>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import Menuebar from "primevue/menubar";
import { Sprout, ChevronDown } from "lucide-vue-next";
import useAuthUser from "@/composables/UseAuthUser";
const { isSignedIn } = useAuthUser();
const items = computed(() => {
  return [
    {
      label: "Home",
      route: "/",
    },

    {
      label: "Profile",
      visible: isSignedIn.value,
      items: [
        {
          label: "Your Decks",
          route: "/me",
        },
        {
          label: "Create a Deck",
          route: "/create",
        },
        {
          label: "Sign Out",
          route: "/sign-out",
        },
      ],
    },
    {
      label: "Sign In",
      route: "/sign-in",
      visible: !isSignedIn.value,
    },
    {
      label: "Register",
      route: "/register",
      visible: !isSignedIn.value,
    },
  ];
});
</script>

<style scoped>
.p-menubar {
  border-radius: 0;
  border-left: 0;
  border-right: 0;
  border-top: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1004;
}
</style>

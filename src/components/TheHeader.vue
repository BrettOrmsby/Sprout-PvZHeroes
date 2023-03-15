<script lang="ts">
export default {
  name: "TheHeader",
};
</script>

<template>
  <Menuebar :model="items" />
</template>

<script lang="ts" setup>
import { computed } from "vue";
import Menuebar from "primevue/menubar";
import useAuthUser from "@/composables/UseAuthUser";
const { isSignedIn } = useAuthUser();
const items = computed(() => {
  return [
    {
      label: "Home",
      to: "/",
    },

    {
      label: "Profile",
      visible: isSignedIn.value,
      items: [
        {
          label: "View Decks",
          to: "/me",
        },
        {
          label: "Create a Deck",
          to: "/create",
        },
        {
          label: "Sign Out",
          to: "/signout",
        },
      ],
    },
    {
      label: "Sign In",
      to: "/signin",
      visible: !isSignedIn.value,
    },
    {
      label: "Register",
      to: "/register",
      visible: !isSignedIn.value,
    },
  ];
});
</script>

<style scoped></style>

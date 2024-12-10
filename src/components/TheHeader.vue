<template>
  <header>
    <Menuebar :model="items" breakpoint="450px">
      <template #start>
        <div class="p-menubar-item logo-container">
          <div class="p-menubar-item-content">
            <RouterLink to="/" class="p-menubar-item-link">
              <Sprout />
              <span>Sprout</span>
            </RouterLink>
          </div>
        </div>
      </template>
      <template #item="{ item, props, hasSubmenu }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a :href="href" v-bind="props.action" @click="navigate">
            <UserSearch v-if="item.label === 'Users'" />
            <FileSearch v-else-if="item.label === 'Decks'" />
            <LayoutGrid v-else-if="item.label === 'Your Decks'" />
            <Plus v-else-if="item.label === 'Create Deck'" />
            <LogOut v-else-if="item.label === 'Sign Out'" />
            <span>{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <CircleUserRound v-if="item.label === 'Profile'" />
          <Search v-if="item.label === 'Search'" />
          <svg
            v-else-if="item.label === 'Sign In'"
            role="img"
            viewBox="0 0 24 24"
            style="fill: var(--p-menubar-item-color)"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Discord</title>
            <path
              d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
            />
          </svg>
          <span>{{ item.label }}</span>
          <ChevronDown v-if="hasSubmenu" />
        </a>
      </template>
    </Menuebar>
  </header>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Menuebar from 'primevue/menubar'
import {
  Sprout,
  ChevronDown,
  Search,
  CircleUserRound,
  UserSearch,
  FileSearch,
  Plus,
  LogOut,
  LayoutGrid,
} from 'lucide-vue-next'
import useAuthUser from '@/composables/UseAuthUser'
const { isSignedIn, signIn } = useAuthUser()
const items = computed(() => {
  return [
    {
      label: 'Search',
      items: [
        {
          label: 'Decks',
          route: '/search/decks',
        },
        {
          label: 'Users',
          route: '/search/users',
        },
      ],
    },
    {
      label: 'Profile',
      visible: isSignedIn.value,
      items: [
        {
          label: 'Your Decks',
          route: '/me',
        },
        {
          label: 'Create Deck',
          route: '/create',
        },
        {
          label: 'Sign Out',
          route: '/sign-out',
        },
      ],
    },
    {
      label: 'Sign In',
      command: signIn,
      visible: !isSignedIn.value,
    },
  ]
})
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

@media only screen and (max-width: 450px) {
  .p-menubar {
    justify-content: space-between;
  }
}
</style>

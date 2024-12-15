import { createRouter, createWebHistory } from 'vue-router'
import useAuthUser from '@/composables/UseAuthUser'
import useSupabase from '@/composables/UseSupabase'
import user from '@/store/user'
import deck, { compareDeck } from '@/store/deck'
import states from '@/store/states'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 70,
      }
    }
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  routes: [
    {
      name: 'Home',
      path: '/',
      component: () => import('@/pages/HomePage.vue'),
      meta: {
        title: 'Sprout',
      },
    },
    {
      name: 'Gallery',
      path: '/gallery',
      component: () => import('@/pages/GalleryPage.vue'),
      meta: {
        title: 'Gallery • Sprout',
      },
    },
    {
      name: 'Me',
      path: '/me',
      meta: {
        requiresAuth: true,
      },
      component: () => null,
      beforeEnter: async () => {
        const { supabase } = useSupabase()
        const { id } = useAuthUser()
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', id.value)
          .single()

        if (error) {
          return { name: '404' }
        }

        return { name: 'Profile', params: { username: data.username } }
      },
    },
    {
      name: 'Profile',
      path: '/profile/:username',
      props: true,
      component: () => import('@/pages/ProfilePage.vue'),
      beforeEnter: async (to) => {
        const { supabase } = useSupabase()
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', to.params.username)
          .single()

        if (error) {
          return { name: '404' }
        } else {
          Object.assign(user, data)
        }
        document.title = `${to.params.username} • Sprout`
      },
    },
    {
      name: 'CreateDeck',
      path: '/create',
      meta: {
        requiresAuth: true,
        title: 'Create Deck • Sprout',
      },
      component: () => import('@/pages/CreateDeck.vue'),
    },
    {
      name: 'ViewDeck',
      path: '/deck/:id',
      props: true,
      component: () => import('@/pages/ViewDeck.vue'),
      beforeEnter: async (to) => {
        const { supabase } = useSupabase()
        const { data, error } = await supabase
          .from('decks')
          .select()
          .eq('id', to.params.id)
          .single()

        if (error) {
          return { name: '404' }
        } else {
          Object.assign(deck, data)
        }

        const { data: creatorData, error: creatorError } = await supabase
          .from('profiles')
          .select('username, profile_image')
          .eq('id', data.creator)
          .single()
        if (creatorError) {
          return { name: '404' }
        } else {
          Object.assign(user, creatorData)
          document.title = `${data.name} • Sprout`
        }

        states.deckFilter.hideCards = false
        states.deckFilter.cardsMatchingFilter = []
      },
    },
    {
      name: 'Compare',
      path: '/deck/:id/compare/:to',
      props: true,
      component: () => import('@/pages/ComparePage.vue'),
      beforeEnter: async (to) => {
        const { supabase } = useSupabase()
        const { data, error } = await supabase
          .from('decks')
          .select()
          .eq('id', to.params.id)
          .single()

        if (error) {
          return { name: '404' }
        } else {
          Object.assign(deck, data)
        }

        const { data: compare, error: compareError } = await supabase
          .from('decks')
          .select()
          .eq('id', to.params.to)
          .single()

        if (compareError) {
          return { name: '404' }
        } else {
          Object.assign(compareDeck, compare)
        }
        document.title = `Compare ${data.name} to ${compare.name} • Sprout`
      },
    },
    {
      name: 'SearchUsers',
      path: '/search/users',
      component: () => import('@/pages/SearchUsersPage.vue'),
      meta: {
        title: 'Search Users • Sprout',
      },
    },
    {
      name: 'SearchDecks',
      path: '/search/decks',
      component: () => import('@/pages/SearchDecksPage.vue'),
      meta: {
        title: 'Search Decks • Sprout',
      },
    },
    {
      name: 'SignOut',
      path: '/sign-out',
      component: () => null,
      beforeEnter: async () => {
        const { signOut } = useAuthUser()
        await signOut()
        return { name: 'Home' }
      },
    },
    {
      name: 'HighlightHelp',
      path: '/highlight-help',
      component: () => import('@/pages/HighlightHelpPage.vue'),
      meta: {
        title: 'Highlight Help • Sprout',
      },
    },
    {
      name: '404',
      path: '/404',
      component: () => import('@/pages/404Page.vue'),
      meta: {
        title: '404 • Sprout',
      },
    },
    {
      name: 'NotFoundRedirect',
      path: '/:pathMatch(.*)*',
      redirect: { name: '404' },
    },
  ],
})

router.beforeEach((to, _, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

router.beforeEach((to) => {
  states.loadingRoute = true
  const { isSignedIn } = useAuthUser()
  // TODO: this does not wait for auth to be checked if starting on the page (like the create deck page) so it will navigate home instead
  if (!isSignedIn.value && to.meta.requiresAuth) {
    return { name: 'Home' }
  }
})
router.afterEach(() => (states.loadingRoute = false))

export default router

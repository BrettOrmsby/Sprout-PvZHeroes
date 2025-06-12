import { createRouter, createWebHistory } from 'vue-router'
import useAuthUser from '@/composables/UseAuthUser'
import useSupabase from '@/composables/UseSupabase'
import { useUserStore } from '@/store/user'
import { useCompareStore, useDeckStore } from '@/store/deck'
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
      component: () => import('@/pages/ProfilePage.vue'),
      beforeEnter: async (to) => {
        const user = useUserStore()
        const isLoadError = await user.loadFromUsername(to.params.username.toString())
        if (isLoadError) {
          return { name: '404' }
        }
        document.title = `${to.params.username} • Sprout`
      },
    },
    {
      name: 'Notifications',
      path: '/notifications',
      component: () => import('@/pages/NotificationPage.vue'),
      meta: {
        requiresAuth: true,
        title: 'Notifications • Sprout',
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
      component: () => import('@/pages/ViewDeck.vue'),
      beforeEnter: async (to) => {
        const deck = useDeckStore()
        const isLoadDeckError = await deck.loadId(to.params.id.toString())
        if (isLoadDeckError) {
          return { name: '404' }
        }

        const user = useUserStore()
        const isUserLoadError = await user.loadFromId(deck.creator)
        if (isUserLoadError) {
          return { name: '404' }
        }

        document.title = `${deck.name} • Sprout`
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
        const deck = useDeckStore()
        const compareDeck = useCompareStore()

        try {
          const [deckError, compareError] = await Promise.all([
            deck.loadId(to.params.id.toString()),
            compareDeck.loadId(to.params.to.toString()),
          ])
          if (deckError || compareError) {
            throw new Error()
          }

          document.title = `Compare ${deck.name} to ${compareDeck.name} • Sprout`
        } catch {
          return { name: '404' }
        }
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
      name: 'SearchCards',
      path: '/search/cards',
      component: () => import('@/pages/SearchCardsPage.vue'),
      meta: {
        title: 'Search Cards • Sprout',
      },
    },
    {
      name: 'SearchAdvanced',
      path: '/search/cards/advanced',
      component: () => import('@/pages/SearchAdvancedPage.vue'),
      meta: {
        title: 'Advanced Search • Sprout',
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
      name: 'QueryHelp',
      path: '/query-help',
      component: () => import('@/pages/HighlightHelpPage.vue'),
      meta: {
        title: 'Query Help • Sprout',
      },
    },
    {
      name: 'BlockMeter',
      path: '/tools/blockmeter',
      component: () => import('@/pages/tools/BlockMeterPage.vue'),
      meta: {
        title: 'Block Meter Probability • Sprout',
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

router.beforeEach(async (to) => {
  states.loadingRoute = true

  if (to.meta.requiresAuth) {
    const { isSignedIn, forceLoadUser } = useAuthUser()
    await forceLoadUser()
    if (!isSignedIn.value) {
      return { name: 'Home' }
    }
  }
})
router.afterEach(() => (states.loadingRoute = false))

export default router

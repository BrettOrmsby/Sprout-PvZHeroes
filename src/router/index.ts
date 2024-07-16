import { createRouter, createWebHistory } from "vue-router";
import useAuthUser from "@/composables/UseAuthUser";
import useSupabase from "@/composables/UseSupabase";
import user from "@/store/user";
import deck, { compareDeck } from "@/store/deck";
import states from "@/store/states";

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
  routes: [
    {
      name: "EmailConfirmation",
      path: "/email-confirmation",
      component: () => import("@/pages/auth/EmailConfirmation.vue"),
      meta: {
        title: "Confirm Email • Sprout",
      },
    },
    {
      name: "Home",
      path: "/",
      component: () => import("@/pages/HomePage.vue"),
      meta: {
        title: "Sprout",
      },
    },
    {
      name: "Me",
      path: "/me",
      meta: {
        requiresAuth: true,
      },
      component: () => null,
      beforeEnter: async () => {
        const { supabase } = useSupabase();
        const { id } = useAuthUser();
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", id.value)
          .single();

        if (error) {
          return { name: "404" };
        }

        return { name: "Profile", params: { username: data.username } };
      },
    },
    {
      name: "Profile",
      path: "/profile/:username",
      props: true,
      component: () => import("@/pages/ProfilePage.vue"),
      beforeEnter: async (to) => {
        const { supabase } = useSupabase();
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", to.params.username)
          .single();

        if (error) {
          return { name: "404" };
        } else {
          Object.assign(user, data);
        }
        document.title = `${to.params.username} • Sprout`;
      },
    },
    {
      name: "CreateDeck",
      path: "/create",
      meta: {
        requiresAuth: true,
        title: "Create Deck • Sprout",
      },
      component: () => import("@/pages/CreateDeck.vue"),
    },
    {
      name: "ViewDeck",
      path: "/deck/:id",
      props: true,
      component: () => import("@/pages/ViewDeck.vue"),
      beforeEnter: async (to) => {
        const { supabase } = useSupabase();
        const { data, error } = await supabase
          .from("decks")
          .select()
          .eq("id", to.params.id)
          .single();

        if (error) {
          return { name: "404" };
        } else {
          Object.assign(deck, data);
        }

        const { data: creatorData, error: creatorError } = await supabase
          .from("profiles")
          .select("username, profile_image")
          .eq("id", data.creator)
          .single();
        if (creatorError) {
          return { name: "404" };
        } else {
          Object.assign(user, creatorData);
          document.title = `${data.name} • Sprout`;
        }
      },
    },
    {
      name: "Compare",
      path: "/deck/:id/compare/:to",
      props: true,
      component: () => import("@/pages/ComparePage.vue"),
      beforeEnter: async (to) => {
        const { supabase } = useSupabase();
        const { data, error } = await supabase
          .from("decks")
          .select()
          .eq("id", to.params.id)
          .single();

        if (error) {
          return { name: "404" };
        } else {
          Object.assign(deck, data);
        }

        const { data: compare, error: compareError } = await supabase
          .from("decks")
          .select()
          .eq("id", to.params.to)
          .single();

        if (compareError) {
          return { name: "404" };
        } else {
          Object.assign(compareDeck, compare);
        }
        document.title = `Compare ${data.name} to ${compare.name} • Sprout`;
      },
    },
    {
      name: "SearchUsers",
      path: "/search/users",
      component: () => import("@/pages/SearchUsersPage.vue"),
      meta: {
        title: "Search Users • Sprout",
      },
    },
    {
      name: "SearchDecks",
      path: "/search/decks",
      component: () => import("@/pages/SearchDecksPage.vue"),
      meta: {
        title: "Search Decks • Sprout",
      },
    },
    {
      name: "SignIn",
      path: "/sign-in",
      component: () => import("@/pages/auth/SignInPage.vue"),
      meta: {
        title: "Sign In • Sprout",
      },
    },
    {
      name: "ForgotPassword",
      path: "/forgotPassword",
      component: () => import("@/pages/auth/ForgotPassword.vue"),
      meta: {
        title: "Forgot Password • Sprout",
      },
    },
    {
      name: "PasswordReset",
      path: "/password-reset",
      meta: {
        requiresAuth: true,
        title: "Password Reset • Sprout",
      },
      component: () => import("@/pages/auth/PasswordReset.vue"),
    },
    {
      name: "SignOut",
      path: "/sign-out",
      component: () => null,
      beforeEnter: async () => {
        const { signOut } = useAuthUser();
        await signOut();
        return { name: "Home" };
      },
    },
    {
      name: "Register",
      path: "/register",
      component: () => import("@/pages/auth/RegisterPage.vue"),
      meta: {
        title: "Register • Sprout",
      },
    },
    {
      name: "404",
      path: "/404",
      component: () => import("@/pages/404Page.vue"),
      meta: {
        title: "404 • Sprout",
      },
    },
    {
      name: "NotFoundRedirect",
      path: "/:pathMatch(.*)*",
      redirect: { name: "404" },
    },
  ],
});

router.beforeEach((to, _, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
  next();
});

router.beforeEach((to) => {
  states.loadingRoute = true;
  const { isSignedIn } = useAuthUser();
  if (
    !isSignedIn.value &&
    to.meta.requiresAuth &&
    !Object.keys(to.query).includes("fromEmail")
  ) {
    return { name: "SignIn" };
  }
});
router.afterEach(() => (states.loadingRoute = false));

export default router;

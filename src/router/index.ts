import { createRouter, createWebHistory } from "vue-router";
import useAuthUser from "@/composables/UseAuthUser";
import useSupabase from "@/composables/UseSupabase";
import throwError from "@/lib/thowError";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "EmailConfirmation",
      path: "/email-confirmation",
      component: () => import("@/pages/auth/EmailConfirmation.vue"),
    },
    {
      name: "Home",
      path: "/",
      component: () => import("@/pages/HomePage.vue"),
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
          console.log(data);
          throwError(error);
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
    },
    {
      name: "CreateDeck",
      path: "/create",
      meta: {
        requiresAuth: true,
      },
      component: () => import("@/pages/CreateDeck.vue"),
    },
    {
      name: "ViewDeck",
      path: "/deck/:id",
      props: true,
      component: () => import("@/pages/ViewDeck.vue"),
    },
    {
      name: "SignIn",
      path: "/sign-in",
      component: () => import("@/pages/auth/SignInPage.vue"),
    },
    {
      name: "ForgotPassword",
      path: "/forgotPassword",
      component: () => import("@/pages/auth/ForgotPassword.vue"),
    },
    {
      name: "PasswordReset",
      path: "/password-reset",
      meta: {
        requiresAuth: true,
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
    },
    {
      name: "404",
      path: "/404",
      component: () => import("@/pages/404Page.vue"),
    },
    {
      name: "NotFoundRedirect",
      path: "/:pathMatch(.*)*",
      redirect: { name: "404" },
    },
  ],
});

router.beforeEach((to) => {
  const { isSignedIn } = useAuthUser();
  if (
    !isSignedIn &&
    to.meta.requiresAuth &&
    !Object.keys(to.query).includes("fromEmail")
  ) {
    return { name: "SignIn" };
  }
});

export default router;

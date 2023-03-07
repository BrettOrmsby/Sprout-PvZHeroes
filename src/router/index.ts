import { createRouter, createWebHistory } from "vue-router";
import useAuthUser from "@/composables/UseAuthUser";
import HomePage from "@/pages/HomePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: "EmailConfirmation",
      path: "/email-confirmation",
      component: () => import("@/pages/auth/EmailConfirmation.vue"),
    },
    {
      name: "Home",
      path: "/",
      component: () => HomePage,
    },
    //TODO: profile page
    {
      name: "Me",
      path: "/me",
      component: () => import("@/pages/ProfilePage.vue"),
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
      path: "/signin",
      component: () => import("@/pages/auth/SignInPage.vue"),
    },
    {
      name: "ForgotPassword",
      path: "/forgotPassword",
      component: () => import("@/pages/auth/ForgotPassword.vue"),
    },
    {
      name: "PasswordReset",
      path: "/passwordreset",
      meta: {
        requiresAuth: true,
      },
      component: () => import("@/pages/auth/PasswordReset.vue"),
    },
    {
      name: "SignOut",
      path: "/signout",
      redirect: "/",
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

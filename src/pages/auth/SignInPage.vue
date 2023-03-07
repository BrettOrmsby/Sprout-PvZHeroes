<script lang="ts">
export default {
  name: "SignInPage",
};
</script>

<template>
  <div>
    <form @submit.prevent="handleSignIn()">
      <h1>Sign In</h1>
      <label>Email <input v-model="form.email" type="email" /></label>
      <label>Password <input v-model="form.password" type="password" /></label>
      <button type="submit">Sign In</button>
      <router-link
        :to="{ name: 'ForgotPassword', query: { email: form.email } }"
        >Forgot Password</router-link
      >
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import useAuthUser from "@/composables/UseAuthUser";
import { useRouter } from "vue-router";

const router = useRouter();
const { signIn } = useAuthUser();

const form = ref({
  email: "",
  password: "",
});

const handleSignIn = async () => {
  try {
    await signIn(form.value);
    router.push({ name: "Me" });
  } catch (error: any) {
    alert(error.message);
  }
};
</script>

<style scoped></style>

<script lang="ts">
export default {
  name: "SignInPage",
};
</script>

<template>
  <div class="container">
    <h1>Sign In</h1>
    <form @submit.prevent="handleSignIn()">
      <label for="email">Email</label>
      <InputText id="email" v-model="form.email" type="email" />
      <label for="password">Password</label>
      <Password
        id="password"
        v-model="form.password"
        :feedback="false"
        toggleMask
      />

      <Button label="Sign In" type="submit" :loading="loading" />

      <router-link
        :to="{ name: 'ForgotPassword', query: { email: form.email } }"
      >
        <Button label="Forgot Password" link />
      </router-link>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import useAuthUser from "@/composables/UseAuthUser";
import { useRouter } from "vue-router";
import throwError from "@/lib/throwError";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";

const router = useRouter();
const { signIn } = useAuthUser();

const form = ref({
  email: "",
  password: "",
});

const loading = ref(false);

const handleSignIn = async () => {
  loading.value = true;
  try {
    await signIn(form.value);
    router.push({ name: "Me" });
  } catch (error: any) {
    throwError(error);
  }
  loading.value = false;
};
</script>

<style scoped>
.container {
  padding: var(--content-padding);
  max-width: 500px;
  margin: 0 auto;
}

label {
  display: block;
  margin-bottom: var(--inline-spacing);
}
:deep() :is(.p-inputtext, .p-password) {
  display: block;
  margin-bottom: var(--inline-block-spacing);
  width: 100%;
}
:deep() .p-button-link:focus {
  outline: none;
  box-shadow: unset !important;
}
</style>

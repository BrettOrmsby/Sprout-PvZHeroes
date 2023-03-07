<script lang="ts">
export default {
  name: "ForgotPassword",
};
</script>

<template>
  <template v-if="!isEmailSent">
    <form @submit.prevent="handlePasswordReset()">
      <h1>Forgot Password?</h1>
      <label>Email <input v-model="email" type="email" /></label>
      <button>Send Reset Email</button>
    </form>
  </template>
  <h1 v-else>Email Sent</h1>
</template>

<script lang="ts" setup>
import useAuthUser from "@/composables/UseAuthUser";
import { useRoute } from "vue-router";
import { ref } from "vue";

const { sendPasswordRestEmail } = useAuthUser();
const { query } = useRoute();

const email = ref<string>((query.email as string) || "");
const isEmailSent = ref(false);

const handlePasswordReset = async () => {
  isEmailSent.value = true;
  await sendPasswordRestEmail(email.value);
};
</script>

<style scoped></style>

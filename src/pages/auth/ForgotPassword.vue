<template>
  <main>
    <form v-if="!isEmailSent" @submit.prevent="handleSubmit()">
      <h1>Forgot Password</h1>
      <label for="email">Email</label>
      <InputText id="email" v-model="email" type="email" />

      <Button label="Send Reset Email" type="submit" :loading="loading" />
    </form>
    <div v-else>
      <h1>Email Sent</h1>
      <p>Please view your email to continue the password change procedure.</p>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import useAuthUser from "@/composables/UseAuthUser";
import { useRoute } from "vue-router";
import throwError from "@/lib/throwError";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

const { sendPasswordRestEmail } = useAuthUser();
const { query } = useRoute();

const email = ref<string>((query.email as string) || "");
const isEmailSent = ref(false);
const loading = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  try {
    await sendPasswordRestEmail(email.value);
    isEmailSent.value = true;
  } catch (error: any) {
    throwError(error);
  }
  loading.value = false;
};
</script>

<style scoped>
main {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

label {
  display: block;
  margin-bottom: var(--inline-space);
}

.p-inputtext {
  display: block;
  margin-bottom: var(--block-space);
  width: 100%;
}
</style>

<script lang="ts">
export default {
  name: "ForgotPassword",
};
</script>

<template>
  <div class="container">
    <form v-if="!isEmailSent" @submit.prevent="handleSubmit()">
      <h1>Forgot Password</h1>
      <label for="email">Email</label>
      <InputText id="email" v-model="email" type="email" />

      <Button label="Send Reset Email" type="submit" :loading="loading" />
    </form>
    <h1 v-else>Email Sent</h1>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import useAuthUser from "@/composables/UseAuthUser";
import { useRoute } from "vue-router";
import throwError from "@/lib/thowError";
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
.container {
  padding: var(--content-padding);
  max-width: 500px;
  margin: 0 auto;
}

label {
  display: block;
  margin-bottom: var(--inline-spacing);
}
:deep() .p-inputtext {
  display: block;
  margin-bottom: var(--inline-block-spacing);
  width: 100%;
}
</style>

<template>
  <main>
    <form v-if="!isPasswordChanged" @submit.prevent="handleSubmit()">
      <h1>Change Password</h1>
      <label for="password">Password</label>
      <Password id="password" v-model="password" :feedback="true" toggleMask />

      <Button label="Change Password" type="submit" :loading="loading" />
    </form>
    <h1 v-else>Password Changed</h1>
  </main>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import useAuthUser from "@/composables/UseAuthUser";
import throwError from "@/lib/throwError";
import Password from "primevue/password";
import Button from "primevue/button";

const { update } = useAuthUser();

const password = ref("");
const isPasswordChanged = ref(false);
const loading = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  try {
    await update({ password: password.value });
    isPasswordChanged.value = true;
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
:deep() :is(.p-inputtext, .p-password) {
  display: block;
  margin-bottom: var(--block-space);
  width: 100%;
}
:deep() .p-button-link:focus {
  outline: none;
  box-shadow: unset !important;
}
</style>

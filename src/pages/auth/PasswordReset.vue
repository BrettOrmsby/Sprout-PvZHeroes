<script lang="ts">
export default {
  name: "PasswordReset",
};
</script>

<template>
  <template v-if="!isPasswordChanged">
    <form @submit.prevent="changePassword()">
      <h1>Change Password</h1>
      <label>Password <input v-model="password" type="password" /></label>
      <button type="submit">Change Password</button>
    </form>
  </template>
  <h1 v-else>Password Changed</h1>
</template>

<script lang="ts" setup>
import useAuthUser from "@/composables/UseAuthUser";
import { ref } from "vue";

const { update } = useAuthUser();

const password = ref("");
const isPasswordChanged = ref(false);

const changePassword = async () => {
  try {
    await update({ password: password.value });
    isPasswordChanged.value = true;
  } catch (error: any) {
    alert(error.message);
  }
};
</script>

<style scoped></style>

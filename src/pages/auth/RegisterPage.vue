<template>
  <main>
    <h1>Register</h1>
    <form @submit.prevent="handleSubmit()">
      <label for="username">Username</label>
      <InputText id="username" v-model="form.username" maxlength="30" />

      <label for="email">Email</label>
      <InputText id="email" v-model="form.email" type="email" />
      <label for="password">Password</label>
      <Password
        id="password"
        v-model="form.password"
        :feedback="true"
        toggleMask
      />

      <Button label="Register" type="submit" :loading="loading" />
    </form>
  </main>
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
const { register } = useAuthUser();

const form = ref({
  username: "",
  email: "",
  password: "",
});

const loading = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  try {
    await register(form.value);

    router.push({
      name: "EmailConfirmation",
      query: { email: form.value.email },
    });
  } catch (error: any) {
    if (
      error.message ===
      'duplicate key value violates unique constraint "profiles_username_key"'
    ) {
      throwError({
        message: "Username Not Unique",
        hint: "Username must be unique ",
        details: "",
        code: "",
      });
    } else {
      throwError(error);
    }
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

:deep(:is(.p-inputtext, .p-password)) {
  display: block;
  margin-bottom: var(--block-space);
  width: 100%;
}
</style>

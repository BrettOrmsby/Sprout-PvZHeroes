<script lang="ts">
export default {
  name: "RegisterPage",
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <h1>Register</h1>
    <label>Username <input v-model="form.username" type="text" /></label>
    <label>Email <input v-model="form.email" type="email" /></label>
    <label>Password <input v-model="form.password" type="password" /></label>
    <button>Register</button>
  </form>
</template>

<script lang="ts" setup>
//TODO: name cannot be me
import { ref } from "vue";
import useAuthUser from "@/composables/UseAuthUser";
import { useRouter } from "vue-router";

const router = useRouter();
const { register } = useAuthUser();

const form = ref({
  username: "",
  email: "",
  password: "",
});

const handleSubmit = async () => {
  try {
    await register(form.value);

    router.push({
      name: "EmailConfirmation",
      query: { email: form.value.email },
    });
  } catch (error: any) {
    alert(error.message);
  }
};
</script>

<style scoped></style>

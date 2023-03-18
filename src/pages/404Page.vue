<script lang="ts">
export default {
  name: "404Page",
};
</script>

<template>
  <div class="container">
    <h1>404</h1>
    <p>Page not found</p>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.container {
  padding: var(--content-padding);
}
h1 {
  font-size: 3em;
  text-align: center;
  margin-bottom: 0;
}
p {
  text-align: center;
  color: var(--text-color-secondary);
  width: 100%;
  max-width: none;
}
</style>

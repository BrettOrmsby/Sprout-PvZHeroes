<template>
  <main>
    <h1>404</h1>
    <img :src="janitor.image" :alt="janitor.name" />
    <p>Sorry, but the Janitor forgot to create this page.</p>

    <RouterLink to="/">
      <Button text> Home </Button>
    </RouterLink>
  </main>
</template>

<script lang="ts" setup>
import { Button } from 'primevue'
import getCard from '@/lib/getCard'

const janitor = getCard('Celestial Custodian')
</script>

<style scoped>
main {
  text-align: center;
}
h1 {
  font-size: 3em;
}
img {
  width: 30%;
}
p {
  text-align: center;
  width: 100%;
  max-width: none;
  color: var(--p-text-muted-color);
}

.p-button {
  font-weight: 600;
}
</style>

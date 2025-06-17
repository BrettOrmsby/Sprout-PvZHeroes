<template>
  <div class="card-container">
    <slot />
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: var(--block-space);
  justify-content: flex-start;
}
.card-container:has(.text-view) {
  gap: 0px;
  flex-direction: column;
}
</style>

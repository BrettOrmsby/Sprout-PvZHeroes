<template>
  <main>
    <h1><Bell />Notifications</h1>
    <div class="notification-container">
      <template v-if="notifications.isLoading">
        <Skeleton v-for="index in 3" :key="index" class="notification-skeleton"></Skeleton>
      </template>
      <Message v-else-if="notifications.isLoadError" severity="error">
        Failed to load notifications.
      </Message>
      <Message v-else-if="notifications.notifications.length < 1" severity="warn"
        >No Notifications Found</Message
      >
      <template v-else>
        <Card
          class="notification"
          v-for="notification in notifications.notifications"
          :key="notification.id"
          :class="{ unread: !notification.is_read }"
          @click="notifications.markRead(notification.id)"
        >
          <template #content>
            <Heart v-if="notification.type === 'heart'" class="icon" />
            <p v-if="notification.type === 'heart'">
              <RouterLink
                :to="{ name: 'Profile', params: { username: notification.actor_name } }"
                >{{ notification.actor_name }}</RouterLink
              >
              liked your deck
              <RouterLink :to="{ name: 'ViewDeck', params: { id: notification.deck_id } }">{{
                notification.deck_name
              }}</RouterLink
              >!
            </p></template
          >
        </Card>
      </template>
    </div>
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { Card, Message, Skeleton } from 'primevue'
import { Bell, Heart } from 'lucide-vue-next'
import { useNotificationsStore } from '@/store/notifications'
import TheFooter from '@/components/TheFooter.vue'

const notifications = useNotificationsStore()

onMounted(notifications.load)
</script>

<style scoped>
main {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--inline-space);
}

h1 svg {
  width: 1em;
  height: 1em;
  color: var(--p-primary-400);
  flex-shrink: 0;
}

h1 {
  text-align: center;
}

a {
  color: var(--p-primary-color);
  transition: var(--p-transition-duration);
  text-decoration: none;
}
a:hover {
  color: var(--p-primary-hover-color);
}

.notification-container {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: var(--block-space);
}

.notification {
  border: 1px solid var(--p-content-border-color);
  transition: var(--p-transition-duration);
}
.notification :deep(.p-card-content) {
  display: flex;
  gap: var(--inline-space);
  align-items: center;
  justify-content: flex-start;
}

:deep(.icon) {
  width: 3em;
  height: 3em;
  color: var(--p-primary-400);
  fill: currentColor;
  flex-shrink: 0;
}

.notification.unread {
  border-color: light-dark(var(--p-primary-300), var(--p-primary-700));
  background-color: light-dark(var(--p-primary-50), var(--p-primary-950));
  cursor: pointer;
}

.notification-skeleton {
  height: 120px !important;
  border-radius: var(--p-border-radius-xl);
}
</style>

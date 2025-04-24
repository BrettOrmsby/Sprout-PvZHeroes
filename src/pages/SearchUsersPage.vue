<template>
  <main>
    <h1>Search <span class="primary-color">Users</span></h1>
    <InputGroup>
      <InputText type="text" v-model="searchTerm" @keydown.enter="updateQuery" />
      <Button @click="updateQuery">
        <template #icon="iconClass">
          <Search :class="iconClass.class" />
        </template>
      </Button>
    </InputGroup>

    <h2>Results</h2>
    <div v-if="isSearching" class="users-container">
      <Skeleton v-for="i in paginatorAmount" :key="i" height="100px" style="max-width: 400px" />
    </div>
    <Message v-else-if="isSearchError" severity="error"> Failed to load users. </Message>
    <Message v-else-if="results.length < 1" severity="warn"> No Users Found </Message>
    <div v-else>
      <div class="users-container">
        <RouterLink
          v-for="user of results"
          :key="user.username"
          :to="{ name: 'Profile', params: { username: user.username } }"
        >
          <Card>
            <template #title>
              <div class="title-container">
                <Avatar
                  size="normal"
                  shape="circle"
                  class="hero"
                  :image="getHero(user.profile_image).image"
                >
                </Avatar>
                <h3>{{ user.username }}</h3>
              </div>
            </template>
            <template #content>
              <p class="joined">
                Joined
                {{ joined(user) }}
              </p>
            </template>
          </Card>
        </RouterLink>
      </div>
      <Paginator
        :first="firstValue"
        @page="paginate"
        :rows="paginatorAmount"
        :totalRecords="totalRecords"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      />
    </div>
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Avatar,
  Button,
  Card,
  InputGroup,
  InputText,
  Message,
  Paginator,
  Skeleton,
  type PageState,
} from 'primevue'
import { Search } from 'lucide-vue-next'
import TheFooter from '@/components/TheFooter.vue'
import useSupabase from '@/composables/UseSupabase'
import getHero from '@/lib/getHero'
import throwError from '@/lib/throwError'
import type { User } from '@/lib/types'

const route = useRoute()
const router = useRouter()
const { supabase } = useSupabase()

const joined = (user: User) =>
  new Date(user.created_at).toLocaleDateString('en', { month: 'long', year: 'numeric' })

const searchTerm = ref((route.query.username || '').toString())
const updateQuery = () =>
  router.push({ name: 'SearchUsers', query: { username: searchTerm.value } })

const paginatorAmount = 20
const isSearching = ref(true)
const isSearchError = ref(false)
const results = ref<User[]>([])
const totalRecords = ref(0)
const firstValue = computed(
  () => ((parseInt(route.query.page as string) || 1) - 1) * paginatorAmount,
)

const paginate = (pageState: PageState) =>
  router.push({
    name: 'SearchUsers',
    query: { username: searchTerm.value, page: pageState.page + 1 },
  })

const search = async () => {
  isSearching.value = true
  isSearchError.value = false

  const { data, error, count } = await supabase
    .from('profiles')
    .select('username, profile_image, created_at', { count: 'exact' })
    .ilike('username', `%${(route.query.username || '').toString().replace(/ /g, '%')}%`)
    .order('username')
    .range(firstValue.value, firstValue.value + paginatorAmount - 1)
    .overrideTypes<User[]>()

  if (error) {
    throwError(error)
    isSearching.value = false
    isSearchError.value = true
    return
  }

  results.value = data
  totalRecords.value = count as number
  isSearching.value = false
}

watch(() => route.query, search)
onMounted(search)
</script>

<style scoped>
main {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
.primary-color {
  color: var(--p-primary-400);
}

h1,
h2 {
  text-align: center;
}

.p-inputgroup {
  max-width: 500px;
  margin: 0 auto;
}

.users-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--inline-space);
  justify-content: center;
  align-items: stretch;
}

a {
  flex-grow: 1;
  max-width: 400px;
}
.p-card {
  width: 100%;
  height: 100%;
  border: 1px solid var(--p-content-border-color);
  transition-duration: var(--p-transition-duration);
}

.p-card:hover {
  border: 1px solid var(--p-primary-400);
}

.title-container {
  display: flex;
  align-items: center;
}
.p-avatar {
  margin-right: var(--inline-space);
  flex-shrink: 0;
  background-color: var(--p-surface-950);
}
h3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

h3 {
  margin: 0;
}

.joined {
  color: var(--p-text-muted-color);
  margin: 0;
  font-size: 0.8em;
}

.p-message {
  margin: 0 auto;
  width: fit-content;
}

:deep(.p-paginator) {
  margin-top: var(--block-space);
}
</style>

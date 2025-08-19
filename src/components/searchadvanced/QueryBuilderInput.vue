<template>
  <div>
    <label class="title"><slot name="icon" />{{ name }}</label>
    <div class="input-container">
      <InputGroup v-for="(value, index) of values" class="main-inputgroup" :key="index">
        <Select
          class="options"
          v-if="modifiers.length"
          :options="modifiers"
          option-label="label"
          option-value="value"
          v-model="value.query"
          :aria-labelledby="generateID('select', name, index)"
        />
        <span class="sr-only" :id="generateID('select', name, index)">{{ name }}</span>
        <InputGroup class="inner-inputgroup">
          <span v-if="options" class="sr-only" :id="generateID('input', name, index)">{{
            name
          }}</span>
          <label v-else class="sr-only" :for="generateID('input', name, index)">{{ name }}</label>
          <Select
            v-if="options"
            v-model="value.value"
            :options="options"
            option-label="label"
            option-value="value"
            :placeholder="placeholder"
            :aria-labelledby="generateID('input', name, index)"
            :filter="options.length > 5"
          />
          <InputText
            v-else-if="!isNumber"
            v-model="value.value as string"
            :placeholder="placeholder"
            type="text"
            :id="generateID('input', name, index)"
          />
          <InputNumber
            v-else
            v-model="value.value as number"
            :placeholder="placeholder"
            :id="generateID('input', name, index)"
            :useGrouping="false"
            locale="en-US"
          />
          <InputGroupAddon v-if="values.length > 1">
            <Button
              :aria-label="`Remove ${name}`"
              @click="removeSection(index)"
              severity="secondary"
            >
              <template #icon="icon"><Minus :class="icon.class" /></template>
            </Button>
          </InputGroupAddon>
          <InputGroupAddon>
            <Button :aria-label="`Add a ${name}`" @click="addSection" severity="secondary">
              <template #icon="icon"><Plus :class="icon.class" /></template>
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </InputGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button, InputGroupAddon, InputGroup, InputText, InputNumber, Select } from 'primevue'
import { Minus, Plus } from 'lucide-vue-next'
const props = defineProps<{
  name: string
  modifiers: { value: string; label: string }[]
  placeholder: string
  isNumber: boolean
  options?: { value: string; label: string }[]
}>()

const values = defineModel<{ query: string; value: string | number | null }[]>({ required: true })

const addSection = () => {
  values.value.push({ value: null, query: props.modifiers[0]?.value ?? 'include:' })
}
const removeSection = (index: number) => {
  values.value.splice(index, 1)
}

const generateID = (kind: string, queryName: string, index: number) =>
  `${kind}${queryName.replace(/ /g, '-')}${index}`
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
.title {
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: var(--inline-space);
}
.title :deep(svg) {
  width: 1.2rem;
  height: 1.2rem;
  color: var(--p-primary-400);
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: var(--inline-space);
  margin-top: var(--inline-space);
  margin-bottom: var(--block-space);
}

.p-inputtext,
.p-inputnumber,
.p-select {
  min-width: 200px;
}
.options {
  min-width: 300px;
}

.inner-inputgroup input {
  border-start-start-radius: 0px !important;
  border-end-start-radius: 0px !important;
}
:deep(.p-inputgroup:has(#inputInclude0) .p-select) {
  border-radius: var(--p-inputgroup-addon-border-radius) 0 0 var(--p-inputgroup-addon-border-radius) !important;
}
@media screen and (max-width: 700px) {
  .main-inputgroup {
    flex-direction: column;
  }
  .inner-inputgroup :is(input, .p-select, .p-inputnumber) {
    border-end-start-radius: var(--p-inputgroup-addon-border-radius) !important;
  }

  .inner-inputgroup :last-child {
    border-start-end-radius: 0px !important;
  }
  .options {
    width: 100% !important;
    min-width: 240px;
    border-end-start-radius: 0px !important;
    border-start-end-radius: var(--p-inputgroup-addon-border-radius) !important;
  }
}
</style>

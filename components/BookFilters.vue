<script setup lang="ts">
import { ref } from 'vue';

const q = ref('');
const emit = defineEmits(['update:q', 'addBook']);
</script>

<template>
  <div class="flex items-center justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
    <div class="flex-grow">
      <UInput v-model="q" placeholder="Filter books..." @input="$emit('update:q', q)" />
    </div>
    <div>
      <UButton color="white" variant="solid" @click="$emit('addBook')">Add new book</UButton>
    </div>
  </div>
</template>

<style scoped>
/* Add any necessary styles */
</style>

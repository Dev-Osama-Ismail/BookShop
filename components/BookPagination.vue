<script setup lang="ts">
const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true, // Ensure total is passed
  },
});

const emit = defineEmits(['update:page']);
</script>

<template>
  <!-- Replace v-model with model-value binding -->
  <UPagination
    :model-value="page"
    @update:model-value="$emit('update:page', $event)"
    :page-count="totalPages"
    :total="total"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface EditedRow {
  title?: string;
  author?: string;
  genre?: string;
  year?: number;
  coverImage?: string | null;
}

const props = defineProps<{
  isOpen: boolean;
  editedRow: EditedRow | null;
}>();

const emit = defineEmits(['update:isOpen', 'update:editedRow', 'submit']);

const coverImagePreview = ref<string | null>(null);

const handleCoverImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        coverImagePreview.value = result;
        emit('update:editedRow', { ...(props.editedRow ?? {}), coverImage: result });
      }
    };
    reader.readAsDataURL(file);
  }
};
</script>

<template>
  <!-- Use v-bind and v-on for props and their events -->
  <UModal :model-value="isOpen" @update:model-value="$emit('update:isOpen', $event)">
    <div class="p-4">
      <form @submit.prevent="$emit('submit', editedRow)">
        <div class="mb-4">
          <label>Title</label>
          <UInput
            :value="editedRow?.title"
            @input="$emit('update:editedRow', { ...editedRow, title: $event })"
            placeholder="Title"
            required
            maxlength="20"
          />
        </div>
        <div class="mb-4">
          <label>Author</label>
          <UInput
            :value="editedRow?.author"
            @input="$emit('update:editedRow', { ...editedRow, author: $event })"
            placeholder="Author"
            required
          />
        </div>
        <div class="mb-4">
          <label>Genre</label>
          <USelect
            :value="editedRow?.genre"
            @change="$emit('update:editedRow', { ...editedRow, genre: $event })"
            :options="['Fiction', 'Non-Fiction']"
            required
          />
        </div>
        <div class="mb-4">
          <label>Year</label>
          <UInput
            type="number"
            :value="editedRow?.year"
            @input="$emit('update:editedRow', { ...editedRow, year: Number($event) })"
            placeholder="Year"
            required
          />
        </div>
        <div class="mb-4">
          <label>Image</label>
          <input type="file" @change="handleCoverImageChange" />
          <img
            :src="coverImagePreview || (editedRow?.coverImage ?? undefined)"
            alt="Preview"
            class="h-16 w-16"
          />
        </div>
        <div class="flex justify-end">
          <UButton @click="$emit('update:isOpen', false)">Cancel</UButton>
          <UButton type="submit" color="blue">Save</UButton>
        </div>
      </form>
    </div>
  </UModal>
</template>

<style scoped>
/* Add modal styles */
</style>

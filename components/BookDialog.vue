<script setup lang="ts">
import { ref, watch } from 'vue';

interface EditedRow {
  id?: number;
  title?: string;
  author?: string;
  genre?: string;
  year?: number;
  coverImage?: string | null;
  isFavorite?: boolean;
}

const props = defineProps<{
  isOpen: boolean;
  editedRow: EditedRow | null;
}>();

const emit = defineEmits(['update:isOpen', 'update:editedRow', 'submitEdit', 'submitAdd']);

const localEditedRow = ref<EditedRow>({});
const coverImagePreview = ref<string | null>(null);

// Watch for changes in the editedRow prop to keep localEditedRow in sync
watch(
  () => props.editedRow,
  (newRow) => {
    if (newRow) {
      localEditedRow.value = { ...newRow };
      coverImagePreview.value = newRow.coverImage ?? null;
    } else {
      localEditedRow.value = {};
      coverImagePreview.value = null;
    }
  },
  { immediate: true }
);

// Handle file input with size check
const handleCoverImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    const maxSizeInBytes = 1  * 1024; // 1 MB

    if (file.size > maxSizeInBytes) {
      alert('The image size should be less than 1 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        coverImagePreview.value = result;
        localEditedRow.value.coverImage = result;
      }
    };
    reader.readAsDataURL(file);
  }
};

const closeDialog = () => {
  emit('update:isOpen', false);
};

const submitForm = () => {
  if (localEditedRow.value.id) {
    emit('submitEdit', { ...localEditedRow.value }); // Emit event for edit
  } else {
    emit('submitAdd', { ...localEditedRow.value }); // Emit event for add
  }
  closeDialog();
};
</script>
<template>
  <UModal :model-value="isOpen" @update:model-value="$emit('update:isOpen', $event)">
    <div class="p-4">
      <h3 class="text-lg font-semibold mb-4">
        {{ localEditedRow.id ? 'Edit Book' : 'Add New Book' }}
      </h3>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium">Title</label>
          <UInput
            id="title"
            v-model="localEditedRow.title"
            placeholder="Title"
            required
            maxlength="20"
          />
        </div>
        <div class="mb-4">
          <label for="author" class="block text-sm font-medium">Author</label>
          <UInput
            id="author"
            v-model="localEditedRow.author"
            placeholder="Author"
            required
          />
        </div>
        <div class="mb-4">
          <label for="genre" class="block text-sm font-medium">Genre</label>
          <USelect
            id="genre"
            v-model="localEditedRow.genre"
            :options="['Male', 'Female']"
            required
          />
        </div>
        <div class="mb-4">
          <label for="year" class="block text-sm font-medium">Year</label>
          <UInput
            id="year"
            type="number"
            v-model="localEditedRow.year"
            placeholder="Year"
            required
          />
        </div>
        <div class="mb-4">
          <label for="isFavorite" class="block text-sm font-medium">Favorite</label>
          <UCheckbox
            id="isFavorite"
            v-model="localEditedRow.isFavorite"
            label="Mark as Favorite"
          />
        </div>
        <div class="mb-4">
          <label for="coverImage" class="block text-sm font-medium">Cover Image</label>
          <input id="coverImage" type="file" @change="handleCoverImageChange" />
          <div class="mt-2">
            <img
              :src="coverImagePreview || localEditedRow.coverImage"
              alt="Preview"
              class="h-16 w-16 object-cover rounded"
            />
          </div>
        </div>
        <div class="flex justify-end">
          <UButton @click="closeDialog" type="button">Cancel</UButton>
          <UButton type="submit" color="blue">Save</UButton>
        </div>
      </form>
    </div>
  </UModal>
</template>


<style scoped>
.h-16 {
  height: 4rem;
}
.w-16 {
  width: 4rem;
}
.object-cover {
  object-fit: cover;
}
.rounded {
  border-radius: 0.375rem;
}
</style>

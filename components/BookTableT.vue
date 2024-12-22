<script setup lang="ts">
import { useBooksStore } from '@/stores/books';
import { ref, computed, onMounted, watch } from 'vue';
import 'primeicons/primeicons.css'

const booksStore = useBooksStore();

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'title', label: 'Title', sortable: true },
  { key: 'author', label: 'Author', sortable: true },
  { key: 'genre', label: 'Genre', sortable: true },
  { key: 'year', label: 'Year', sortable: true },
  { key: 'isFavorite', label: 'Favorite', sortable: true },
  { key: 'image', label: 'Cover Image' }, 
];

const q = ref('');
const pageSize = ref(10);
const page = ref(1);
const sortKey = ref<string | undefined>(undefined);
const sortDirection = ref<'asc' | 'desc'>('asc');

const totalPages = computed(() => booksStore.totalPages);
const totalBooks = computed(() => booksStore.totalBooks);

const allCachedRows = computed(() => booksStore.getAllCachedPages());

const filteredRows = computed(() => {
  if (!q.value.trim()) return allCachedRows.value;
  return allCachedRows.value.filter((book) =>
    book.title.toLowerCase().includes(q.value.toLowerCase())
  );
});

const sortedRows = computed(() => {
  if (!sortKey.value) return filteredRows.value;
  return [...filteredRows.value].sort((a, b) => {
    const valueA = a[sortKey.value!];
    const valueB = b[sortKey.value!];
    return sortDirection.value === 'asc'
      ? valueA < valueB
        ? -1
        : 1
      : valueA > valueB
      ? -1
      : 1;
  });
});
const paginatedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return sortedRows.value.slice(start, end);
});

const toggleFavorite = (bookId: number) => {
  booksStore.toggleFavorite(bookId);
};
watch(page, async (newPage) => {
  if (!booksStore.pages[newPage]) {
    await booksStore.fetchBooks(newPage, pageSize.value);
  }
});

watch(q, () => {
  page.value = 1;
});
const isEditDialogOpen = ref(false);
const editedRow = ref<any | null>(null);
    const coverImagePreview = ref<string | null>(null);
const coverImageFile = ref<File | null>(null);

const openEditDialog = (row: any) => {
  if (!row) return;
  editedRow.value = { ...row }; 
  isEditDialogOpen.value = true;
  
};

const isOpen = ref(false)
const genre = ['Male', 'Female']

const submitEdit = async () => {
  if (!editedRow.value) return;

  await booksStore.updateBook(editedRow.value.id, editedRow.value); 
  isEditDialogOpen.value = false; // Close the dialog
};
const deleteRow = async (row:any) => { 
    let text = "Do you want to delete "+row.title+ " book";
  if (confirm(text) == true) {
    if (!row || !row.id) return;

try {
  console.log(row)
  await booksStore.deleteMyBook(row.id);
  alert('Book deleted successfully!');
  await booksStore.fetchBooks(page.value, pageSize.value); 
} catch (error) {
  console.error('Error deleting book:', error);
  alert('Failed to delete the book.');
}  } else {
}    
};


const toggleSort = (key: string): void => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'asc';
  }
};
const openAddBookDialog = () => {
  editedRow.value = {
    title: '',
    author: '',
    genre: '',
    year: null,
    coverImage: '',
    isFavorite: false,
  };
  coverImagePreview.value = null; 
  isOpen.value = true; 
};

const validateForm = () => {
  if (!editedRow.value.title || editedRow.value.title.length > 20) {
    alert('Title is required and must be 20 characters or less.');
    return false;
  }
  if (!editedRow.value.author) {
    alert('Author is required.');
    return false;
  }
  if (!editedRow.value.genre) {
    alert('Genre is required.');
    return false;
  }
  if (!editedRow.value.year || isNaN(Number(editedRow.value.year))) {
    alert('A valid year is required.');
    return false;
  }

  return true;
};

const submitAddBook = async () => {
  if (!validateForm()) return;

  try {
    const newBook = {
      title: editedRow.value.title,
      author: editedRow.value.author,
      genre: editedRow.value.genre,
      year: editedRow.value.year,
      coverImage: "https://picsum.photos/seed/684/400/400",
      isFavorite: editedRow.value.isFavorite,
    };
    await booksStore.addBook(newBook);
    isOpen.value = false;
    alert('Book added successfully!');
    await booksStore.fetchBooks(page.value, pageSize.value);
  } catch (error) {
    console.error('Error adding book:', error);
    alert('Failed to add the book.');
  }
};


const handleCoverImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target || !target.files || target.files.length === 0) {
    console.error("No valid file selected or target is invalid.");
    return;
  }

  const file = target.files[0];
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

  if (!validImageTypes.includes(file.type)) {
    alert('Please select a valid image file (JPEG, PNG, GIF).');
    coverImagePreview.value = null;
    return;
  }

  if (file.size > 1 * 1024 * 1024) { // 1 MB
    alert('Image must be less than 1 MB.');
    coverImagePreview.value = null;
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    coverImagePreview.value = reader.result as string;
    editedRow.value.coverImage = reader.result as string;
  };
  reader.readAsDataURL(file);
};



onMounted(async () => {
  await booksStore.fetchBooks(page.value, pageSize.value);
});
</script>
<template>
    <div>
   <div class="flex items-center justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
  <div class="flex-grow">
    <UInput v-model="q" placeholder="Filter books..." />
  </div>
  
  <div>
    <UButton color="white" variant="solid" @click="openAddBookDialog" >Add new book</UButton>
  </div>
</div>


      <div v-if="booksStore.error" class="text-center py-4 text-red-500">
        {{ booksStore.error }}
      </div>
  
      <div v-if="booksStore.loading" class="text-center py-4">
        Loading books...
      </div>
      <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">

        <UPagination v-model="page" :page-count="totalPages" :total="booksStore.totalBooks" />
      </div>
  
      <UTable
        color="blue"
        :rows="paginatedRows"
        :columns="[...columns, { key: 'actions', label: 'Actions' }]"
        @column-sort="toggleSort"
      >
        <template #isFavorite-data="{ row }">
          <button @click="booksStore.toggleFavorite(row.id)">
            <i :class="['pi', row.isFavorite ? 'pi-bookmark-fill' : 'pi-bookmark']"></i>
          </button>
        </template>
  
        <template #image-data="{ row }">
          <img
            :src="row.coverImage"
            alt="Book Cover"
            class="h-16 w-16 object-cover rounded"
          />
        </template>
  
        <template #actions-data="{ row }">
  <button @click="openEditDialog(row); isOpen = true">
    <i class="pi pi-pencil" style="font-size: 1.5rem; color: #4a5568;"></i>
  </button>
  <button @click="deleteRow(row)" style="color: red;">
    <i class="pi pi-trash" style="font-size: 1.5rem;"></i>
  </button>
</template>
      </UTable>
  
     
        <UButton label="Open" @click="isOpen = true" />

<UModal v-model="isOpen" :transition="false">
  <div class="p-4">
    <Placeholder class="h-48" />
    <form v-if="editedRow" @submit.prevent="editedRow.id ? submitEdit() : submitAddBook()">
        <div class="mb-4">
  <label class="block text-sm font-medium text-gray-700" style="color: coral;">Title</label>
  <UInput v-model="editedRow.title" placeholder="Title" required maxlength="20" />
  <small v-if="editedRow.title.length > 20" style="color: red;">Title must be 20 characters or less.</small>
</div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700"style="color: coral;">Author</label>
      <UInput v-model="editedRow.author" placeholder="Author" required />
    </div>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700"style="color: coral;">Genre</label>
      <USelect v-model="editedRow.genre" :options="genre" required />
    </div>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700"style="color: coral;">
      <template>
</template>
        IsFavorite </label>
      <UCheckbox :model-value="editedRow.isFavorite == true ? true : false" @click="editedRow.isFavorite = !editedRow.isFavorite" >

  </UCheckbox>    </div>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700" style="color: coral;">Year</label>
      <UInput type="number" v-model="editedRow.year" placeholder="Year" required />
    </div>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-200"style="color: coral;">Image</label>
      <img :src="editedRow.coverImage" :alt="editedRow.image" class="cover-image" style="height: 110px;" />
        <UInput required 
  type="file"
  size="sm"
  icon="i-heroicons-folder"
  @change="(event) => handleCoverImageChange(event)"
/>      <div v-if="coverImagePreview" class="mt-2">
              <img
                :src="coverImagePreview"
                alt="Cover Preview"
                class="h-16 w-16 object-cover rounded"
              />
            </div>
    </div>
    <div class="flex justify-end">
      <UButton type="button" color="gray" @click="isOpen = false">Cancel</UButton>
      <UButton type="submit"  color="blue" @click="isOpen = false">Save</UButton>
    </div>
  </form>
  </div>
</UModal>
  

    </div>
  </template>
  
  

<style scoped>
img {
  display: block;
  max-width: 100%;
  height: auto;
}
.h-16 {
  height: 4rem;
}
.pi {
  font-size: 1.5rem; 
  color: #f59e0b; 
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
button {
  background: none;
  border: none;
  cursor: pointer;
}

button i {
  font-size: 1.5rem;
  color: #f59e0b; 
  transition: color 0.3s;
}

button:hover i {
  color: #d97706; 
}
button i {
  font-size: 1.5rem;
  color: #4a5568;
  transition: color 0.3s;
}

button:hover i {
  color: #2d3748;
}
</style>
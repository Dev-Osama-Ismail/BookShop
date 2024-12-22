<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBooksStore } from '@/stores/books';
import BookFilters from './BookFilters.vue';
import BookTable from './BookTable.vue';
import BookPagination from './BookPagination.vue';
import BookDialog from './BookDialog.vue';

// Initialize the store
const booksStore = useBooksStore();

const route = useRoute();
const router = useRouter();

const q = ref(route.query.q || ''); 
const page = ref(Number(route.query.page) || 1); 
const pageSize = ref(10); 
const sortKey = ref<string | undefined>(undefined); 
const sortDirection = ref<'asc' | 'desc'>('asc'); 
const isEditDialogOpen = ref(false); 
const editedRow = ref<any | null>(null); 

// Computed values for pagination and total books
const totalPages = computed(() => booksStore.totalPages);
const totalBooks = computed(() => booksStore.totalBooks);
const paginatedRows = computed(() => booksStore.getFilteredBooks(page.value, q.value));

const fetchBooks = async () => {
  await booksStore.fetchBooks(page.value, pageSize.value, q.value);
};

// Watch for changes in query or page, and fetch data accordingly
watch(
  [q, page],
  async () => {
    router.push({ query: { q: q.value, page: String(page.value) } });
    await fetchBooks();
  },
  { immediate: true }
);

// Sync state with route.query
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.q !== q.value) q.value = newQuery.q || '';
    if (Number(newQuery.page) !== page.value) page.value = Number(newQuery.page) || 1;
  },
  { immediate: true }
);

const openEditDialog = (row: any) => {
  editedRow.value = { ...row };
  isEditDialogOpen.value = true;
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
  isEditDialogOpen.value = true;
};

const submitEdit = async (updatedRow: any) => {
  await booksStore.updateBook(updatedRow.id, updatedRow);
  isEditDialogOpen.value = false;
  await fetchBooks();
};

const submitAdd = async (newBook: any) => {
  await booksStore.addBook(newBook);
  isEditDialogOpen.value = false;
  await fetchBooks();
};

const deleteRow = async (row: any) => {
  await booksStore.deleteMyBook(row.id);
  await fetchBooks();
};

const toggleFavorite = async (bookId: number) => {
  await booksStore.toggleFavorite(bookId);
};

const toggleSort = (key: string) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'asc';
  }
};

onMounted(fetchBooks);
</script>

<template>
  <div>
    <!-- Search Filters -->
    <BookFilters v-model:q="q" @addBook="openAddBookDialog" />

    <!-- Error Handling -->
    <div v-if="booksStore.error" class="text-center py-4 text-red-500">
      {{ booksStore.error }}
    </div>

    <!-- Loading State -->
    <div v-if="booksStore.loading" class="text-center py-4">
      Loading books...
    </div>

    <!-- Pagination -->
    <BookPagination
      v-model:page="page"
      :totalPages="totalPages"
      :total="totalBooks"
    />

    <!-- Book Table -->
    <BookTable
      :rows="paginatedRows"
      :sortKey="sortKey"
      :sortDirection="sortDirection"
      @sort="toggleSort"
      @editRow="openEditDialog"
      @deleteRow="deleteRow"
      @toggleFavorite="toggleFavorite"
    />

    <!-- Add/Edit Dialog -->
    <BookDialog
      :isOpen="isEditDialogOpen"
      :editedRow="editedRow"
      @update:isOpen="isEditDialogOpen = $event"
      @submitEdit="submitEdit"
      @submitAdd="submitAdd"
    />
  </div>
</template>

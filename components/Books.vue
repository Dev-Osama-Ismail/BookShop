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

// Initialize route and router for URL state management
const route = useRoute();
const router = useRouter();

// States
const q = ref(route.query.q || ''); // Search query, initialized from URL
const page = ref(Number(route.query.page) || 1); // Current page, initialized from URL
const pageSize = ref(10); // Number of items per page
const sortKey = ref<string | undefined>(undefined); // Sorting column
const sortDirection = ref<'asc' | 'desc'>('asc'); // Sorting direction
const isEditDialogOpen = ref(false); // Dialog state
const editedRow = ref<any | null>(null); // Data being edited

// Computed Properties
const totalPages = computed(() => booksStore.totalPages);
const totalBooks = computed(() => booksStore.totalBooks);
const paginatedRows = computed(() => booksStore.getFilteredBooks(page.value, q.value));

// Fetch Books with Search and Pagination
const fetchBooks = async () => {
  await booksStore.fetchBooks(page.value, pageSize.value, q.value);
};

// Watchers for Search and Pagination
watch(
  [q, page],
  async () => {
    router.push({ query: { q: q.value, page: String(page.value) } }); // Sync URL with state
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

// Open Dialogs
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

// Submit Functions
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

// Row Actions
const deleteRow = async (row: any) => {
  await booksStore.deleteMyBook(row.id);
  await fetchBooks();
};

const toggleFavorite = async (bookId: number) => {
  await booksStore.toggleFavorite(bookId);
};

// Sorting
const toggleSort = (key: string) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'asc';
  }
};

// Initial Data Fetch
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

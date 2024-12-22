<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useBooksStore } from '@/stores/books';
import BookFilters from './BookFilters.vue';
import BookTable from './BookTable.vue';
import BookPagination from './BookPagination.vue';
import BookDialog from './BookDialog.vue';

const booksStore = useBooksStore();

const q = ref('');
const pageSize = ref(10);
const page = ref(1);
const sortKey = ref<string | undefined>(undefined);
const sortDirection = ref<'asc' | 'desc'>('asc');
const isEditDialogOpen = ref(false);
const editedRow = ref<any | null>(null);

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

const openEditDialog = (row: any) => {
  if (!row) return;
  editedRow.value = { ...row };
  isEditDialogOpen.value = true;
};

const deleteRow = async (row: any) => {
  let text = `Do you want to delete ${row.title} book?`;
  if (confirm(text)) {
    try {
      await booksStore.deleteMyBook(row.id);
      alert('Book deleted successfully!');
      await booksStore.fetchBooks(page.value, pageSize.value);
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete the book.');
    }
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

watch(page, async (newPage) => {
  if (!booksStore.pages[newPage]) {
    await booksStore.fetchBooks(newPage, pageSize.value);
  }
});

watch(q, () => {
  page.value = 1;
});

onMounted(async () => {
  await booksStore.fetchBooks(page.value, pageSize.value);
});
</script>

<template>
  <div>
    <BookFilters v-model:q="q" @addBook="openEditDialog({})" />

    <div v-if="booksStore.error" class="text-center py-4 text-red-500">
      {{ booksStore.error }}
    </div>
    <div v-if="booksStore.loading" class="text-center py-4">
      Loading books...
    </div>

    <BookTable
      :rows="paginatedRows"
      :sortKey="sortKey"
      :sortDirection="sortDirection"
      @sort="toggleSort"
      @editRow="openEditDialog"
      @deleteRow="deleteRow"
    />

    <!-- Pagination -->
    <BookPagination
      v-model:page="page"
      :totalPages="totalPages"
      :total="totalBooks"
    />

    <!-- Add/Edit Dialog -->
    <BookDialog v-model:isOpen="isEditDialogOpen" v-model:editedRow="editedRow" />
  </div>
</template>


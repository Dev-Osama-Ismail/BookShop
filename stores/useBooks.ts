import { ref, computed } from 'vue';
import { useBooksStore } from '@/stores/books';

export function useBooks() {
  const booksStore = useBooksStore();
  const page = ref(1);
  const pageSize = ref(10);

  const fetchBooks = async () => {
    await booksStore.fetchBooks(page.value, pageSize.value);
  };

  const totalPages = computed(() => booksStore.totalPages);
  const totalBooks = computed(() => booksStore.totalBooks);

  return {
    page,
    pageSize,
    fetchBooks,
    totalPages,
    totalBooks,
  };
}

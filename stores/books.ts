export const useBooksStore = defineStore('books', {
  state: () => ({
    pages: {} as Record<number, Array<any>>, 
    totalPages: 1, 
    totalBooks: 0, 
    currentPage: 1,
    loading: false,
    error: null as string | null,
    apiServer:"http://localhost:3005/api/"
  }),
  actions: {
    async fetchBooks(page: number, pageSize: number) {
      if (this.pages[page]) return;
    
      this.loading = true;
      this.error = null;
    
      try {
        const router = useRouter();
        router.push({ query: { page: page, page_size: pageSize.toString() } });

        const response = await fetch(`${this.apiServer}books?page=${page}&page_size=${pageSize}`);
        const data = await response.json();
    
        // Map API response to include an `image` key
        const booksWithImages = data.data.map((book: any) => ({
          ...book
        }));
    
        // Cache the transformed books
        this.pages[page] = booksWithImages;
    
        // Update totalPages and totalBooks
        this.totalPages = data.meta.total_pages;
        this.totalBooks = data.meta.total+10;
        this.currentPage = data.meta.current_page;
      } catch (err) {
        this.error = 'Failed to fetch books for the page.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    }
    
    ,
    
    async deleteMyBook(bookId:number) {
      console.log("osama")

      try {
        console.log("osama")
        const response = await fetch(`${this.apiServer}books/${bookId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete the book.');
        }

        // Optionally, remove the deleted book from the cached pages
        Object.keys(this.pages).forEach((page) => {
          this.pages[parseInt(page, 10)] = this.pages[parseInt(page, 10)].filter((b) => b.id !== bookId);
        });
      } catch (err) {
        console.error('Error deleting the book:', err);
        throw err;
      }
    },
    async updateBook(bookId: number, updatedData: any) {
      try {
        const response = await fetch(`${this.apiServer}books/${bookId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update the book.');
        }
  
        const updatedBook = await response.json();
  
        // Update the book in the cached pages
        Object.keys(this.pages).forEach((page) => {
          const bookIndex = this.pages[parseInt(page, 10)].findIndex((b) => b.id === bookId);
          if (bookIndex !== -1) {
            this.pages[parseInt(page, 10)][bookIndex] = updatedBook;
          }
        });
      } catch (err) {
        console.error('Error updating the book:', err);
      }
    },
    async addBook(newBook:any) {
      try {
        console.log(newBook)
        const response = await fetch(`${this.apiServer}books`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newBook),
        });
    
        if (!response.ok) {
          throw new Error('Failed to add the book.');
        }
        const addedBook = await response.json();
        console.log('Added Book:', addedBook);
      } catch (error) {
        console.error('Error adding book:', error);
        throw error;
      }
    },
    
    async toggleFavorite(bookId: number) {
      const book = Object.values(this.pages)
        .flat()
        .find((b) => b.id === bookId);
  
      if (book) {
        const updatedData = { ...book, isFavorite: !book.isFavorite };
        await this.updateBook(bookId, updatedData);
      }
    },
    getCachedPage(page: number) {
      return this.pages[page] || []; // Return cached data or an empty array if not available
    },
    getFilteredBooks(page: number, query: string) {
      const allBooks = Object.values(this.pages).flat();
      return allBooks.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      ).slice((page - 1) * 10, page * 10);
    },
    getAllCachedPages() {
      return Object.values(this.pages).flat(); // Combine all cached data into a single array
    },
  },
});

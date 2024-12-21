  <template>
    <div class="app-container">
      <!-- Global Header -->
      <header class="bg-blue-600 text-white py-4 px-8">
        <h1 class="text-2xl font-bold">📚 Bookshop App</h1>
      </header>

      <!-- Main Content Area (Dynamic Pages) -->
      <main class="container mx-auto p-8">
        <!-- This renders the current page from /pages directory -->
        <NuxtPage />
      </main>

      <!-- Global Footer -->
      <footer class="bg-gray-800 text-white text-center py-4">
        <p>&copy; 2024 Bookshop App | Powered by Nuxt 3 & TypeScript</p>
      </footer>
    </div>
  </template>

  <script setup lang="ts">
  // No additional TypeScript logic is needed in `app.vue`.
  // Nuxt automatically renders components/pages using <NuxtPage>.
  </script>

  <style>
  /* Global Styles */
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: #f8f8f8;
  }

  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
  }
  </style>

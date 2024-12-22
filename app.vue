  <template>
    <div class="app-container">
      <header class="bg-blue-600 text-white py-4 px-8">
        <h1 class="text-2xl font-bold"> Bookshop App</h1>
      </header>

      <main class="container mx-auto p-8">
        <NuxtPage />
      </main>

      <footer class="bg-gray-800 text-white text-center py-4">
        <p>&copy; Osama Ismail 2024</p>
      </footer>
    </div>
  </template>
  <script setup lang="ts">
  </script>

  <style>
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

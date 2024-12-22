<template>
    <table class="w-full table-auto border-collapse border border-gray-300">
      <thead>
        <tr>
          <th class="border border-gray-300 px-4 py-2" style="color: black;">Title</th>
          <th class="border border-gray-300 px-4 py-2" style="color: black;">Author</th>
          <th class="border border-gray-300 px-4 py-2" style="color: black;">Genre</th>
          <th class="border border-gray-300 px-4 py-2" style="color: black;">Year</th>
          <th class="border border-gray-300 px-4 py-2" style="color: black;">Favorite</th>
          <th class="border border-gray-300 px-4 py-2" style="color: black;">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td class="border border-gray-300 px-4 py-2" style="color: blue;">{{ row.title }}</td>
          <td class="border border-gray-300 px-4 py-2" style="color: blue;">{{ row.author }}</td>
          <td class="border border-gray-300 px-4 py-2" style="color: blue;">{{ row.genre }}</td>
          <td class="border border-gray-300 px-4 py-2" style="color: blue;">{{ row.year }}</td>
          <td class="border border-gray-300 px-4 py-2" style="color: blue;">
            <input type="checkbox" v-model="row.isFavorite" />
          </td>
          <td class="border border-gray-300 px-4 py-2 flex space-x-2">
            <button @click="editBook(row.id)" class="text-blue-500">
              <span class="material-icons">edit</span>
            </button>
            <button @click="deleteBook(row.id)" class="text-red-500">
              <span class="material-icons">delete</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  
  export interface TableRow {
    id: number;
    title: string;
    author: string;
    genre: string;
    year: number;
    isFavorite: boolean;
    coverImage: string;
  }
  
  export default defineComponent({
    name: 'BookTable',
    props: {
      rows: {
        type: Array as PropType<TableRow[]>,
        required: true,
      },
    },
    methods: {
      editBook(id: number) {
        console.log(`Editing book with id: ${id}`);
        // Add your edit logic here
      },
      deleteBook(id: number) {
        console.log(`Deleting book with id: ${id}`);
        // Add your delete logic here
      },
    },
  });
  </script>
  
  <style scoped>
  /* You can add additional styles here if needed */
  </style>
  
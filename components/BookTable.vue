<script setup lang="ts">
import { ref } from 'vue';
import 'primeicons/primeicons.css';

const props = defineProps({
  rows: Array,
  sortKey: String,
  sortDirection: String,
});

const emit = defineEmits(['editRow', 'deleteRow', 'sort', 'toggleFavorite']);
</script>

<template>
  <table class="table-auto w-full border-collapse border border-gray-300 mt-4">
    <thead>
      <tr>
        <th
          v-for="(column, index) in rows[0] ? Object.keys(rows[0]) : []"
          :key="index"
          class="border border-gray-300 px-4 py-2"
          style="color: blue"
        >
          <span @click="$emit('sort', column)">
            {{ column }}
          </span>
        </th>
        <th class="border border-gray-300 px-4 py-2" style="color: blue;">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row in rows"
        :key="row.id"
        class="border border-gray-300"
      >
        <td
          v-for="(value, key) in row"
          :key="key"
          class="px-4 py-2"
          style="color: blue"
        >
          <!-- Render Image -->
          <template v-if="key === 'coverImage'">
            <img
              :src="value"
              alt="Book Cover"
              class="h-16 w-16 object-cover rounded"
            />
          </template>
          <!-- Favorite Icon -->
          <template v-else-if="key === 'isFavorite'">
            <button @click="$emit('toggleFavorite', row.id)">
              <i
                :class="[ 
                  'pi',
                  row.isFavorite ? 'pi-bookmark-fill' : 'pi-bookmark',
                ]"
                style="font-size: 1.5rem; color: goldenrod; cursor: pointer;"
              ></i>
            </button>
          </template>
          <!-- Other Data -->
          <template v-else>
            {{ value }}
          </template>
        </td>
        <td class="px-4 py-2" >
          <button @click="$emit('editRow', row)">
            <i class="pi pi-pencil" style="font-size: 1.5rem; color: blue;"></i>
          </button>
          <button @click="$emit('deleteRow', row)">
            <i class="pi pi-trash" style="font-size: 1.5rem; color: red;"></i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
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

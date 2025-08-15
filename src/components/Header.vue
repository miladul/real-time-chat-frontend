<template>
  <header class="sticky top-0 z-50 flex justify-between items-center bg-gray-800 text-white px-5 py-3 shadow-md">
    <!-- Logo -->
    <div class="text-lg font-bold">MyChatApp</div>

    <!-- User dropdown -->
    <div class="relative" ref="dropdownRef">
      <button
          @click="toggleMenu"
          class="flex items-center space-x-2 hover:bg-gray-700 px-3 py-2 rounded"
      >
        <span>{{ store.user?.name }}</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Dropdown menu -->
      <div
          v-if="showMenu"
          class="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md overflow-hidden"
      >
        <button
            @click="logout"
            class="block w-full text-left px-4 py-2 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '../stores/auth';

const store = useAuthStore();
const showMenu = ref(false);
const dropdownRef = ref(null);

function toggleMenu() {
  showMenu.value = !showMenu.value;
}

function logout() {
  showMenu.value = false;
  store.logout(); // API + state clear
}

// Close dropdown if click outside
function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    showMenu.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

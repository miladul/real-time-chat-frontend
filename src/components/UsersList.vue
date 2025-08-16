<template>
  <div class="border-r border-gray-300 h-screen w-64">
    <h3 class="text-lg font-semibold p-3">Users</h3>
    <ul>
      <li
          v-for="u in users"
          :key="u.id"
          @click="selectUser(u)"
          class="flex justify-between items-center cursor-pointer hover:bg-gray-200 px-3 py-2"
          :class="{ 'bg-gray-200': u.id === activeUserId }"
      >
        <span>{{ u.name }}</span>
        <span
            v-if="u.unread_count > 0"
            class="bg-red-500 text-white text-xs rounded-full px-2 py-0.5"
        >
          {{ u.unread_count }}
        </span>
      </li>
    </ul>
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '../lib/api';
import { useAuthStore } from '../stores/auth';
import { echo } from '../lib/echo';

const users = ref([]);
const store = useAuthStore();
const activeUserId = ref(null); // will be set by parent when a user is selected
const emit = defineEmits(['selectUser']);

// Load users with initial unread counts
async function loadUsers() {
  const { data } = await api.get('/users');
  if (store.user) {
    users.value = data.data.filter(u => u.id !== store.user.id);
  } else {
    users.value = data.data;
  }
}

// Real-time listener for new messages
function setupRealtime() {
  echo.private(`chat.${store.user.id}`)
      .listen('MessageSent', (e) => {
        // If message is from a user we're NOT currently chatting with
        if (e.sender_id !== activeUserId.value) {
          const user = users.value.find(u => u.id === e.sender_id);
          if (user) {
            user.unread_count = (user.unread_count || 0) + 1;
          }
        }
      });
}

// Parent will call this when chat opens so we can reset count
function markAsRead(userId) {
  const user = users.value.find(u => u.id === userId);
  if (user) {
    user.unread_count = 0;
  }
  activeUserId.value = userId;
}

function selectUser(u) {
  activeUserId.value = u.id;
  markAsRead(u.id);
  // Tell the parent too
  emit('selectUser', u);
}

watch(
    () => store.user?.id,
    (id) => {
      if (id) {
        loadUsers();
        setupRealtime();
      }
    },
    { immediate: true }
);

defineExpose({ markAsRead });
</script>



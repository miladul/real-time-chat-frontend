<template>
  <div class="chat">
    <h3>Welcome, {{ store.user?.name }}</h3>
    <button @click="store.logout()">Logout</button>

    <div class="users">
      <h4>Users</h4>
      <ul>
        <li v-for="u in users" :key="u.id" @click="selectUser(u)">
          {{ u.name }}
        </li>
      </ul>
    </div>

    <div v-if="selectedUser" class="messages">
      <h4>Chat with {{ selectedUser.name }}</h4>
      <div class="message-box">
        <div v-for="m in messages" :key="m.id">
          <strong>{{ m.sender_id === store.user.id ? 'Me' : selectedUser.name }}:</strong> {{ m.message }}
        </div>
      </div>
      <form @submit.prevent="sendMessage">
        <input v-model="newMessage" placeholder="Type message..." />
        <button>Send</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../lib/api';
import { useAuthStore } from '../stores/auth';

const store = useAuthStore();
const users = ref([]);
const selectedUser = ref(null);
const messages = ref([]);
const newMessage = ref('');

onMounted(async () => {
  const { data } = await api.get('/users'); // API for all users
  users.value = data.filter(u => u.id !== store.user.id);
});

async function selectUser(user) {
  selectedUser.value = user;
  const { data } = await api.get(`/messages/${user.id}`);
  messages.value = data;
}

async function sendMessage() {
  if (!newMessage.value) return;
  const { data } = await api.post(`/messages/${selectedUser.value.id}`, { message: newMessage.value });
  messages.value.push(data);
  newMessage.value = '';
}
</script>

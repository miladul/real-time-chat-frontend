<template>
  <div class="flex flex-col flex-1">
    <h3 class="text-lg font-semibold pb-2 pl-2 bg-gray-200">
      Chat with {{ selectedUser.name }}
    </h3>

    <!-- Messages -->
    <div
        class="flex flex-col flex-1 overflow-y-auto p-4 space-y-2"
        ref="messagesBox"
    >
      <div
          v-for="m in messages"
          :key="m.id"
          :class="m.sender_id === store.user.id
          ? 'items-end'
          : 'items-start'"
          class="flex flex-col"
      >
        <div
            :class="m.sender_id === store.user.id
            ? 'bg-blue-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg'
            : 'bg-white text-gray-800 rounded-tl-lg rounded-tr-lg rounded-br-lg'"
            class="px-4 py-2 max-w-xs shadow-md"
        >
          {{ m.body }}
        </div>
        <span class="text-xs text-gray-500 mt-1">
          {{ formatTime(m.created_at) }}
        </span>
      </div>
    </div>

    <!-- Typing indicator -->
    <div
        v-if="typingFromThem"
        class="px-4 py-2 italic text-gray-500 text-sm"
    >
      {{ selectedUser.name }} is typing...
    </div>

    <!-- Input area -->
    <form
        @submit.prevent="sendMessage"
        class="flex items-center border-t border-gray-300 bg-white p-3 space-x-2"
    >
      <input
          v-model="newMessage"
          placeholder="Type a message..."
          @input="typing"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-full outline-none focus:ring focus:ring-blue-300"
      />
      <button
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 cursor-pointer"
      >
        Send
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import api from '../lib/api';
import { useAuthStore } from '../stores/auth';
import { echo } from '../lib/echo';

const props = defineProps({ selectedUser: Object });
const store = useAuthStore();

const messages = ref([]);
const newMessage = ref('');
const messagesBox = ref(null);
const typingFromThem = ref(false);
let typingTimeout = null;

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function loadMessages() {
  if (!props.selectedUser?.id) return;
  const { data } = await api.get(`/messages/${props.selectedUser.id}`);
  messages.value = data.data;
  scrollToBottom();
}

async function sendMessage() {
  if (!newMessage.value.trim()) return;
  try {
    const { data } = await api.post('/messages', {
      receiver_id: props.selectedUser.id,
      body: newMessage.value,
    });
    messages.value.push(data.data);
    newMessage.value = '';
    scrollToBottom();
  } catch (e) {
    console.error(e);
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesBox.value)
      messagesBox.value.scrollTop = messagesBox.value.scrollHeight;
  });
}

function typing() {
  if (!props.selectedUser?.id) return;
  api.post('/typing', { receiver_id: props.selectedUser.id }).catch(console.error);
}

watch(
    () => props.selectedUser,
    (newUser) => {
      if (!newUser?.id) return;
      loadMessages();

      echo.private(`chat.${store.user.id}`)
          .listen('MessageSent', (e) => {
            if (e.sender_id === props.selectedUser.id) {
              messages.value.push(e);
              scrollToBottom();
            }
          });

      echo.private(`chat.${store.user.id}`)
          .listen('.UserTyping', e => {
            typingFromThem.value = e.from === props.selectedUser.id;
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => typingFromThem.value = false, 1000);
          });
    },
    { immediate: true }
);
</script>

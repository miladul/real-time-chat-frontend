<template>
  <div id="app" class="flex flex-col">
    <Header/>
    <Login v-if="!store.isLoggedIn && page === 'login'" @switch="page = $event" />
    <Register v-if="!store.isLoggedIn && page === 'register'" @switch="page = $event" />
    <ChatLayout v-if="store.isLoggedIn && store.user" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import ChatLayout from './components/ChatLayout.vue';
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

const store = useAuthStore();
const page = ref('login');

onMounted(async () => {
  if (store.token) {
    try {
      await store.getUser();
    } catch {
      store.logout();
    }
  }
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-center mb-6">Login</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <input
            v-model="email"
            placeholder="Email"
            type="email"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
            v-model="password"
            placeholder="Password"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>

      <p class="text-center mt-4 text-gray-600">
        Don't have an account?
        <button
            @click="$emit('switch', 'register')"
            class="text-blue-500 hover:underline"
        >
          Register
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const store = useAuthStore();
const email = ref('');
const password = ref('');

async function handleLogin() {
  try {
    await store.login(email.value, password.value);
  } catch (err) {
    alert('Login failed');
  }
}
</script>

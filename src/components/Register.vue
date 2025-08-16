<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-center mb-6">Register</h2>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <input
            v-model="name"
            placeholder="Name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
            v-model="email"
            placeholder="Email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
            v-model="password"
            placeholder="Password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
            type="submit"
            class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition cursor-pointer"
        >
          Register
        </button>

        <!-- Error message -->
        <p v-if="errorMessage" class="text-red-500 text-sm mt-2 text-center">
          {{ errorMessage }}
        </p>
      </form>

      <p class="text-center mt-4 text-gray-600">
        Already have an account?
        <button
            @click="$emit('switch', 'login')"
            class="text-blue-500 hover:underline cursor-pointer"
        >
          Login
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const store = useAuthStore();
const name = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');

async function handleRegister() {
  errorMessage.value = ''; // reset error message
  try {
    await store.register(name.value, email.value, password.value);
    await store.login(email.value, password.value);
  } catch (err) {
    console.log('err', err.message);
    errorMessage.value =
        err?.message || 'Registration failed. Please try again.';
  }
}
</script>

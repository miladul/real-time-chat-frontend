<template>
  <div class="flex">
    <UsersList @selectUser="setSelectedUser" />
    <div class="flex flex-col flex-1">
      <OneToOneChat v-if="selectedUser" :selectedUser="selectedUser" />
      <div
          v-else
          class="flex flex-1 justify-center items-center text-gray-500"
      >
        Select a user to start chatting
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UsersList from './UsersList.vue';
import OneToOneChat from './OneToOneChat.vue';

const selectedUser = ref(null);

function setSelectedUser(user) {
  selectedUser.value = user;
}
</script>

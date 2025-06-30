<script setup lang="ts">
import Avatar from 'primevue/avatar'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
</script>

<template>
  <nav class="navbar">
    <div class="title">Bar'app</div>
    <Avatar label="u" shape="circle" />
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f5f5f5;
}
.title {
  font-weight: bold;
}
</style>

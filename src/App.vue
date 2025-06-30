<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import Navbar from './components/Navbar.vue'

const route = useRoute()
const auth = useAuthStore()
</script>

<template>
  <Navbar v-if="auth.isAuthenticated && route.path !== '/'" />
  <RouterView />
</template>

<style scoped>
</style>

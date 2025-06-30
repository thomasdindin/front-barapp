<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="landing">
    <h1>Bienvenue sur Bar'app</h1>
    <RouterLink to="/login">
      <Button>Connexion</Button>
    </RouterLink>
    <RouterLink to="/register" class="ml-2">
      <Button>Inscription</Button>
    </RouterLink>
  </main>
</template>

<style scoped>
.landing {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 60vh;
}
</style>

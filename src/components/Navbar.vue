<script setup lang="ts">
import Avatar from 'primevue/avatar'
import { useAuthStore } from '../stores/auth'
import router from "@/router";

const auth = useAuthStore()

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="flex flex-row justify-between p-6 border-b-1 static" style="background: var(--p-content-background)">
    <div class="title">Bar'app</div>

    <div v-if="auth.isAdmin" class="flex gap-2">
      <Button severity="secondary"  @click="router.push('/gestion/cocktails')" >Cocktails</Button>
      <Button severity="secondary" @click="router.push('/gestion/ingredients')">Ingrédients</Button>
      <Button severity="secondary" @click="router.push('/gestion/commandes')">Commandes</Button>
    </div>

    <div class="flex gap-2">
      <Button icon="fa-solid fa-cart-shopping" @click="router.push('/cart')"/>
      <Button icon="fa-solid fa-right-from-bracket" @click="logout"/>
    </div>
  </nav>
</template>

<style scoped>
</style>

<script setup lang="ts">
import Avatar from 'primevue/avatar'
import OverlayBadge from 'primevue/overlaybadge'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import router from "@/router";

const auth = useAuthStore()
const cart = useCartStore()

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

    <div v-else class="flex gap-2">
      <Button severity="secondary" @click="router.push('/home')">Accueil</Button>
      <Button severity="secondary" @click="router.push('/mes-commandes')">Mes commandes</Button>
    </div>

    <div class="flex gap-2">
      <OverlayBadge :value="cart.itemCount" v-if="!auth.isAdmin">
        <Button icon="fa-solid fa-cart-shopping" @click="router.push('/cart')"/>
      </OverlayBadge>
      <Button icon="fa-solid fa-right-from-bracket" @click="logout"/>
    </div>
  </nav>
</template>

<style scoped>
</style>

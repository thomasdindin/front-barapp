<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const username = ref('')
const password = ref('')

async function submit() {
  await auth.register(username.value, password.value)
  router.push('/home')
}
</script>

<template>
  <main class="register">
    <h2>Inscription</h2>
    <div class="form">
      <input v-model="username" placeholder="Nom d'utilisateur" />
      <input v-model="password" type="password" placeholder="Mot de passe" />
      <Button @click="submit">S'inscrire</Button>
    </div>
  </main>
</template>

<style scoped>
.register {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding-top: 2rem;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 200px;
}
</style>


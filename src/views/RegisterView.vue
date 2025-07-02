<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const nom = ref('')
const prenom = ref('')

function submit() {
  auth.register(email.value, password.value, nom.value, prenom.value).then(() => {
    router.push('/login')
  }).catch((error) => {
    console.error('Registration failed:', error)
    // Optionally, handle registration failure (e.g., show a notification)
  })
}
</script>

<template>
  <main class="register">
    <h2>Inscription</h2>
    <div class="form">
      <input v-model="nom" placeholder="Nom" />
      <input v-model="prenom" placeholder="Prénom" />
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Mot de passe" />
      <Button @click="submit">S'inscrire</Button>
    </div>
  </main>
</template>

<style scoped>
</style>
